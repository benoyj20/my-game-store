import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bcrypt from "bcrypt";
import dayjs from "dayjs";

const app = express();
const saltRounds = 10;

app.use(cors({
  origin: "https://my-game-store-1.onrender.com"
}));
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 28698,
  ssl: { rejectUnauthorized: false }
});

db.connect(err => {
  if (err) console.log("MySQL connection error:", err);
  else console.log("MySQL connected");
});

app.post("/register", async (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const contact_number = req.body.contact_number;
  const apartment_no = req.body.apartment_no;
  const street = req.body.street;
  const city = req.body.city;
  const state = req.body.state;
  
  try {
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
      }
      else {
          const [resultSets]  = await db.promise().query(
            "call register_customer(?,?,?,?,?,?,?,?,?)",
            [firstName, lastName, email, contact_number, hash, apartment_no, street, city, state]
          );
          const firstRow = resultSets[0][0];
          res.json({ success: firstRow.status, message: firstRow.message});
      }
    });
  } catch (err) {
    console.log("Registration failed");
    console.error(err);
  }
});

app.post("/login", async (req, res) => {
  const { email, password: inputPassword } = req.body;

  try {
    // 1. Get the stored hash from the DB
    const [procResult] = await db.promise().query("CALL get_user_password(?)", [email]);
    const firstResultSet = procResult[0];

    // Check if email exists
    if (!firstResultSet || firstResultSet.length === 0 || firstResultSet[0].status === "false") {
      return res.status(404).json({ 
        success: "false", 
        message: firstResultSet?.[0]?.message || "User not found" 
      });
    }

    const storedHashedPassword = firstResultSet[0].password;

    // 2. Use the PROMISE version of bcrypt.compare (no callback)
    const isMatch = await bcrypt.compare(inputPassword, storedHashedPassword);

    if (!isMatch) {
      return res.status(401).json({ success: "false", message: "Incorrect password" });
    }

    // 3. Finalize login via stored procedure
    const [loginResult] = await db.promise().query("CALL login_user(?, ?)", [email, storedHashedPassword]);
    const loginRow = loginResult[0][0];

    // 4. Send success response
    return res.json({
      success: loginRow.status,
      message: loginRow.message,
      role: loginRow.role_type,
      firstName: loginRow.first_name,
    });

  } catch (err) {
    console.error("CRITICAL LOGIN ERROR:", err);
    // CRUCIAL: Always send a response so React knows it failed
    return res.status(500).json({ 
      success: "false", 
      message: "Internal server error. Please check backend logs." 
    });
  }
});

app.get("/stores", async (req, res) => {
  try {
    const [result] = await db.promise().query("CALL get_all_store_details()");
    if(result[0][0].status === "false") {
      return res.json({ success: result[0][0].status, message: result[0][0].message });
    }
    return res.json({
        success: result[0][0].status,
        message: result[0][0].message,
        data: result[0],
      });
  } catch (err) {
    console.error("Query error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/employees", async (req, res) => {
  try {
    const [result] = await db.promise().query("CALL get_all_employee_details()");
    if(result[0][0].status === "false") {
      return res.json({ success: result[0][0].status, message: result[0][0].message });
    }
    return res.json({
        success: result[0][0].status,
        message: result[0][0].message,
        data: result[0],
      });
  } catch (err) {
    console.error("Query error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/game", async (req, res) => {
  try {
    const filters = req.body.selectedFiltersSQL || {};
    const storeName = req.body.storeData || '';
    const platform = req.body.platformData || '';

    const {
      genre = [],
      price = [],
      rating = [],
      developer = [],
      publisher = []
    } = filters;

    const [result] = await db.promise().query(
      "CALL filter_games(?,?,?,?,?,?,?)",
      [
        storeName,        
        genre.join(","), 
        platform,                  
        rating.join(","),                 
        developer.join(","),              
        publisher.join(","),               
        JSON.stringify(price),            
      ]
    );
    return res.json({
        data: result[0],
      });
  } catch (err) {
    console.error("Error filtering games:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/getGameTitles", async (req, res) => {
  try {
    const [result] = await db.promise().query("CALL get_all_game_titles()");
    if(result[0][0].status === "false") {
      return res.json({ success: result[0][0].status, message: result[0][0].message });
    } 
    return res.json({
        success: result[0][0].status,
        message: result[0][0].message,
        data: result[0],
      });
  } catch (err) {
    console.error("Query error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/publishers", async (req, res) => {
  try {
    const [result] = await db.promise().query("CALL get_publishers_with_games()");
    if(result[0][0].status === "false") {
      return res.json({ success: result[0][0].status, message: result[0][0].message });
    }
    return res.json({
        success: result[0][0].status,
        message: result[0][0].message,
        data: result[0],
      });
  } catch (err) {
    console.error("Query error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/platforms", async (req, res) => {
  try {
    const [result] = await db.promise().query("CALL get_all_platforms()");
    if(result[0][0].status === "false") {
      return res.json({ success: result[0][0].status, message: result[0][0].message });
    }
    return res.json({
        success: result[0][0].status,
        message: result[0][0].message,
        data: result[0],
      });
  } catch (err) {
    console.error("Query error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/genres", async (req, res) => {
  try {
    const [result] = await db.promise().query("CALL get_all_genres()");
    if(result[0][0].status === "false") {
      return res.json({ success: result[0][0].status, message: result[0][0].message });
    }
    return res.json({
        success: result[0][0].status,
        message: result[0][0].message,
        data: result[0],
      });
  } catch (err) {
    console.error("Query error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/developers", async (req, res) => {
  try {
    const [result] = await db.promise().query("CALL get_all_developers()");
    if(result[0][0].status === "false") {
      return res.json({ success: result[0][0].status, message: result[0][0].message });
    }
    return res.json({
        success: result[0][0].status,
        message: result[0][0].message,
        data: result[0],
      });
  } catch (err) {
    console.error("Query error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/reviews", async (req, res) => {
  const reviewFilters = req.body.selectedFiltersSQL || {};
  const {
    reviewDate = [], 
    rating = [],     
    publisher = []  
  } = reviewFilters;

  try {
    const [result] = await db.promise().query(
      "CALL filter_reviews(?,?,?)",
      [
        reviewDate.join(","),  
        rating.join(","),      
        publisher.join(",")    
      ]
    );

    return res.json({
      data: result[0],  
    });
  } catch (err) {
    console.error("Error filtering reviews:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/submitReview", async (req, res) => {
    const { game, rating, comment, email } = req.body; 

    try {
    const [result] = await db
      .promise()
      .query("CALL submit_review(?,?,?,?)", [game, rating, comment, email]);

      const resultData = result[0][0];

      return res.json({
        success: resultData.success,
        message: resultData.message
      });
  } catch (err) {
    console.error(err);
  }
});

app.post("/customerProfile", async (req, res) => {
  const { email } = req.body;
  try {
    const [result] = await db.promise().query("call get_customer_details_by_email(?)", [email]);
    const resultData = result[0][0];
    return res.json({
        result: resultData
      });
  } catch (err) {
    console.error("Query error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/adminProfile", async (req, res) => {
    const { email } = req.body;
  try {
    const [result] = await db.promise().query("call get_admin_details_by_email(?)", [email]);
    const resultData = result[0][0];
    return res.json({
        result: resultData
      });
  } catch (err) {
    console.error("Query error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/employeeProfile", async (req, res) => {
    const { email } = req.body;
  try {
    const [result] = await db.promise().query("call get_employee_details_by_email(?)", [email]);
    const resultData = result[0][0];
    return res.json({
        result: resultData
      });
  } catch (err) {
    console.error("Query error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/myOrders", async (req, res) => {
  const { email } = req.body;
  try {
    const [result] = await db.promise().query("call get_customer_orders(?)", [email]);
    const resultData = result[0];
    return res.json({
        result: resultData
      });
  } catch (err) {
    console.error("Query error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/myReviews", async (req, res) => {
  const { email } = req.body;
  try {
    const [result] = await db.promise().query("call get_customer_reviews(?)", [email]);
    const resultData = result[0];
    return res.json({
        result: resultData
      });
  } catch (err) {
    console.error("Query error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/updateCustomerProfile", async (req, res) => {
    const { email, first_name, last_name, contact_number, apartment_no, street, city, state } = req.body;
    try {
      const [result] = await db.promise().query("call update_customer_profile(?,?,?,?,?,?,?,?)", 
        [email, first_name, last_name, contact_number, apartment_no, street, city, state]);
      const resultData = result[0][0];
      return res.json({
          success: resultData.status,
          message: resultData.message
        });
    } catch (err) {
      console.error("Query error:", err);
      res.status(500).json({ error: "Something went wrong" });
    }
});

app.post("/updateEmployeeProfile", async (req, res) => {
    const { email, first_name, last_name, phone } = req.body;
    try {
      const [result] = await db.promise().query("call update_employee_profile(?,?,?,?)", 
        [email, first_name, last_name, phone]);
      const resultData = result[0][0];
      return res.json({
          success: resultData.status,
          message: resultData.message
        });
    } catch (err) {
      console.error("Query error:", err);
      res.status(500).json({ error: "Something went wrong" });
    }
});

app.post("/updateAdminProfile", async (req, res) => {
    const { email, first_name, last_name, phone } = req.body;
    try {
      const [result] = await db.promise().query("call update_admin_profile(?,?,?,?)", 
        [email, first_name, last_name, phone]);
      const resultData = result[0][0];
      return res.json({
          success: resultData.status,
          message: resultData.message
        });
    } catch (err) {
      console.error("Query error:", err);
      res.status(500).json({ error: "Something went wrong" });
    }
});

app.post("/submitEmployee", async (req, res) => {
    const { 
        firstName,
        lastName,
        email,
        password,
        phone,
        role,
        store,
        hireDate
    } = req.body;

    const formattedHireDate = hireDate ? dayjs(hireDate).format('YYYY-MM-DD') : null;
    
    try {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
      }
      else {
          const [result] = await db.promise().query("call register_employee(?,?,?,?,?,?,?,?)", 
          [firstName,lastName,email,hash,phone,store,role,formattedHireDate]);
          const resultData = result[0][0];
          return res.json({
              success: resultData.status,
              message: resultData.message
            });
      }
      });
    } catch (err) {
      console.error("Query error:", err);
      res.status(500).json({ error: "Something went wrong" });
    }
});

app.post("/updateEmployee", async (req, res) => {
    const { 
        email,
        phone,
        store,
        role
    } = req.body;
    
    try {
      const [result] = await db.promise().query("call update_employee_details(?,?,?,?)", 
      [email,phone,store,role]);
      const resultData = result[0][0];
      return res.json({
          success: resultData.status,
          message: resultData.message
        });
      
    } catch (err) {
      console.error("Query error:", err);
      res.status(500).json({ error: "Something went wrong" });
    }
});

app.post("/deleteEmployee", async (req, res) => {
    const { 
        email
    } = req.body;
    
    try {
      const [result] = await db.promise().query("call delete_employee(?)", 
      [email]);
      const resultData = result[0][0];
      return res.json({
          success: resultData.status,
          message: resultData.message
        });
      
    } catch (err) {
      console.error("Query error:", err);
      res.status(500).json({ error: "Something went wrong" });
    }
});

app.post("/submitStore", async (req, res) => {
    const { 
        storeName,
        buildingNo,
        street,
        city,
        state,
        contactNo,
    } = req.body;
    
    try {
    const [result] = await db.promise().query("call insert_store(?,?,?,?,?,?)", 
    [storeName,buildingNo,street,city,state,contactNo]);
    const resultData = result[0][0];
    return res.json({
        success: resultData.status,
        message: resultData.message
      });
    } catch (err) {
      console.error("Query error:", err);
      res.status(500).json({ error: "Something went wrong" });
    }
});

app.post("/updateStore", async (req, res) => {
    const { 
        storeName,
        buildingNo,
        street,
        city,
        state,
        contactNo,
    } = req.body;
    
    try {
    const [result] = await db.promise().query("call update_store_details(?,?,?,?,?,?)", 
    [storeName,buildingNo,street,city,state,contactNo]);
    const resultData = result[0][0];
    return res.json({
        success: resultData.status,
        message: resultData.message
      });
    } catch (err) {
      console.error("Query error:", err);
      res.status(500).json({ error: "Something went wrong" });
    }
});

app.post("/deleteStore", async (req, res) => {
    const { 
        storeName
    } = req.body;
    
    try {
    const [result] = await db.promise().query("call delete_store(?)", 
    [storeName]);
    const resultData = result[0][0];
    return res.json({
        success: resultData.status,
        message: resultData.message
      });
    } catch (err) {
      console.error("Query error:", err);
      res.status(500).json({ error: "Something went wrong" });
    }
});

app.post("/submitPublisher", async (req, res) => {
    const { 
        name,
        year_founded,
        country
    } = req.body;

    const year_founded_formatted = year_founded ? dayjs(year_founded).format('YYYY') : null;
    
    try {
    const [result] = await db.promise().query("call insert_publisher(?,?,?)", 
    [name, year_founded_formatted, country]);
    const resultData = result[0][0];
    return res.json({
        success: resultData.status,
        message: resultData.message
      });
    } catch (err) {
      console.error("Query error:", err);
      res.status(500).json({ error: "Something went wrong" });
    }
});

app.post("/updatePublisher", async (req, res) => {
    const { 
        name,
        year_founded,
        country
    } = req.body;

    const year_founded_formatted = year_founded ? dayjs(year_founded).format('YYYY') : null;
    
    try {
    const [result] = await db.promise().query("call update_publisher(?,?,?)", 
    [name, year_founded_formatted, country]);
    const resultData = result[0][0];
    return res.json({
        success: resultData.status,
        message: resultData.message
      });
    } catch (err) {
      console.error("Query error:", err);
      res.status(500).json({ error: "Something went wrong" });
    }
});

app.post("/deletePublisher", async (req, res) => {
    const { 
        name
    } = req.body;
    
    try {
    const [result] = await db.promise().query("call delete_publisher(?)", 
    [name]);
    const resultData = result[0][0];
    return res.json({
        success: resultData.status,
        message: resultData.message
      });
    } catch (err) {
      console.error("Query error:", err);
      res.status(500).json({ error: "Something went wrong" });
    }
});

app.post("/deleteAccount", async (req, res) => {
    const { 
        email
    } = req.body;
    
    try {
    const [result] = await db.promise().query("call delete_user_account(?)", 
    [email]);
    const resultData = result[0][0];
    return res.json({
        success: resultData.status,
        message: resultData.message
      });
    } catch (err) {
      console.error("Query error:", err);
      res.status(500).json({ error: "Something went wrong" });
    }
});

app.post("/submitGame", async (req, res) => {
  const { 
      game, 
      releaseDate,
      description,
      amount, 
      developer,
      rating,
      publisher,
      genre
    } = req.body;

  const formattedReleaseDate = releaseDate 
      ? dayjs(releaseDate).format('YYYY-MM-DD') 
      : null;

  try {
  const [result] = await db.promise().query("call insert_game(?,?,?,?,?,?,?,?)", 
  [game, formattedReleaseDate, description, amount, developer, rating, publisher, genre.join(",")]);
  const resultData = result[0][0];
  return res.json({
      success: resultData.status,
      message: resultData.message
    });
  } catch (err) {
    console.error("Query error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/updateGame", async (req, res) => {
  const { 
      game, 
      releaseDate,
      description,
      amount, 
      developer,
      rating,
      publisher,
      genre
    } = req.body;

  const formattedReleaseDate = releaseDate 
      ? dayjs(releaseDate).format('YYYY-MM-DD') 
      : null;

  try {
  const [result] = await db.promise().query("call update_game(?,?,?,?,?,?,?,?)", 
  [game, formattedReleaseDate, description, amount, developer, rating, publisher, genre.join(",")]);
  const resultData = result[0][0];
  return res.json({
      success: resultData.status,
      message: resultData.message
    });
  } catch (err) {
    console.error("Query error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});


app.post("/deleteGame", async (req, res) => {
    const { 
      game
    } = req.body;

  try {
  const [result] = await db.promise().query("call delete_game(?)", [game,]);
  const resultData = result[0][0];
  return res.json({
      success: resultData.status,
      message: resultData.message
    });
  } catch (err) {
    console.error("Query error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/updateGameInventory", async (req, res) => {
  console.log("Received request to update game inventory:", req.body);
    const { 
      game, 
      amount,
      email,
      platform
    } = req.body;
  try {
  const [result] = await db.promise().query("call update_inventory(?,?,?,?)", 
  [game, amount, email, platform]);
  const resultData = result[0][0];
  return res.json({
      success: resultData.status,
      message: resultData.message
    });
  } catch (err) {
    console.error("Query error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});


app.post("/submit_order", async (req, res) => {
    const { email, gameTitle, quantity, storeData, platformData } = req.body;
    try {
      const [result] = await db.promise().query("call submit_order(?,?,?,?,?)", 
      [gameTitle, platformData, quantity, email, storeData]);
      const resultData = result[0][0];
      return res.json({
          success: resultData.status,
          message: resultData.message
        });
    } catch (err) {
      console.error("Query error:", err);
      res.status(500).json({ error: "Something went wrong" });
    }
});

app.post("/getWishlistNames", async (req, res) => {
    const { email } = req.body;
    try {
      const [result] = await db.promise().query("call get_user_wishlist_names(?)", 
      [email]); 
      const resultData = result[0][0];
      return res.json({
          data: resultData.wishlist_names,
          success: resultData.status,
          message: resultData.message
        });
    } catch (err) {
      console.error("Query error:", err);
      res.status(500).json({ error: "Something went wrong" });
    }
});

app.post("/submitWishlist", async (req, res) => {
    const { wishlistName, games, email } = req.body;
    try {
      const [result] = await db.promise().query("call create_wishlist(?,?,?)", 
      [wishlistName, games.join(","), email]);
      const resultData = result[0][0];
      return res.json({
          success: resultData.status,
          message: resultData.message
        });
    } catch (err) {
      console.error("Query error:", err);
      res.status(500).json({ error: "Something went wrong" });
    }
});

app.post("/deleteWishlist", async (req, res) => {
    const { wishlistName } = req.body;
    try {
      const [result] = await db.promise().query("call delete_wishlist_by_name(?)", 
      [wishlistName]);
      const resultData = result[0][0];
      return res.json({
          success: resultData.status,
          message: resultData.message
        });
    } catch (err) {
      console.error("Query error:", err);
      res.status(500).json({ error: "Something went wrong" });
    }
});

app.post("/getUserWishlists", async (req, res) => {
    const { email } = req.body;
    try {
      const [result] = await db.promise().query("call get_user_wishlists_with_games(?)",
      [email]);
      const resultData = result[0];
      if(resultData.length !== 0) {
        return res.json({
          data: resultData,
          success: resultData[0].status,
          message: resultData[0].message
        });
      }
      return res.json({
          data: [],
          success: 'false',
          message: "No wishlists found"
        });
      
    } catch (err) {
      console.error("Query error:", err);
      res.status(500).json({ error: "Something went wrong" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/", (req, res) => {
  db.query("SELECT 1", (err) => {
    if (err) return res.status(500).send("Server is live but database is disconnected.");
    res.send("Game Store Backend is live and connected to Aiven MySQL!");
  });
});