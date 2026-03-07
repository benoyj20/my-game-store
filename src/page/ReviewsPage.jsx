import "react-multi-carousel/lib/styles.css";
import WebsiteHeader from '../components/WebsiteHeader.jsx';
import '../components/css/ReviewPage.css';
import Divider from '@mui/material/Divider';

import { useState, useEffect, use } from 'react';
import reviewFilters from '../assets/reviewFilters.js';
import Filters from "../components/Filters.jsx";
import axios from 'axios';
import ReviewDetailsCard from "../components/ReviewDetailsCard.jsx";
import TextField from '@mui/material/TextField';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import { useAuth } from '../../AuthContext';
import { useCallback } from 'react';
import Notification from '../components/Notification.jsx';

export default function ReviewsPage() {
    const { user } = useAuth();
    const initialFiltersState = {
        reviewDate: [],
        rating: [],
        publisher: []
    };
    const [selectedFilters, setSelectedFilters] = useState(initialFiltersState);
    const [selectedFiltersSQL, setSelectedFiltersSQL] = useState(initialFiltersState);

    const [reviews, setReviews] = useState([]);
    const [games, setGames] = useState([]);

    const [notification, setNotification] = useState({ message: '', type: '' });

    const fetchReviews = useCallback(async () => {
        try {
            const res = await axios.post("https://my-game-store.onrender.com/reviews", 
                { selectedFiltersSQL }
            );
            setReviews(res.data.data);
        } catch (err) {
            console.log(err);
        }
    }, [selectedFiltersSQL]);

    useEffect(() => {
        fetchReviews(); 
    }, [fetchReviews]);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const res = await axios.post("https://my-game-store.onrender.com/getGameTitles", 
                    { }
                );
                setGames(res.data.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchGames(); 

    }, []);


    const [formData, setFormData] = useState({
        game: '',
        rating: null,
        comment: '',
        email: null
    });

    useEffect(() => {
    if (user && formData.email !== user.email) {
        setFormData(prevFormData => ({
            ...prevFormData,
            email: user.email 
        }));
    }
    }, [user, formData.email]);

    const [errors, setErrors] = useState({});

    const getWordCount = (text) => {
        return text.trim().split(/\s+/).filter(Boolean).length;
    };

    const wordCount = getWordCount(formData.comment);
    const isOverWordLimit = wordCount > 100;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
        setErrors({ ...errors, [name]: '' });
        }
    };

    const handleRatingChange = (event, newValue) => {
        setFormData({ ...formData, rating: newValue });
    };

    const validate = () => {
        let tempErrors = {};
        
        if (!formData.game) tempErrors.game = "Game selection is required.";
        if (!formData.rating) tempErrors.rating = "Please select a star rating.";
        if (!formData.comment) tempErrors.comment = "Comments are required.";

        setErrors(tempErrors);
        
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNotification({ message: '', type: '' });
        if (isOverWordLimit) {
        alert("Please shorten your comments to 100 words or less.");
        return;
        }
        if (validate()) {
            try {
                const response = await fetch("https://my-game-store.onrender.com/submitReview", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData) 
                });

                const data = await response.json();


                if (data.success == "true") {
                    setNotification({ message: data.message, type: 'success' });
                    await fetchReviews();
                    setFormData({
                        game: '',
                        rating: null,
                        comment: '',
                    });
                    setErrors({});
                }
                else {
                    setNotification({ message: data.data.message, type: 'error' });
                }
            } catch (err) {
                setNotification({ message: 'Failed to submit review. Please try again later.', type: 'error' });
                console.error(err);
            }
        }
        else {
            setNotification({ message: 'Please fix the errors in the form.', type: 'error' });
        }
    };

    return (
        <div >
            <WebsiteHeader/>
            <h1 className="cart-page-font cart-page-title-spacing">Reviews</h1>
            <Divider sx={{ margin: '0 20px 20px 20px', borderColor: 'purple' }} />
            <h1 className="cart-page-font cart-page-subTitle-spacing">
                {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"} found</h1>
            <div className="addedItemSection">
                <div className="addedItemsCard">
                    <div>
                                        {reviews.length > 0 ? (
                                            reviews.map(review => (
                                                <ReviewDetailsCard 
                                                    key={review.review_id} 
                                                    review={review}
                                                />
                                            ))
                                        ) : (
                                            <p style={{ color: 'white', width: '100%', textAlign: 'center' }}>
                                                No reviews match your filters.
                                            </p>
                                        )}
                    </div>
                </div>
                <div className="search">
                    <div className="subHeading reviewFilterHeading">Search By</div>
                    <div>
                        <Filters selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} 
                             setSelectedFiltersSQL={setSelectedFiltersSQL} filters={reviewFilters} />
                    </div>
                    <div className="subHeading reviewPostHeading">Post A Review</div>
                    <div className="review-page review-form-section">
                        <div className="form-container">
                            <form className="register-form" onSubmit={handleSubmit}>
                            
                                <Box display="flex" flexDirection="column" gap={1}>

                                    <FormControl fullWidth variant="outlined">
                                    <InputLabel id="game-select-label">Game</InputLabel>
                                    <Select
                                        labelId="game-select-label"
                                        id="game-select"
                                        name="game"
                                        value={formData.game}
                                        label="Game"
                                        onChange={handleChange}
                                    >
                                        {games.map((game) => (
                                            <MenuItem key={game.title} value={game.title}>
                                                {game.title}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>{errors.game}</FormHelperText>
                                    </FormControl>

                                    <TextField
                                    id="comment-input"
                                    name="comment"
                                    label="Comment"
                                    multiline
                                    rows={4}
                                    variant="outlined" 
                                    fullWidth
                                    value={formData.comment}
                                    onChange={handleChange}
                                    error={isOverWordLimit || !!errors.comment}
                                    helperText={errors.comment ? errors.comment : `${wordCount}/100 words`}
                                    />

                                    <Box 
                                        display="flex" 
                                        flexDirection="column" 
                                        alignItems="flex-start"
                                        >
                                        <Typography component="legend" variant="body2" sx={{ mt: 0.5 }}>
                                            Rate The Game
                                        </Typography>
                                        <Rating
                                            name="rating"
                                            value={formData.rating}
                                            onChange={handleRatingChange}
                                            precision={0.5}
                                            sx={{
                                            "& .MuiSvgIcon-root": {
                                                fontSize: "30px", 
                                            }
                                            }}
                                        />
                                        {errors.rating && (
                                            <FormHelperText error sx={{ fontSize: '12px', mt: -5, mb: 1 }}>
                                            {errors.rating}
                                            </FormHelperText>
                                        )}
                                    </Box>

                                    <Button 
                                    variant="contained" 
                                    color="primary" 
                                    size="large" 
                                    type="submit"
                                    disabled={isOverWordLimit}
                                    >
                                    Submit
                                    </Button>
                                    
                                    <Notification
                                        message={notification.message}
                                        type={notification.type}
                                        onClose={() => setNotification({ message: '', type: '' })}
                                    />
                                </Box>
                            </form>
                        </div>

                    </div>
                </div>
                
            </div>
            
        </div>
    );
}