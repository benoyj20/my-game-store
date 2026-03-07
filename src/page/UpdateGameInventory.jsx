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
import GameFormTemplate from '../components/GameFormTemplate';
import { TextField } from '@mui/material';
import { useAuth } from '../../AuthContext';

function UpdateGameInventory() {
    const { user } = useAuth();
    const [games, setGames] = useState([]);
    const [publishers, setPublishers] = useState([]);
    const [genres, setGenres] = useState([]);
    const [createFormGenres, setCreateFormGenres] = useState([]);
    const [updateFormGenres, setUpdateFormGenres] = useState([]);
    const [selectedCreateFormGenres, setSelectedCreateFormGenres] = useState([]);
    const [selectedUpdateFormGenres, setSelectedUpdateFormGenres] = useState([]);

    const initialFormData = {
        genre: '',
        game: '',
        publisher: '',
        developer: '',
        rating: '',
        amount: '',
        description: '',
        releaseDate: dayjs('2025-01-01')
    };

    const [createFormData, setCreateFormData] = useState(initialFormData);
    const [updateFormData, setUpdateFormData] = useState(initialFormData);
    const [updateInventoryFormData, setUpdateInventoryFormData] = useState({ game: '', amount: '', role: '', platform: '' });
    const [deleteFormData, setDeleteFormData] = useState({ game: '' });


    const getWordCount = (text) => {
        return text.trim().split(/\s+/).filter(Boolean).length;
    };

    const createFormWordCount = getWordCount(createFormData.description);
    const updateFormWordCount = getWordCount(updateFormData.description);
    const isCreateFormOverWordLimit = createFormWordCount > 100;
    const isUpdateFormOverWordLimit = updateFormWordCount > 100;
    const [createFormErrors, setCreateFormErrors] = useState({});
    const [updateFormErrors, setUpdateFormErrors] = useState({});
    const [deleteFormErrors, setDeleteFormErrors] = useState({});
    const [updateInventoryFormErrors, setUpdateInventoryFormErrors] = useState({});

    const fetchUserRole = () => {
        setUpdateInventoryFormData(prev => ({ ...prev, role: user?.role || '' }));
    };

    useEffect(() => {
        fetchUserRole();
    }, [user]);

    const fetchData = useCallback(async () => {
        const gamePromise = axios.post("http://localhost:5000/getGameTitles", {});
        const publisherPromise = axios.post("http://localhost:5000/publishers", {});
        const genrePromise = axios.post("http://localhost:5000/genres", {});

        try {
            const [gamesRes, publishersRes, genresRes] = await Promise.all([
                gamePromise,
                publisherPromise,
                genrePromise
            ]);

            setGames(gamesRes.data.data);
            setPublishers(publishersRes.data.data.map(publisher => publisher.publisher_name));
            setGenres(genresRes.data.data.map(genre => genre.genre));
            setCreateFormGenres(genresRes.data.data.map(genre => genre.genre));
            setUpdateFormGenres(genresRes.data.data.map(genre => genre.genre));

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
        setCreateFormData(prev => ({ ...prev, releaseDate: date }));
        if (createFormErrors.releaseDate) {
            setCreateFormErrors(prev => ({ ...prev, releaseDate: '' }));
        }
    };

    const handleUpdateDateChange = (date) => {
        setUpdateFormData(prev => ({ ...prev, releaseDate: date }));
        if (updateFormErrors.releaseDate) {
            setUpdateFormErrors(prev => ({ ...prev, releaseDate: '' }));
        }
    };

    const handleUpdateInventoryChange = (e) => {
        const { name, value } = e.target;
        setUpdateInventoryFormData({ ...updateInventoryFormData, [name]: value });
        if (updateInventoryFormErrors[name]) {
            setUpdateInventoryFormErrors({ ...updateInventoryFormErrors, [name]: '' });
        }
    };


    const createFormValidate = () => {
        let tempErrors = {};

        if (!createFormData.game) tempErrors.game = "Game title is required.";
        if (!createFormData.publisher) tempErrors.publisher = "Publisher selection is required.";
        if (!createFormData.rating) tempErrors.rating = "Rating selection is required.";
        if (!createFormData.amount || createFormData.amount <= 0) tempErrors.amount = "Please enter a valid amount.";
        if (selectedCreateFormGenres.length === 0) tempErrors.genre = "At least one genre must be selected.";
        if (!createFormData.developer) tempErrors.developer = "Developer field cannot be empty.";
        if (!createFormData.description) tempErrors.description = "Description cannot be empty.";
        if (!createFormData.releaseDate || !createFormData.releaseDate.isValid()) tempErrors.releaseDate = "Release date is required.";

        setCreateFormErrors(tempErrors);

        return Object.keys(tempErrors).length === 0;
    };

    const updateFormValidate = () => {
        let tempErrors = {};

        if (!updateFormData.game) tempErrors.game = "Game title is required.";
        if (!updateFormData.publisher) tempErrors.publisher = "Publisher selection is required.";
        if (!updateFormData.rating) tempErrors.rating = "Rating selection is required.";
        if (!updateFormData.amount || updateFormData.amount <= 0) tempErrors.amount = "Please enter a valid amount.";
        if (selectedUpdateFormGenres.length === 0) tempErrors.genre = "At least one genre must be selected.";
        if (!updateFormData.developer) tempErrors.developer = "Developer field cannot be empty.";
        if (!updateFormData.description) tempErrors.description = "Description cannot be empty.";
        if (!updateFormData.releaseDate || !updateFormData.releaseDate.isValid()) tempErrors.releaseDate = "Release date is required.";

        setUpdateFormErrors(tempErrors);

        return Object.keys(tempErrors).length === 0;
    };

    const deleteFormValidate = () => {
        let tempErrors = {};
        if (!deleteFormData.game) tempErrors.game = "Please select a game to delete.";
        setDeleteFormErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const updateInventoryFormValidate = () => {
        let tempErrors = {};
        if (!updateInventoryFormData.game) tempErrors.game = "Please select a game to update inventory.";
        if (!updateInventoryFormData.amount || updateInventoryFormData.amount <= 0) tempErrors.amount = "Please enter a valid amount.";
        if (!updateInventoryFormData.platform) tempErrors.platform = "Platform field cannot be empty.";
        setUpdateInventoryFormErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const [createFormNotification, setCreateFormNotification] = useState({ message: '', type: '' });
    const [updateFormNotification, setUpdateFormNotification] = useState({ message: '', type: '' });
    const [deleteFormNotification, setDeleteFormNotification] = useState({ message: '', type: '' });
    const [updateInventoryFormNotification, setUpdateInventoryFormNotification] = useState({ message: '', type: '' });

    const handleCreateFormSubmit = async (e) => {
        e.preventDefault();
        setCreateFormNotification({ message: '', type: '' });
        if (isCreateFormOverWordLimit) {
            alert("Please shorten your description to 100 words or less.");
            return;
        }
        if (createFormValidate()) {
            try {
                const payload = { ...createFormData, genre: selectedCreateFormGenres };
                const response = await fetch("http://localhost:5000/submitGame", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (data.success == "true") {
                    await fetchData();
                    setCreateFormNotification({ message: data.message, type: 'success' });
                    setCreateFormData(initialFormData);
                    setSelectedCreateFormGenres([]);
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
        if (isUpdateFormOverWordLimit) {
            alert("Please shorten your description to 100 words or less.");
            return;
        }
        if (updateFormValidate()) {
            try {
                const payload = { ...updateFormData, genre: selectedUpdateFormGenres };
                const response = await fetch("http://localhost:5000/updateGame", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (data.success == "true") {
                    await fetchData();
                    setUpdateFormNotification({ message: data.message, type: 'success' });
                    setUpdateFormData(initialFormData);
                    setSelectedUpdateFormGenres([]);
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
            setDeleteFormNotification({ message: "Please select a game to delete.", type: 'error' });
            return;
        }
        try {
            const response = await fetch("http://localhost:5000/deleteGame", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(deleteFormData)
            });
            const data = await response.json();
            if (data.success == "true") {
                await fetchData();
                setDeleteFormNotification({ message: data.message, type: 'success' });
                setDeleteFormData({
                    game: ''
                });
            }
            else {
                setDeleteFormNotification({ message: data.message, type: 'error' });
            }
        } catch (err) {
            setDeleteFormNotification({ message: "Server error occurred.", type: 'error' });
        }
    };

    const handleUpdateInventoryFormSubmit = async (e) => {
        e.preventDefault();
        setUpdateInventoryFormNotification({ message: '', type: '' });
        if (!updateInventoryFormValidate()) {
            setUpdateInventoryFormNotification({ message: "Please fix the errors in the form.", type: 'error' });
            return;
        }
        try {
            const response = await fetch("http://localhost:5000/updateGameInventory", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: user.email, ...updateInventoryFormData })
            });
            const data = await response.json();
            if (data.success == "true") {
                await fetchData();
                setUpdateInventoryFormNotification({ message: data.message, type: 'success' });
                setUpdateInventoryFormData({ game: '', amount: '', platform: '' });
            }
            else {
                setUpdateInventoryFormNotification({ message: data.message, type: 'error' });
            }
        } catch (err) {
            console.log("Error updating game inventory:", err);
            setUpdateInventoryFormNotification({ message: "Server error occurred.", type: 'error' });
        }
    };

    const createNotification = (
        <Notification
            message={createFormNotification.message}
            type={createFormNotification.type}
            onClose={() => setCreateFormNotification({ message: '', type: '' })}
        />
    );
    const updateNotification = (
        <Notification
            message={updateFormNotification.message}
            type={updateFormNotification.type}
            onClose={() => setUpdateFormNotification({ message: '', type: '' })}
        />
    );

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <WebsiteHeader />
            <div>
                <h1 className="updateGame-page-font cart-page-title-spacing">Game Insertion, Updation and Deletion</h1>
                <Divider sx={{ margin: '0 20px 20px 20px', borderColor: 'purple' }} />
                <div className="gameSection">

                    <div className="updateGame-page review-form-section">
                        <h1 className="updateGame-page-font subfont">Game Insertion</h1>
                        <div className="form-container">
                            <form className="register-form" onSubmit={handleCreateFormSubmit}>
                                <GameFormTemplate
                                    formData={createFormData}
                                    errors={createFormErrors}
                                    handleChange={handleCreateChange}
                                    handleDateChange={handleCreateDateChange}
                                    publishers={publishers}
                                    genres={createFormGenres}
                                    selectedGenres={selectedCreateFormGenres}
                                    setSelectedGenres={setSelectedCreateFormGenres}
                                    isOverWordLimit={isCreateFormOverWordLimit}
                                    wordCount={createFormWordCount}
                                    isUpdate={false}
                                    notificationComponent={createNotification}
                                />
                            </form>
                        </div>
                    </div>

                    <div className="updateGame-page review-form-section">
                        <h1 className="updateGame-page-font subfont">Game Updation</h1>
                        <div className="form-container">
                            <form className="register-form" onSubmit={handleUpdateFormSubmit}>
                                <GameFormTemplate
                                    formData={updateFormData}
                                    errors={updateFormErrors}
                                    handleChange={handleUpdateChange}
                                    handleDateChange={handleUpdateDateChange}
                                    publishers={publishers}
                                    genres={updateFormGenres}
                                    selectedGenres={selectedUpdateFormGenres}
                                    setSelectedGenres={setSelectedUpdateFormGenres}
                                    isOverWordLimit={isUpdateFormOverWordLimit}
                                    wordCount={updateFormWordCount}
                                    isUpdate={true}
                                    games={games}
                                    notificationComponent={updateNotification}
                                />
                            </form>
                        </div>
                    </div>

                    <div>
                        <div className="updateGame-page review-form-section">
                            <h1 className="updateGame-page-font subfont">Game Deletion</h1>
                            <div className="form-container">
                                <form className="register-form" onSubmit={handleDeleteFormSubmit}>

                                    <Box display="flex" flexDirection="column" gap={2}>
                                        <InputLabel htmlFor="standard-adornment-amount">Game Title To Delete</InputLabel>
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel id="game-select-label">Game</InputLabel>
                                            <Select
                                                labelId="game-select-label"
                                                id="game-select"
                                                name="game"
                                                value={deleteFormData.game}
                                                label="Game"
                                                onChange={handleDeleteChange}
                                            >
                                                {games.map((game) => (
                                                    <MenuItem key={game.title} value={game.title}>
                                                        {game.title}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <FormHelperText>{deleteFormErrors.game}</FormHelperText>

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
                            <h1 className="updateGame-page-font subfont">Inventory Updation</h1>
                            <div className="form-container">
                                <form className="register-form" onSubmit={handleUpdateInventoryFormSubmit}>

                                    <Box display="flex" flexDirection="column" gap={2}>
                                        <InputLabel htmlFor="standard-adornment-amount">Game Title To Update Inventory</InputLabel>
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel id="game-select-label">Game</InputLabel>
                                            <Select
                                                labelId="game-select-label"
                                                id="game-select-inventory"
                                                name="game"
                                                value={updateInventoryFormData.game}
                                                label="Game"
                                                onChange={handleUpdateInventoryChange}
                                            >
                                                {games.map((game) => (
                                                    <MenuItem key={game.title} value={game.title}>
                                                        {game.title}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            <FormHelperText>{updateInventoryFormErrors.game}</FormHelperText>
                                        </FormControl>

                                        <TextField
                                        id="give-platform"
                                        name="platform"
                                        value={updateInventoryFormData.platform}
                                        label="Platform"
                                        variant="outlined"
                                        onChange={handleUpdateInventoryChange}
                                        error={!!updateInventoryFormErrors.platform}
                                        helperText={updateInventoryFormErrors.platform || undefined}
                                        />
                                        
                                        <TextField
                                            id="update-amount"
                                            name="amount"
                                            value={updateInventoryFormData.amount}
                                            label="Amount"
                                            variant="outlined"
                                            type='number'
                                            onChange={handleUpdateInventoryChange}
                                            error={!!updateInventoryFormErrors.amount}
                                            helperText={updateInventoryFormErrors.amount || undefined}
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
                                            message={updateInventoryFormNotification.message}
                                            type={updateInventoryFormNotification.type}
                                            onClose={() => setUpdateInventoryFormNotification({ message: '', type: '' })}
                                        />
                                    </Box>
                                </form>
                            </div>
                        </div>
                    </div>

                    
                </div>

            </div>
        </LocalizationProvider>
    );
}

export default UpdateGameInventory;