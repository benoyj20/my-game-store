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
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Notification from '../components/Notification.jsx';
import WebsiteHeader from '../components/WebsiteHeader.jsx';
import Divider from '@mui/material/Divider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField } from '@mui/material';

function EmployeeManagement() {
    const [employees, setEmployees] = useState([]);
    const [store, setStore] = useState([]);

    const initialFormData = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        role: '',
        store: '',
        hireDate: dayjs('2025-01-01')
    };

    const [createFormData, setCreateFormData] = useState(initialFormData);
    const [updateFormData, setUpdateFormData] = useState(initialFormData);
    const [deleteFormData, setDeleteFormData] = useState({ email: '' });

    const [createFormErrors, setCreateFormErrors] = useState({});
    const [updateFormErrors, setUpdateFormErrors] = useState({});
    const [deleteFormErrors, setDeleteFormErrors] = useState({});

    const fetchData = useCallback(async () => {
        const employeePromise = axios.get("https://my-game-store.onrender.com/employees", {});
        const storePromise = axios.get("https://my-game-store.onrender.com/stores");

        try {
            const [employeesRes, storesRes] = await Promise.all([
                employeePromise,
                storePromise,
            ]);

            setEmployees(employeesRes.data.data.map(employee => employee.email));
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

    const handleCreateDateChange = (date) => {
        setCreateFormData(prev => ({ ...prev, hireDate: date }));
        if (createFormErrors.hireDate) {
            setCreateFormErrors(prev => ({ ...prev, hireDate: '' }));
        }
    };


    const createFormValidate = () => {
        let tempErrors = {};

        if (!createFormData.firstName) tempErrors.firstName = "First name is required.";
        if (!createFormData.lastName) tempErrors.lastName = "Last name is required.";
        if (!createFormData.email) tempErrors.email = "Email is required.";
        if (!createFormData.password) tempErrors.password = "Password is required.";
        if (!createFormData.phone) tempErrors.phone = "Phone number is required.";
        if (!createFormData.role) tempErrors.role = "Role is required.";
        if (!createFormData.hireDate || !createFormData.hireDate.isValid()) tempErrors.hireDate = "Hire date is required.";
        if (!createFormData.store) tempErrors.store = "Store is required.";

        setCreateFormErrors(tempErrors);

        return Object.keys(tempErrors).length === 0;
    };

    const updateFormValidate = () => {
        let tempErrors = {};

        if (!updateFormData.email) tempErrors.email = "Email is required.";
        if (!updateFormData.phone) tempErrors.phone = "Phone number is required.";
        if (!updateFormData.role) tempErrors.role = "Role is required.";
        if (!updateFormData.store) tempErrors.store = "Store is required.";

        setUpdateFormErrors(tempErrors);

        return Object.keys(tempErrors).length === 0;
    };

    const deleteFormValidate = () => {
        let tempErrors = {};
        if (!deleteFormData.email) tempErrors.email = "Please select an employee to delete.";
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
                const response = await fetch("https://my-game-store.onrender.com/submitEmployee", {
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
                const response = await fetch("https://my-game-store.onrender.com/updateEmployee", {
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
            setDeleteFormNotification({ message: "Please select an employee to delete.", type: 'error' });
            return;
        }
        try {
            const response = await fetch("https://my-game-store.onrender.com/deleteEmployee", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(deleteFormData)
            });
            const data = await response.json();
            if (data.success == "true") {
                await fetchData();
                setDeleteFormNotification({ message: data.message, type: 'success' });
                setDeleteFormData({
                    email: ''
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
                <h1 className="updateGame-page-font cart-page-title-spacing">Employee Insertion, Updation and Deletion</h1>
                <Divider sx={{ margin: '0 20px 20px 20px', borderColor: 'purple' }} />
                <div className="gameSection">

                    <div className="updateGame-page review-form-section">
                        <h1 className="updateGame-page-font subfont">Employee Insertion</h1>
                        <div className="form-container">
                            <form className="register-form" onSubmit={handleCreateFormSubmit}>
                                <Box display="flex" flexDirection="column" gap={2}>
                                    <TextField
                                        id="firstName"
                                        name="firstName"
                                        value={createFormData.firstName}
                                        label="First Name"
                                        variant="outlined"
                                        onChange={handleCreateChange}
                                        error={!!createFormErrors.firstName}
                                        helperText={createFormErrors.firstName || undefined}
                                    />

                                    <TextField
                                        id="lastName"
                                        name="lastName"
                                        value={createFormData.lastName}
                                        label="Last Name"
                                        variant="outlined"
                                        onChange={handleCreateChange}
                                        error={!!createFormErrors.lastName}
                                        helperText={createFormErrors.lastName || undefined}
                                    />

                                    <TextField
                                        id="email"
                                        name="email"
                                        value={createFormData.email}
                                        label="Email"
                                        variant="outlined"
                                        onChange={handleCreateChange}
                                        error={!!createFormErrors.email}
                                        helperText={createFormErrors.email || undefined}
                                    />

                                    <TextField
                                        id="password"
                                        name="password"
                                        type='password'
                                        value={createFormData.password}
                                        label="Password"
                                        variant="outlined"
                                        onChange={handleCreateChange}
                                        error={!!createFormErrors.password}
                                        helperText={createFormErrors.password || undefined}
                                    />

                                    <FormControl fullWidth variant="outlined" error={!!createFormErrors.store}>
                                        <InputLabel id="store-create-select-label">Store</InputLabel>
                                        <Select
                                            labelId="store-create-select-label"
                                            id="store-create-select"
                                            name="store"
                                            value={createFormData.store}
                                            label="Store"
                                            onChange={handleCreateChange}
                                        >
                                            {store.map((store) => (
                                                <MenuItem key={store} value={store}>
                                                    {store}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {createFormErrors.store && <FormHelperText error>{createFormErrors.store}</FormHelperText>}
                                    </FormControl>
                                    

                                    <TextField
                                        id="create-phone"
                                        name="phone"
                                        value={createFormData.phone}
                                        label="Phone"
                                        variant="outlined"
                                        type='number'
                                        onChange={handleCreateChange}
                                        error={!!createFormErrors.phone}
                                        helperText={createFormErrors.phone || undefined}
                                    />

                                    <TextField
                                        id="create-role"
                                        name="role"
                                        value={createFormData.role}
                                        label="Role"
                                        variant="outlined"
                                        onChange={handleCreateChange}
                                        error={!!createFormErrors.role}
                                        helperText={createFormErrors.role || undefined}
                                    />

                                    <InputLabel htmlFor="date-picker-hire">Hire Date</InputLabel>
                                    <DatePicker
                                        defaultValue={dayjs('2025-01-01')}
                                        name="hireDate"
                                        value={createFormData.hireDate}
                                        onChange={handleCreateDateChange}
                                        slotProps={{
                                            textField: {
                                                error: !!createFormErrors.hireDate,
                                                helperText: createFormErrors.hireDate || undefined,
                                                id: 'create-date-picker-hire'
                                            }
                                        }}
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
                        <h1 className="updateGame-page-font subfont">Employee Updation</h1>
                        <div className="form-container">
                            <form className="register-form" onSubmit={handleUpdateFormSubmit}>
                                <Box display="flex" flexDirection="column" gap={2}>
                                    <InputLabel htmlFor="employee-select">Employee To Update</InputLabel>
                                    <FormControl fullWidth variant="outlined" error={!!updateFormErrors.employee}>
                                        <InputLabel id="email-select-label">Employee</InputLabel>
                                        <Select
                                            labelId="email-select-label"
                                            id="email-select"
                                            name="email"
                                            value={updateFormData.email}
                                            label="Email"
                                            onChange={handleUpdateChange}
                                        >
                                            {employees.map((employee) => (
                                                <MenuItem key={employee} value={employee}>
                                                    {employee}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {updateFormErrors.email && <FormHelperText error>{updateFormErrors.email}</FormHelperText>}
                                    </FormControl>
                                    
                                    <FormControl fullWidth variant="outlined" error={!!updateFormErrors.store}>
                                        <InputLabel id="store-update-select-label">Store</InputLabel>
                                        <Select
                                            labelId="store-update-select-label"
                                            id="store-update-select"
                                            name="store"
                                            value={updateFormData.store}
                                            label="Store"
                                            onChange={handleUpdateChange}
                                        >
                                            {store.map((store) => (
                                                <MenuItem key={store} value={store}>
                                                    {store}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    {updateFormErrors.store && <FormHelperText error>{updateFormErrors.store}</FormHelperText>}

                                    <TextField
                                        id="update-phone"
                                        name="phone"
                                        value={updateFormData.phone}
                                        label="Phone"
                                        type='number'
                                        variant="outlined"
                                        onChange={handleUpdateChange}
                                        error={!!updateFormErrors.phone}
                                        helperText={updateFormErrors.phone || undefined}
                                    />

                                    <TextField
                                        id="update-role"
                                        name="role"
                                        value={updateFormData.role}
                                        label="Role"
                                        variant="outlined"
                                        onChange={handleUpdateChange}
                                        error={!!updateFormErrors.role}
                                        helperText={updateFormErrors.role || undefined}
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
                        <h1 className="updateGame-page-font subfont">Employee Deletion</h1>
                        <div className="form-container">
                            <form className="register-form" onSubmit={handleDeleteFormSubmit}>

                                <Box display="flex" flexDirection="column" gap={2}>
                                    <InputLabel htmlFor="standard-adornment-amount">Employee To Delete</InputLabel>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel id="employee-select-label">Employee</InputLabel>
                                        <Select
                                            labelId="email-select-label"
                                            id="email-select"
                                            name="email"
                                            value={deleteFormData.email}
                                            label="Employee"
                                            onChange={handleDeleteChange}
                                        >
                                            {employees.map((employee) => (
                                                <MenuItem key={employee} value={employee}>
                                                    {employee}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {deleteFormErrors.email && <FormHelperText error>{deleteFormErrors.email}</FormHelperText>}
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

export default EmployeeManagement;