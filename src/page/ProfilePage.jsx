import "react-multi-carousel/lib/styles.css";
import WebsiteHeader from '../components/WebsiteHeader.jsx';
import '../components/css/ProfilePage.css';
import Divider from '@mui/material/Divider';
import ReviewDetailsCard from '../components/ReviewDetailsCard.jsx';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import OrderDetailsCard from "../components/OrderDetailsCard.jsx";
import StoreDetailsCard from "../components/StoreDetailsCard.jsx";
import EmployeeDetailsCard from "../components/EmployeeDetailsCard.jsx";
import WishlistDetailsCard from "../components/WishlistDetailsCard.jsx";

import { useAuth } from '../../AuthContext';

export default function ProfilePage() {
    const { user } = useAuth();
    
    const [profile, setProfile] = useState(null);
    const [stores, setStores] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [fieldValues, setFieldValues] = useState({});
    const [editableFields, setEditableFields] = useState({});

    const [reviews, setReviews] = useState([]);
    const [orders, setOrders] = useState([]);
    const [wishlists, setWishlists] = useState([]);

    useEffect(() => {
        if (profile) {
            setFieldValues(profile);

            const initialEditable = {};
            Object.keys(profile).forEach((key) => {
                initialEditable[key] = false;
            });
            setEditableFields(initialEditable);
        }
    }, [profile]);

    const handleEditClick = (key) => {
        setEditableFields((prev) => ({ ...prev, [key]: true }));
    };

    const handleSaveClick = async (key) => {
        setEditableFields((prev) => ({ ...prev, [key]: false }));

        try {
            let endpoint = "";

            if (user.role === "customer") endpoint = "https://my-game-store.onrender.com/updateCustomerProfile";
            else if (user.role === "admin") endpoint = "https://my-game-store.onrender.com/updateAdminProfile";
            else if (user.role === "employee") endpoint = "https://my-game-store.onrender.com/updateEmployeeProfile";
            else return;

            const payload = { email: user.email, ...fieldValues };
            const res = await axios.post(endpoint, payload);

            if (res.data.success === "true") console.log(`Updated ${key} successfully!`);
            else console.warn(`Failed to update ${key}:`, res.data.message);
        } catch (err) {
            console.error(`Error updating ${key}:`, err);
        }
    };

    const handleChange = (key, value) => {
        setFieldValues((prev) => ({ ...prev, [key]: value }));
    };

    const fetchUserDetails = useCallback(async () => {
        if (!user || !user.email) return;

        try {
            const [resOrders, resReviews, resWishlists] = await Promise.all([
                axios.post("https://my-game-store.onrender.com/myOrders", { email: user.email }),
                axios.post("https://my-game-store.onrender.com/myReviews", { email: user.email }),
                axios.post("https://my-game-store.onrender.com/getUserWishlists", { email: user.email })
            ]);
            if(resOrders.data.result[0].status =="true"){
                setOrders(resOrders.data.result);
            }
            if(resReviews.data.result[0].status == "true"){
                setReviews(resReviews.data.result);
            }
            if(resWishlists.data.success == "true"){
                setWishlists(resWishlists.data.data);
            }
        } catch (err) {
            console.error("Error fetching user details:", err);
        }
    }, [user]);

    useEffect(() => {
        fetchUserDetails();
    }, [fetchUserDetails]);

    const fetchProfile = useCallback(async () => {
        if (!user || !user.email) return;

        try {
            let endpoint = "";

            if (user.role === "customer") endpoint = "https://my-game-store.onrender.com/customerProfile";
            else if (user.role === "admin") endpoint = "https://my-game-store.onrender.com/adminProfile";
            else if (user.role === "employee") endpoint = "https://my-game-store.onrender.com/employeeProfile";
            else return;

            const res = await axios.post(endpoint, { email: user.email });

            if (user.role === "customer") {
                setProfile({
                    first_name: res.data.result.first_name,
                    last_name: res.data.result.last_name,
                    contact_number: res.data.result.contact_number,
                    apartment_no: res.data.result.apartment_no,
                    street: res.data.result.street,
                    city: res.data.result.city,
                    state: res.data.result.state
                });
            } else if (user.role === "admin" || user.role === "employee") {
                setProfile({
                    first_name: res.data.result.first_name,
                    last_name: res.data.result.last_name,
                    phone: res.data.result.contact_number
                });
            }
        } catch (err) {
            console.error("Error fetching profile:", err);
        }
    }, [user]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const fetchAllData = useCallback(async () => {
        const storePromise = axios.get("https://my-game-store.onrender.com/stores");
        const employeePromise = axios.get("https://my-game-store.onrender.com/employees");

        try {
            const [storesRes, employeesRes] = await Promise.all([storePromise, employeePromise]);
            setStores(storesRes.data.data);
            setEmployees(employeesRes.data.data);
        } catch (err) {
            console.error("Error fetching initial data:", err);
        }
    }, []);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    return (
        <div>
            <WebsiteHeader />
            <h1 className="cart-page-font cart-page-title-spacing">My Profile</h1>
            <Divider sx={{ margin: '0 20px 40px 20px', borderColor: 'purple' }} />
            
            <div className="profile-edit-box">
                {Object.keys(fieldValues).map((key) => (
                    <Box key={key} display="flex" alignItems="center" className="profile-edit-box" sx={{ width: "50%", marginLeft: 22 }}>
                        <TextField
                            label={key.charAt(0).toUpperCase() + key.slice(1)}
                            value={fieldValues[key]}
                            onChange={(e) => handleChange(key, e.target.value)}
                            InputProps={{ readOnly: !editableFields[key] }}
                            variant="outlined"
                            size="small"
                            sx={{ flex: 1, marginBottom: 3 }}
                        />
                        {editableFields[key] ? (
                            <IconButton color="primary" onClick={() => handleSaveClick(key)}>
                                <CheckIcon />
                            </IconButton>
                        ) : (
                            <IconButton color="primary" onClick={() => handleEditClick(key)}>
                                <EditIcon />
                            </IconButton>
                        )}
                    </Box>
                ))}
            </div>

            {user?.role === 'customer' && (
                <div className="addedItemSection">

                    <div className="profile-items-card">
                    <h1 className="cart-page-font profile-page-subTitle-spacing">
                        {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"} found
                    </h1>
                    <div>
                        {reviews.length > 0 ? (
                        reviews.map((review, idx) => (
                            <ReviewDetailsCard key={review.review_id || idx} review={review} />
                        ))
                        ) : (
                        <p style={{ color: 'white', width: '100%', textAlign: 'center' }}>
                            No reviews submitted yet.
                        </p>
                        )}
                    </div>
                    </div>

                    <div>
                        <div className="profile-items-card">
                        <h1 className="cart-page-font profile-page-subTitle-spacing">
                            {orders.length} {orders.length === 1 ? "Order" : "Orders"} found
                        </h1>
                        <div>
                            {orders.length > 0 ? (
                            orders.map((order, idx) => (
                                <OrderDetailsCard key={order.order_id || idx} order={order} />
                            ))
                            ) : (
                            <p style={{ color: 'white', width: '100%', textAlign: 'center' }}>
                                No orders submitted yet.
                            </p>
                            )}
                        </div>
                        </div>

                            <div className="profile-items-card">
                        <h1 className="cart-page-font profile-page-subTitle-spacing">
                            {wishlists.length} {wishlists.length === 1 ? "Wishlist" : "Wishlists"} found
                        </h1>
                        <div>
                            {wishlists.length > 0 ? (
                            wishlists.map((wishlist, idx) => (
                                <WishlistDetailsCard key={wishlist.wishlist_id || idx} wishlist={wishlist} />
                            ))
                            ) : (
                            <p style={{ color: 'white', width: '100%', textAlign: 'center' }}>
                                No wishlists found.
                            </p>
                            )}
                        </div>
                    </div>

                    
                    </div>
                    
                </div>
            )}


            {user?.role === 'admin' && (
                <div className="addedItemSection">
                    <div className="profile-items-card">
                        <h1 className="cart-page-font profile-page-subTitle-spacing">
                            {stores.length} {stores.length === 1 ? "Store" : "Stores"} found
                        </h1>
                        <div>
                            {stores.length > 0 ? (
                                stores.map((store) => <StoreDetailsCard key={store.store_id} store={store} />)
                            ) : (
                                <p style={{ color: 'white', width: '100%', textAlign: 'center' }}>No stores found.</p>
                            )}
                        </div>
                    </div>

                    <div className="profile-items-card">
                        <h1 className="cart-page-font profile-page-subTitle-spacing">
                            {employees.length} {employees.length === 1 ? "Employee" : "Employees"} found
                        </h1>
                        <div>
                            {employees.length > 0 ? (
                                employees.map((employee) => <EmployeeDetailsCard key={employee.user_id} employee={employee} />)
                            ) : (
                                <p style={{ color: 'white', width: '100%', textAlign: 'center' }}>No employees found.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
