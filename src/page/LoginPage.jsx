import React, { useState } from "react";
import '../components/css/Registration.css';
import { useAuth } from '../../AuthContext';
import WebsiteHeader from '../components/WebsiteHeader.jsx';
import { useNavigate } from "react-router-dom";


function LoginPage() {
  const { login } = useAuth();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [valid, setValid] = useState(false);

  const navigate = useNavigate();
  
  const handleInputChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setValues((values) => ({
      ...values,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    setSubmitted(true);
    e.preventDefault();

    if (values.email && values.password) {

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values) 
      });

      const data = await response.json();

      if (data.success == "true") {
        setValid(true);
        const userData = {
            email: values.email,
            firstName: data.firstName,
            role: data.role
        };
        login(userData);
        if (data.role === 'customer') {
          navigate("/games");
        }
        else{
          navigate("/");
        }
      }
      else {
        alert(data.message);     
      }
    } catch (err) {
      console.error(err);
    }
  }
};

  return (
    <div>
      <WebsiteHeader/>
      <h1 className="registration-page title" >Login Form</h1>
      <div className="registration-page">
        <div className="form-container">
          <form className="register-form" onSubmit={handleSubmit}>

            {!valid && (
              <input
                className="form-field"
                type="email"
                placeholder="Email"
                name="email"
                value={values.email}
                onChange={handleInputChange}
              />
            )}
            {submitted && !values.email && (
              <span id="email-error">Please enter an email address</span>
            )}

            {!valid && (
              <input
                className="form-field"
                type="password"
                placeholder="Password"
                name="password"
                value={values.password}
                onChange={handleInputChange}
              />
            )}
            {submitted && !values.password && (
              <span id="password-error">Password incorrect</span>
            )}
            
            {!valid && (
              <button className="form-field" type="submit">
                Login
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
