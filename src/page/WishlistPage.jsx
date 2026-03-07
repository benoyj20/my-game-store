import '../components/css/UpdateGameInventory.css';
import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import Notification from '../components/Notification.jsx';
import WebsiteHeader from '../components/WebsiteHeader.jsx';
import MultipleSelectChip from '../components/MultipleSelectChip';
import { useAuth } from '../../AuthContext';


function WishlistPage() {
  const { user } = useAuth();

  const [games, setGames] = useState([]);
  const [wishlistNames, setWishlistNames] = useState([]); 

  const [createFormData, setCreateFormData] = useState({
    wishlistName: '',
  });
  const [selectedCreateGames, setSelectedCreateGames] = useState([]);
  const [createFormErrors, setCreateFormErrors] = useState({});
  const [createNotification, setCreateNotification] = useState({ message: '', type: '' });

  const [deleteFormData, setDeleteFormData] = useState({ wishlistName: '' });
  const [deleteFormErrors, setDeleteFormErrors] = useState({});
  const [deleteNotification, setDeleteNotification] = useState({ message: '', type: '' });

  const fetchData = useCallback(async () => {
    try {
        if(!user || !user.email) return;
      const gamePromise = axios.post('https://my-game-store.onrender.com/getGameTitles', {});
      const wishlistPromise = axios.post('https://my-game-store.onrender.com/getWishlistNames', {email: user.email});

      const [gamesRes, wishlistsRes] = await Promise.all([gamePromise, wishlistPromise]);

      const fetchedGames = Array.isArray(gamesRes?.data?.data) ? gamesRes.data.data : [];
      const fetchedWishlists = wishlistsRes.data?.data || '';

      setGames(fetchedGames);
      setWishlistNames(
        fetchedWishlists.split(',').map(w => w.trim()).filter(w => w.length > 0)
      );
    } catch (err) {
      console.error('Error fetching games/wishlists:', err);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData(prev => ({ ...prev, [name]: value }));
    if (createFormErrors[name]) {
      setCreateFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateCreateForm = () => {
    const errs = {};
    if (!createFormData.wishlistName || !createFormData.wishlistName.trim()) {
      errs.wishlistName = 'Wishlist name is required.';
    }
    if (!selectedCreateGames || selectedCreateGames.length === 0) {
      errs.games = 'Select at least one game.';
    }
    setCreateFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateNotification({ message: '', type: '' });

    if (!validateCreateForm()) {
      setCreateNotification({ message: 'Please fix errors in the form.', type: 'error' });
      return;
    }

    try {
      const payload = {
        wishlistName: createFormData.wishlistName.trim(),
        games: selectedCreateGames,
        email: user?.email
      };

      const res = await axios.post('https://my-game-store.onrender.com/submitWishlist', payload);
      const data = res?.data;

      if ((data && data.success === 'true') || data?.success === true) {
        setCreateNotification({ message: data.message || 'Wishlist created.', type: 'success' });
        setCreateFormData({ wishlistName: '' });
        setSelectedCreateGames([]);
        setCreateFormErrors({});
        await fetchData();
      } else {
        setCreateNotification({ message: data?.message || 'Failed to create wishlist.', type: 'error' });
      }
    } catch (err) {
      console.error('Error creating wishlist:', err);
      setCreateNotification({ message: 'Server error occurred.', type: 'error' });
    }
  };

  const handleDeleteChange = (e) => {
    const { name, value } = e.target;
    setDeleteFormData(prev => ({ ...prev, [name]: value }));
    if (deleteFormErrors[name]) {
      setDeleteFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateDeleteForm = () => {
    const errs = {};
    if (!deleteFormData.wishlistName) {
      errs.wishlistName = 'Please select a wishlist to delete.';
    }
    setDeleteFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    setDeleteNotification({ message: '', type: '' });

    if (!validateDeleteForm()) {
      setDeleteNotification({ message: 'Please select a wishlist to delete.', type: 'error' });
      return;
    }

    try {
      const payload = { wishlistName: deleteFormData.wishlistName };
      const res = await axios.post('https://my-game-store.onrender.com/deleteWishlist', payload);
      const data = res?.data;

      if ((data && data.success === 'true') || data?.success === true) {
        setDeleteNotification({ message: data.message || 'Wishlist deleted.', type: 'success' });
        setDeleteFormData({ wishlistName: '' });
        setDeleteFormErrors({});
        await fetchData();
      } else {
        setDeleteNotification({ message: data?.message || 'Failed to delete wishlist.', type: 'error' });
      }
    } catch (err) {
      console.error('Error deleting wishlist:', err);
      setDeleteNotification({ message: 'Server error occurred.', type: 'error' });
    }
  };

  const gameTitles = games.map(g => g.title || g.name || String(g));

  return (
    <div>
      <WebsiteHeader />
      <div style={{ padding: 20 }}>
        <h1 className="updateGame-page-font cart-page-title-spacing">Wishlist Management</h1>
        <Divider sx={{ margin: '0 20px 20px 20px', borderColor: 'purple' }} />

        <div className="gameSection" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div className="updateGame-page review-form-section">
            <h2 className="updateGame-page-font subfont">Create Wishlist</h2>
            <div className="form-container">
              <form className="register-form" onSubmit={handleCreateSubmit}>
                <Box display="flex" flexDirection="column" gap={2}>
                  <TextField
                    id="wishlistName"
                    name="wishlistName"
                    label="Wishlist Name"
                    variant="outlined"
                    value={createFormData.wishlistName}
                    onChange={handleCreateChange}
                    error={!!createFormErrors.wishlistName}
                    helperText={createFormErrors.wishlistName || undefined}
                    fullWidth
                  />

                  <MultipleSelectChip
                    key="wishlist-games"
                    name="games"
                    label="Games"
                    valueList={gameTitles}
                    valueName={selectedCreateGames}
                    setValueName={setSelectedCreateGames}
                    gap={0}
                  />
                  {createFormErrors.games && <FormHelperText error>{createFormErrors.games}</FormHelperText>}

                  <Button variant="contained" color="primary" size="large" type="submit">
                    Create Wishlist
                  </Button>

                  <Notification
                    message={createNotification.message}
                    type={createNotification.type}
                    onClose={() => setCreateNotification({ message: '', type: '' })}
                  />
                </Box>
              </form>
            </div>
          </div>

          <div className="updateGame-page review-form-section">
            <h2 className="updateGame-page-font subfont">Delete Wishlist</h2>
            <div className="form-container">
              <form className="register-form" onSubmit={handleDeleteSubmit}>
                <Box display="flex" flexDirection="column" gap={2}>
                  <FormControl fullWidth variant="outlined" error={!!deleteFormErrors.wishlistName}>
                    <InputLabel id="wishlist-select-label">Wishlist</InputLabel>
                    <Select
                      labelId="wishlist-select-label"
                      id="wishlist-select"
                      name="wishlistName"
                      value={deleteFormData.wishlistName}
                      label="Wishlist"
                      onChange={handleDeleteChange}
                    >
                      {wishlistNames.map((w) => (
                        <MenuItem key={w} value={w}>
                          {w}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{deleteFormErrors.wishlistName}</FormHelperText>
                  </FormControl>

                  <Button variant="contained" color="primary" size="large" type="submit">
                    Delete Wishlist
                  </Button>

                  <Notification
                    message={deleteNotification.message}
                    type={deleteNotification.type}
                    onClose={() => setDeleteNotification({ message: '', type: '' })}
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

export default WishlistPage;
