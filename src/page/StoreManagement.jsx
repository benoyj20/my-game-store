import '../components/css/UpdateGameInventory.css';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Notification from '../components/Notification.jsx';
import WebsiteHeader from '../components/WebsiteHeader.jsx';
import Divider from '@mui/material/Divider';
import { TextField } from '@mui/material';

function StoreManagement() {
    const [store, setStore] = useState([]);

    const initialFormData = {
        storeName: '',
        buildingNo: '',
        street: '',
        city: '',
        state: '',
        contactNo: '',
    };

    const [createFormData, setCreateFormData] = useState(initialFormData);
    const [updateFormData, setUpdateFormData] = useState(initialFormData);
    const [deleteFormData, setDeleteFormData] = useState( { storeName: '' } );

    const [createFormErrors, setCreateFormErrors] = useState({});
    const [updateFormErrors, setUpdateFormErrors] = useState({});
    const [deleteFormErrors, setDeleteFormErrors] = useState({});

    const fetchData = useCallback(async () => {
        const storePromise = axios.get("http://localhost:5000/stores");

        try {
            const [storesRes] = await Promise.all([
                storePromise,
            ]);

            setStore(storesRes.data.data.map(store => store.store_name));

        } catch (err) {
            console.error("Error fetching initial data:", err);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleCreateChange = (e) => {
        const { name, value } = e.target;
        setCreateFormData({ ...createFormData, [name]: value });
        if (createFormErrors[name]) {
            setCreateFormErrors({ ...createFormErrors, [name]: '' });
        }
    };

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setUpdateFormData({ ...updateFormData, [name]: value });
        if (updateFormErrors[name]) {
            setUpdateFormErrors({ ...updateFormErrors, [name]: '' });
        }
    };

    const handleDeleteChange = (e) => {
        const { name, value } = e.target;
        setDeleteFormData({ ...deleteFormData, [name]: value });
        if (deleteFormErrors[name]) {
            setDeleteFormErrors({ ...deleteFormErrors, [name]: '' });
        }
    }


    const createFormValidate = () => {
        let tempErrors = {};

        if (!createFormData.storeName) tempErrors.storeName = "Store Name is required.";
        if (!createFormData.buildingNo) tempErrors.buildingNo = "Building No is required.";
        if (!createFormData.street) tempErrors.street = "Street is required.";
        if (!createFormData.city) tempErrors.city = "City is required.";
        if (!createFormData.state) tempErrors.state = "State is required.";
        if (!createFormData.contactNo) tempErrors.contactNo = "Contact No is required.";

        setCreateFormErrors(tempErrors);

        return Object.keys(tempErrors).length === 0;
    };

    const updateFormValidate = () => {
        let tempErrors = {};

        if (!updateFormData.storeName) tempErrors.storeName = "Please select a store to update.";
        if (!updateFormData.buildingNo) tempErrors.buildingNo = "Building No is required.";
        if (!updateFormData.street) tempErrors.street = "Street is required.";
        if (!updateFormData.city) tempErrors.city = "City is required.";
        if (!updateFormData.state) tempErrors.state = "State is required.";
        if (!updateFormData.contactNo) tempErrors.contactNo = "Contact No is required.";

        setUpdateFormErrors(tempErrors);

        return Object.keys(tempErrors).length === 0;
    };

    const deleteFormValidate = () => {
        let tempErrors = {};
        if (!deleteFormData.storeName) tempErrors.storeName = "Please select a store to delete.";
        setDeleteFormErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const [createFormNotification, setCreateFormNotification] = useState({ message: '', type: '' });
    const [updateFormNotification, setUpdateFormNotification] = useState({ message: '', type: '' });
    const [deleteFormNotification, setDeleteFormNotification] = useState({ message: '', type: '' });

    const handleCreateFormSubmit = async (e) => {
        e.preventDefault();
        setCreateFormNotification({ message: '', type: '' });
    
        if (createFormValidate()) {
            try {
                const response = await fetch("http://localhost:5000/submitStore", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(createFormData)
                });

                const data = await response.json();

                if (data.success == "true") {
                    await fetchData();
                    setCreateFormNotification({ message: data.message, type: 'success' });
                    setCreateFormData(initialFormData);
                    setCreateFormErrors({});
                }
                else {
                    setCreateFormNotification({ message: data.message, type: 'error' });
                }
            } catch (err) {
                setCreateFormNotification({ message: "Server error occurred.", type: 'error' });
            }
        } else {
            setCreateFormNotification({ message: "Please fix the errors in the form.", type: 'error' });
        }
    };

    const handleUpdateFormSubmit = async (e) => {
        e.preventDefault();
        setUpdateFormNotification({ message: '', type: '' });
        if (updateFormValidate()) {
            try {
                const response = await fetch("http://localhost:5000/updateStore", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updateFormData)
                });

                const data = await response.json();

                if (data.success == "true") {
                    await fetchData();
                    setUpdateFormNotification({ message: data.message, type: 'success' });
                    setUpdateFormData(initialFormData);
                    setUpdateFormErrors({});
                }
                else {
                    setUpdateFormNotification({ message: data.message, type: 'error' });
                }
            } catch (err) {
                setUpdateFormNotification({ message: "Server error occurred.", type: 'error' });
            }
        } else {
            setUpdateFormNotification({ message: "Please fix the errors in the form.", type: 'error' });
        }
    };

    const handleDeleteFormSubmit = async (e) => {
        e.preventDefault();
        setDeleteFormNotification({ message: '', type: '' });
        if (!deleteFormValidate()) {
            setDeleteFormNotification({ message: "Please select a store to delete.", type: 'error' });
            return;
        }
        try {
            const response = await fetch("http://localhost:5000/deleteStore", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(deleteFormData)
            });
            const data = await response.json();
            if (data.success == "true") {
                await fetchData();
                setDeleteFormNotification({ message: data.message, type: 'success' });
                setDeleteFormData({
                    storeName: ''
                });
            }
            else {
                setDeleteFormNotification({ message: data.message, type: 'error' });
            }
        } catch (err) {
            setDeleteFormNotification({ message: "Server error occurred.", type: 'error' });
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <WebsiteHeader />
            <div>
                <h1 className="updateGame-page-font cart-page-title-spacing">Store Insertion, Updation and Deletion</h1>
                <Divider sx={{ margin: '0 20px 20px 20px', borderColor: 'purple' }} />
                <div className="gameSection">

                    <div className="updateGame-page review-form-section">
                        <h1 className="updateGame-page-font subfont">Store Insertion</h1>
                        <div className="form-container">
                            <form className="register-form" onSubmit={handleCreateFormSubmit}>
                                <Box display="flex" flexDirection="column" gap={2}>
                                    <TextField
                                        id="storeName"
                                        name="storeName"
                                        value={createFormData.storeName}
                                        label="Store Name"
                                        variant="outlined"
                                        onChange={handleCreateChange}
                                        error={!!createFormErrors.storeName}
                                        helperText={createFormErrors.storeName || undefined}
                                    />

                                    <TextField
                                        id="create-buildingNo"
                                        name="buildingNo"
                                        value={createFormData.buildingNo}
                                        label="Building No"
                                        variant="outlined"
                                        onChange={handleCreateChange}
                                        error={!!createFormErrors.buildingNo}
                                        helperText={createFormErrors.buildingNo || undefined}
                                    />

                                    <TextField
                                        id="create-street"
                                        name="street"
                                        value={createFormData.street}
                                        label="Street"
                                        variant="outlined"
                                        onChange={handleCreateChange}
                                        error={!!createFormErrors.street}
                                        helperText={createFormErrors.street || undefined}
                                    />

                                    <TextField
                                        id="create-city"
                                        name="city"
                                        value={createFormData.city}
                                        label="City"
                                        variant="outlined"
                                        onChange={handleCreateChange}
                                        error={!!createFormErrors.city}
                                        helperText={createFormErrors.city || undefined}
                                    />

                                    <TextField
                                        id="create-state"
                                        name="state"
                                        value={createFormData.state}
                                        label="State"
                                        variant="outlined"
                                        onChange={handleCreateChange}
                                        error={!!createFormErrors.state}
                                        helperText={createFormErrors.state || undefined}
                                    />

                                    <TextField
                                        id="create-contactNo"
                                        name="contactNo"
                                        value={createFormData.contactNo}
                                        type='number'
                                        label="Contact No"
                                        variant="outlined"
                                        onChange={handleCreateChange}
                                        error={!!createFormErrors.contactNo}
                                        helperText={createFormErrors.contactNo || undefined}
                                    />

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        type="submit"
                                    >
                                        Submit
                                    </Button>

                                    <Notification
                                        message={createFormNotification.message}
                                        type={createFormNotification.type}
                                        onClose={() => setCreateFormNotification({ message: '', type: '' })}
                                    />
                                </Box>
                            </form>
                        </div>
                    </div>

                    <div className="updateGame-page review-form-section">
                        <h1 className="updateGame-page-font subfont">Store Updation</h1>
                        <div className="form-container">
                            <form className="register-form" onSubmit={handleUpdateFormSubmit}>
                                <Box display="flex" flexDirection="column" gap={2}>
                                    <InputLabel htmlFor="store-select">Store To Update</InputLabel>
                                    <FormControl fullWidth variant="outlined" error={!!updateFormErrors.storeName}>
                                        <InputLabel id="store-select-label">Store</InputLabel>
                                        <Select
                                            labelId="store-select-label"
                                            id="store-select"
                                            name="storeName"
                                            value={updateFormData.storeName}
                                            label="Store"
                                            onChange={handleUpdateChange}
                                        >
                                            {store.map((store) => (
                                                <MenuItem key={store} value={store}>
                                                    {store}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {updateFormErrors.storeName && <FormHelperText error>{updateFormErrors.storeName}</FormHelperText>}
                                    </FormControl>
                                    
                                    <TextField
                                        id="update-buildingNo"
                                        name="buildingNo"
                                        value={updateFormData.buildingNo}
                                        label="Building No"
                                        variant="outlined"
                                        onChange={handleUpdateChange}
                                        error={!!updateFormErrors.buildingNo}
                                        helperText={updateFormErrors.buildingNo || undefined}
                                    />

                                    <TextField
                                        id="update-street"
                                        name="street"
                                        value={updateFormData.street}
                                        label="Street"
                                        variant="outlined"
                                        onChange={handleUpdateChange}
                                        error={!!updateFormErrors.street}
                                        helperText={updateFormErrors.street || undefined}
                                    />

                                    <TextField
                                        id="update-city"
                                        name="city"
                                        value={updateFormData.city}
                                        label="City"
                                        variant="outlined"
                                        onChange={handleUpdateChange}
                                        error={!!updateFormErrors.city}
                                        helperText={updateFormErrors.city || undefined}
                                    />

                                    <TextField
                                        id="update-state"
                                        name="state"
                                        value={updateFormData.state}
                                        label="State"
                                        variant="outlined"
                                        onChange={handleUpdateChange}
                                        error={!!updateFormErrors.state}
                                        helperText={updateFormErrors.state || undefined}
                                    />

                                    <TextField
                                        id="update-contactNo"
                                        name="contactNo"
                                        value={updateFormData.contactNo}
                                        label="Contact No"
                                        variant="outlined"
                                        type='number'
                                        onChange={handleUpdateChange}
                                        error={!!updateFormErrors.contactNo}
                                        helperText={updateFormErrors.contactNo || undefined}
                                    />

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        type="submit"
                                    >
                                        Submit
                                    </Button>

                                    <Notification
                                        message={updateFormNotification.message}
                                        type={updateFormNotification.type}
                                        onClose={() => setUpdateFormNotification({ message: '', type: '' })}
                                    />
                                </Box>

                            </form>
                        </div>
                    </div>

                    <div className="updateGame-page review-form-section">
                        <h1 className="updateGame-page-font subfont">Store Deletion</h1>
                        <div className="form-container">
                            <form className="register-form" onSubmit={handleDeleteFormSubmit}>

                                <Box display="flex" flexDirection="column" gap={2}>
                                    <InputLabel htmlFor="standard-adornment-amount">Store To Delete</InputLabel>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel id="store-select-label">Store</InputLabel>
                                        <Select
                                            labelId="store-select-label"
                                            id="store-select"
                                            name="storeName"
                                            value={deleteFormData.storeName}
                                            label="Store"
                                            onChange={handleDeleteChange}
                                        >
                                            {store.map((store) => (
                                                <MenuItem key={store} value={store}>
                                                    {store}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {deleteFormErrors.storeName && <FormHelperText error>{deleteFormErrors.storeName}</FormHelperText>}
                                    </FormControl>

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        type="submit"
                                    >
                                        Submit
                                    </Button>

                                    <Notification
                                        message={deleteFormNotification.message}
                                        type={deleteFormNotification.type}
                                        onClose={() => setDeleteFormNotification({ message: '', type: '' })}
                                    />
                                </Box>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </LocalizationProvider>
    );
}

export default StoreManagement;