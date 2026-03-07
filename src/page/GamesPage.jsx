import "react-multi-carousel/lib/styles.css";
import '../components/css/GamePage.css';
import Carousels from '../components/Carousels.jsx';
import gameDetails from '../assets/gameDetails.js';
import WebsiteHeader from '../components/WebsiteHeader.jsx';
import { useState, useEffect } from 'react';
import Filters from '../components/Filters.jsx';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import gameFilters from "../assets/gameFilters.js";
import GameDetailsCard from "../components/GameDetailsCard.jsx";    
import axios from 'axios';


function GamesPage({ cart, setCart, storeData, setStoreData, platformData, setPlatformData }) {

    const initialFiltersState = {
        genre: [],
        price: [],
        platform: [],
        rating: [],
        developer: [], 
        publisher: [],
    };
    
    const [games, setGames] = useState([]);
    const [stores, setStores] = useState([]);
    const [platforms, setPlatforms] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState(initialFiltersState);
    const [selectedFiltersSQL, setSelectedFiltersSQL] = useState(initialFiltersState);

    const CarouselSkeleton = () => (
        <div style={{ 
            height: '500px',
            width: '100%', 
            backgroundColor: '#333',
            borderRadius: '8px',
            margin: '20px 0'
        }}>
        </div>
    );
    const [isCarouselLoading, setIsCarouselLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsCarouselLoading(false);
        }, 100); 

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchStores = async () => {
            try {
            const res = await axios.get("https://my-game-store.onrender.com/stores");
            setStores(res.data.data.map(store => store.store_name));
            } catch (err) {
            console.log(err);
            }
        };
        const fetchPlatforms = async () => {
            try {
            const res = await axios.get("https://my-game-store.onrender.com/platforms");
            setPlatforms(res.data.data.map(platform => platform.platform));
            } catch (err) {
            console.log(err);
            }
        };

        fetchStores();
        fetchPlatforms();
    }, []);


    useEffect(() => {
        const fetchGames = async () => {
            try {
                const res = await axios.post("https://my-game-store.onrender.com/game", 
                    { selectedFiltersSQL, storeData, platformData }
                );
                setGames(res.data.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchGames(); 

    }, [selectedFiltersSQL, storeData, platformData]);

    useEffect(() => {
        if (stores.length > 0 && !stores.some(store => store === storeData)) {
            setStoreData(stores[0]);
        }
        if(platforms.length > 0 && !platforms.some(platform => platform === platformData)) {
            setPlatformData(platforms[0]);
        }
    }, [stores, platforms]);

    useEffect(() => {
        setCart([]);
    }, [storeData, platformData]);

    return (
        <div >
            <WebsiteHeader/>
            <div className="retroText gamesPageHeader">
                Featured Games
            </div>
            {isCarouselLoading ? (
                <CarouselSkeleton />
            ) : (
                <Carousels gameDetails={gameDetails} />
            )}
            <div className="resultsSection">
                <div className="gameDetailsCard">
                    {games.length > 0 ? (
                        games.map(game => (
                            <GameDetailsCard 
                                key={game.game_id} 
                                game={game}
                                setCart={setCart}
                                cart={cart}
                            />
                        ))
                    ) : (
                        <p style={{ color: 'white', width: '100%', textAlign: 'center' }}>
                            No games match your filters.
                        </p>
                    )}
                </div>
                <div className="search">
                    <div className="subHeading filterHeading">Select Store</div>
                    <Select
                        labelId="store-select-label"
                        id="store-select"
                        name="store"
                        value={storeData}
                        label="Store"
                        onChange={(e) => setStoreData(e.target.value)}
                        sx={{ width: '420px', marginLeft: '10px' }}
                    >
                        {stores.map((store) => (
                            <MenuItem key={store} value={store}>
                                {store}
                            </MenuItem>
                        ))}
                    </Select>
                    <div className="subHeading filterHeading">Select Platform</div>
                    <Select
                        labelId="platform-select-label"
                        id="platform-select"
                        name="platform"
                        value={platformData}
                        label="Platform"
                        onChange={(e) => setPlatformData(e.target.value)}
                        sx={{ width: '420px', marginLeft: '10px' }}
                    >
                        {platforms.map((platform) => (
                            <MenuItem key={platform} value={platform}>
                                {platform}
                            </MenuItem>
                        ))}
                    </Select>
                    <div className="subHeading filterHeading">Search By</div>
                    <div className="gamePageFilter filter-container">
                        <Filters selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} 
                             setSelectedFiltersSQL={setSelectedFiltersSQL} filters={gameFilters} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GamesPage;