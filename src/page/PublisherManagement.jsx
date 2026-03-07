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

function PublisherManagement() {
    const [publishers, setPublishers] = useState([]);

    const initialFormData = {
        name: '',
        year_founded: dayjs('2000'),
        country: ''
    };

    const [createFormData, setCreateFormData] = useState(initialFormData);
    const [updateFormData, setUpdateFormData] = useState(initialFormData);
    const [deleteFormData, setDeleteFormData] = useState({ name: '' });

    const [createFormErrors, setCreateFormErrors] = useState({});
    const [updateFormErrors, setUpdateFormErrors] = useState({});
    const [deleteFormErrors, setDeleteFormErrors] = useState({});

    const fetchData = useCallback(async () => {
        try {
            const publishersRes = await axios.post("http://localhost:5000/publishers");
            console.log("Fetched publishers:", publishersRes.data.data);
            setPublishers(publishersRes.data.data.map(publisher => publisher.publisher_name));
        } catch (err) {
            console.error("Error fetching publishers:", err);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleChange = (e, formType) => {
        const { name, value } = e.target;

        if (formType === 'create') setCreateFormData(prev => ({ ...prev, [name]: value }));
        if (formType === 'update') setUpdateFormData(prev => ({ ...prev, [name]: value }));
        if (formType === 'delete') setDeleteFormData(prev => ({ ...prev, [name]: value }));

        if (formType === 'create') setCreateFormErrors(prev => ({ ...prev, [name]: '' }));
        if (formType === 'update') setUpdateFormErrors(prev => ({ ...prev, [name]: '' }));

        if (formType === 'delete') setDeleteFormErrors({});
    };


    const handleYearChange = (date, formType) => {
        if (formType === 'create') setCreateFormData(prev => ({ ...prev, year_founded: date }));
        if (formType === 'update') setUpdateFormData(prev => ({ ...prev, year_founded: date }));

        if (formType === 'create' && createFormErrors.year_founded) setCreateFormErrors(prev => ({ ...prev, year_founded: '' }));
        if (formType === 'update' && updateFormErrors.year_founded) setUpdateFormErrors(prev => ({ ...prev, year_founded: '' }));
    };

    const validateForm = (formData, type) => {
    let errors = {};

    if (type !== 'delete') {
        if (!formData.name) errors.name = "Name is required.";
        if (!formData.country) errors.country = "Country is required.";
        if (!formData.year_founded || !formData.year_founded.isValid())
            errors.year_founded = "Year founded is required.";

        if (type === 'create') setCreateFormErrors(errors);
        if (type === 'update') setUpdateFormErrors(errors);

        return Object.keys(errors).length === 0;
    }

        if (type === 'delete') {
            if (!formData.name) {
                setDeleteFormErrors({ name: "Select a publisher to delete." });
                return false;
            }
            setDeleteFormErrors({});
            return true;
        }
    };


    const [createNotification, setCreateNotification] = useState({ message: '', type: '' });
    const [updateNotification, setUpdateNotification] = useState({ message: '', type: '' });
    const [deleteNotification, setDeleteNotification] = useState({ message: '', type: '' });

    const handleSubmit = async (formType) => {
        let url = "";
        let data = {};
        if (formType === 'create') {
            if (!validateForm(createFormData, 'create')) return setCreateNotification({ message: "Fix form errors.", type: 'error' });
            url = "http://localhost:5000/submitPublisher"; data = createFormData;
        }
        if (formType === 'update') {
            if (!validateForm(updateFormData, 'update')) return setUpdateNotification({ message: "Fix form errors.", type: 'error' });
            url = "http://localhost:5000/updatePublisher"; data = updateFormData;
        }
        if (formType === 'delete') {
            if (!validateForm(deleteFormData, 'delete')) return setDeleteNotification({ message: "Select a publisher.", type: 'error' });
            url = "http://localhost:5000/deletePublisher"; data = deleteFormData;
        }

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            const response = await res.json();
            if (response.success) {
                await fetchData();
                if (formType === 'create') { setCreateNotification({ message: response.message, type: 'success' }); setCreateFormData(initialFormData); }
                if (formType === 'update') { setUpdateNotification({ message: response.message, type: 'success' }); setUpdateFormData(initialFormData); }
                if (formType === 'delete') { setDeleteNotification({ message: response.message, type: 'success' }); setDeleteFormData({ name: '' }); }
            } else {
                if (formType === 'create') setCreateNotification({ message: response.message, type: 'error' });
                if (formType === 'update') setUpdateNotification({ message: response.message, type: 'error' });
                if (formType === 'delete') setDeleteNotification({ message: response.message, type: 'error' });
            }
        } catch (err) {
            if (formType === 'create') setCreateNotification({ message: "Server error.", type: 'error' });
            if (formType === 'update') setUpdateNotification({ message: "Server error.", type: 'error' });
            if (formType === 'delete') setDeleteNotification({ message: "Server error.", type: 'error' });
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <WebsiteHeader />
            <div>
                <h1 className="updateGame-page-font cart-page-title-spacing">Publisher Management</h1>
                <Divider sx={{ margin: '0 20px 20px 20px', borderColor: 'purple' }} />
                <div className="gameSection">

                    <div className="updateGame-page review-form-section">
                        <h1 className="updateGame-page-font subfont">Publisher Insertion</h1>
                        <div className="form-container">
                            <form className="register-form" onSubmit={(e) => { e.preventDefault(); handleSubmit('create'); }}>
                                <Box display="flex" flexDirection="column" gap={2}>
                                    <TextField
                                        label="Name"
                                        name="name"
                                        value={createFormData.name}
                                        onChange={(e) => handleChange(e, 'create')}
                                        error={!!createFormErrors.name}
                                        helperText={createFormErrors.name || undefined}
                                    />
                                    <TextField
                                        label="Country"
                                        name="country"
                                        value={createFormData.country}
                                        onChange={(e) => handleChange(e, 'create')}
                                        error={!!createFormErrors.country}
                                        helperText={createFormErrors.country || undefined}
                                    />
                                    <DatePicker
                                        views={['year']}
                                        label="Year Founded"
                                        value={createFormData.year_founded}
                                        onChange={(date) => handleYearChange(date, 'create')}
                                        slotProps={{
                                            textField: {
                                                error: !!createFormErrors.year_founded,
                                                helperText: createFormErrors.year_founded || undefined
                                            }
                                        }}
                                    />
                                    <Button variant="contained" color="primary" size="large" type="submit">Submit</Button>
                                    <Notification message={createNotification.message} type={createNotification.type} onClose={() => setCreateNotification({ message: '', type: '' })}/>
                                </Box>
                            </form>
                        </div>
                    </div>

                    <div className="updateGame-page review-form-section">
                        <h1 className="updateGame-page-font subfont">Publisher Updation</h1>
                        <div className="form-container">
                            <form className="register-form" onSubmit={(e) => { e.preventDefault(); handleSubmit('update'); }}>
                                <Box display="flex" flexDirection="column" gap={2}>
                                    <InputLabel htmlFor="publisher-select">Publisher To Update</InputLabel>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel id="publisher-select-label">Publisher</InputLabel>
                                        <Select
                                            labelId="publisher-select-label"
                                            id="publisher-select"
                                            name="name"
                                            value={updateFormData.name}
                                            label="Publisher"
                                            onChange={(e) => handleChange(e, 'update')}
                                        >
                                            {publishers.map(pub => (
                                                <MenuItem key={pub} value={pub}>{pub}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <TextField
                                        label="Country"
                                        name="country"
                                        value={updateFormData.country}
                                        onChange={(e) => handleChange(e, 'update')}
                                        error={!!updateFormErrors.country}
                                        helperText={updateFormErrors.country || undefined}
                                    />

                                    <DatePicker
                                        views={['year']}
                                        label="Year Founded"
                                        value={updateFormData.year_founded}
                                        onChange={(date) => handleYearChange(date, 'update')}
                                        slotProps={{
                                            textField: {
                                                error: !!updateFormErrors.year_founded,
                                                helperText: updateFormErrors.year_founded || undefined
                                            }
                                        }}
                                    />

                                    <Button variant="contained" color="primary" size="large" type="submit">Submit</Button>
                                    <Notification message={updateNotification.message} type={updateNotification.type} onClose={() => setUpdateNotification({ message: '', type: '' })}/>
                                </Box>
                            </form>
                        </div>
                    </div>

                    <div className="updateGame-page review-form-section">
                        <h1 className="updateGame-page-font subfont">Publisher Deletion</h1>
                        <div className="form-container">
                            <form className="register-form" onSubmit={(e) => { e.preventDefault(); handleSubmit('delete'); }}>
                                <Box display="flex" flexDirection="column" gap={2}>
                                    <InputLabel htmlFor="publisher-delete-select">Publisher To Delete</InputLabel>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel id="publisher-delete-select-label">Publisher</InputLabel>
                                        <Select
                                            labelId="publisher-delete-select-label"
                                            id="publisher-delete-select"
                                            name="name"
                                            value={deleteFormData.name}
                                            label="Publisher"
                                            onChange={(e) => handleChange(e, 'delete')}
                                        >
                                            {publishers.map(pub => (
                                                <MenuItem key={pub} value={pub}>{pub}</MenuItem>
                                            ))}
                                        </Select>
                                        {deleteFormErrors.name && <FormHelperText error>{deleteFormErrors.name}</FormHelperText>}
                                    </FormControl>

                                    <Button variant="contained" color="primary" size="large" type="submit">Submit</Button>
                                    <Notification message={deleteNotification.message} type={deleteNotification.type} onClose={() => setDeleteNotification({ message: '', type: '' })}/>
                                </Box>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </LocalizationProvider>
    );
}

export default PublisherManagement;
