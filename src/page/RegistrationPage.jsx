import React, { useState } from "react";
import { useAuth } from '../../AuthContext.jsx';
import '../components/css/Registration.css';
import WebsiteHeader from '../components/WebsiteHeader.jsx';
import { useNavigate } from "react-router-dom";
import Notification from "../components/Notification.jsx";

function RegistrationPage() {
  const { login } = useAuth();
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    contact_number: "",
    apartment_no: "",
    street: "",
    city: "",
    state: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [valid, setValid] = useState(false);
  const [formNotification, setFormNotification] = useState({ message: '', type: '' });

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

    if (values.firstName && values.lastName && values.email && values.password && 
      values.contact_number && values.apartment_no && values.street && values.city && values.state) {

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values) 
      });

      const data = await response.json();

      if (data.success == "true") {
        console.log(data.success);
        setValid(true);
        const userData = {
             email: values.email,
             firstName: values.firstName,
             role: 'customer'
        };
        login(userData);
        navigate("/games");

      }
      else {
        setFormNotification({ message: data.message, type: 'error' });
      }
    } catch (err) {
      console.error(err);
    }
  }
};


  return (
    <div>
      <WebsiteHeader />
      <div className="registration-page">
        <h1 className="registration-page title">Registration Form</h1>
        <div className="form-container">
          <form className="register-form" onSubmit={handleSubmit}>

            {!valid && (
              <input
                className="form-field"
                type="text"
                placeholder="First Name"
                name="firstName"
                value={values.firstName}
                onChange={handleInputChange}
              />
            )}
            {submitted && !values.firstName && (
              <span id="first-name-error">Please enter a first name</span>
            )}

            {!valid && (
              <input
                className="form-field"
                type="text"
                placeholder="Last Name"
                name="lastName"
                value={values.lastName}
                onChange={handleInputChange}
              />
            )}
            {submitted && !values.lastName && (
              <span id="last-name-error">Please enter a last name</span>
            )}

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
                minLength="8"
                maxLength="16"
                pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$"
                value={values.password}
                onChange={handleInputChange}
              />
            )}
            {submitted && !values.password && (
              <span id="password-error">Password must be 8-16 characters, include letters, numbers, and at least one special character.</span>
            )}

            {!valid && (
              <input
                className="form-field"
                type="number"
                placeholder="Contact Number"
                name="contact_number"
                value={values.contact_number}
                onChange={handleInputChange}
              />
            )}
            {submitted && !values.contact_number && (
              <span id="contact-number-error">Please enter a contact number</span>
            )}

            {!valid && (
              <input
                className="form-field"
                placeholder="Apartment No"
                name="apartment_no"
                value={values.apartment_no}
                onChange={handleInputChange}
              />
            )}
            {submitted && !values.apartment_no && (
              <span id="apartment-no-error">Please enter an apartment number</span>
            )}

            {!valid && (
              <input
                className="form-field"
                placeholder="Street"
                name="street"
                value={values.street}
                onChange={handleInputChange}
              />
            )}
            {submitted && !values.street && (
              <span id="street-error">Please enter a street</span>
            )}

            {!valid && (
              <input
                className="form-field"
                placeholder="City"
                name="city"
                value={values.city}
                onChange={handleInputChange}
              />
            )}
            {submitted && !values.city && (
              <span id="city-error">Please enter a city</span>
            )}

            {!valid && (
              <input
                className="form-field"
                placeholder="State"
                name="state"
                value={values.state}
                onChange={handleInputChange}
              />
            )}
            {submitted && !values.state && (
              <span id="state-error">Please enter a state</span>
            )}
            
            {!valid && (
              <button className="form-field" type="submit">
                Register
              </button>
            )}
            <Notification
                message={formNotification.message}
                type={formNotification.type}
                onClose={() => setFormNotification({ message: '', type: '' })}
              />
          </form>
        </div> 
      </div>
    </div>
  );
}

export default RegistrationPage;
