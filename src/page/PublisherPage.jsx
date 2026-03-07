import "react-multi-carousel/lib/styles.css";
import WebsiteHeader from '../components/WebsiteHeader.jsx';
import '../components/css/ReviewPage.css';
import Divider from '@mui/material/Divider';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../components/css/PublisherPage.css';
import PublisherDetailsCard from "../components/PublisherDetailsCard.jsx";
import { useAuth } from '../../AuthContext';

export default function PublisherPage() {
    const { user } = useAuth();

    const [publishers, setPublishers] = useState([]);

    const fetchPublishers = useCallback(async () => {
        try {
            const res = await axios.post("http://localhost:5000/publishers", {});
            console.log(res.data.data);
            setPublishers(res.data.data);
        } catch (err) {
            console.log(err);
        }
    }, []);

    useEffect(() => {
        fetchPublishers(); 
    }, [fetchPublishers]);
    
    return (
        <div>
            <WebsiteHeader/>
            <h1 className="cart-page-font cart-page-title-spacing">Publishers</h1>
            <Divider sx={{ margin: '0 20px 20px 20px', borderColor: 'purple' }} />
            <h1 className="cart-page-font cart-page-subTitle-spacing">
                {publishers.length} {publishers.length === 1 ? "Publisher" : "Publishers"} found
            </h1>
            
            <div className="publishers-container">
                {publishers.length > 0 && publishers.map(publisher => (
                    <div
                        key={publisher.publisher_id}
                        className="publisher-card-wrapper"
                    >
                        <PublisherDetailsCard publisher={publisher} />
                    </div>
                ))}
            </div>
        </div>
    );
}
