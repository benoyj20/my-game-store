import "react-multi-carousel/lib/styles.css";
import '../components/css/CartPage.css';
import WebsiteHeader from '../components/WebsiteHeader.jsx';
import Button from '@mui/material/Button';
import CartItem from "../components/CartItem.jsx";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Divider from '@mui/material/Divider';
import Notification from '../components/Notification.jsx';
import { useState, useCallback } from "react";
import { useAuth } from '../../AuthContext';

function CartPage({ cart, setCart, storeData, platformData }) {
    const { user } = useAuth();
    
    const [formNotification, setFormNotification] = useState({ message: '', type: '', visible: false });

    const showNotification = (message, type) => {
        setFormNotification({ message, type, visible: true });
        setTimeout(() => setFormNotification({ message: '', type: '', visible: false }), 3000);
    };

    const fetchData = useCallback(async () => {
        console.log("Fetch updated cart/orders if needed");
    }, []);

    const handleSubmit = async () => {
        if (!cart || cart.length === 0) {
            showNotification("Your cart is empty!", "error");
            return;
        }

        const orderDetails = cart.map(game => game.game_id).join(',');
        const quantity = cart.map(() => 1).join(',');

        try {
            const response = await fetch("https://my-game-store.onrender.com/submit_order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    email: user.email, 
                    gameTitle: orderDetails, 
                    quantity, 
                    storeData, 
                    platformData 
                })
            });

            const data = await response.json();

            if (data.success) {
                showNotification(data.message, "success");
                setTimeout(() => setCart([]), 3000);
            } else {
                showNotification(data.message, "error");
            }
        } catch (err) {
            console.error("Error submitting order:", err);
            showNotification("Server error occurred.", "error");
        }
    };

    return (
        <div>
            <WebsiteHeader />
            
            <h1 className="cart-page-font cart-page-title-spacing">Your Cart</h1>
            <Divider sx={{ margin: '0 20px 20px 20px', borderColor: 'purple' }} />
            <h1 className="cart-page-font cart-page-subTitle-spacing">
                {cart.length} {cart.length === 1 ? "Game" : "Games"} in cart
            </h1>

            <div className="addedItemSection">
                <div className="addedItemsCard">
                    {cart.length > 0 ? (
                        cart.map(game => (
                            <CartItem 
                                key={game.game_id} 
                                game={game}
                                setCart={setCart}
                            />
                        ))
                    ) : (
                        <p className="cart-page-font">Your cart is empty.</p>
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="totalAmountSection">
                        <div className="subHeading totalHeading">Total</div>
                        <div className="cart-page-font totalAmountValue">
                            ${cart.reduce((total, game) => total + Number(game.price), 0).toFixed(2)}
                        </div>

                        <div className="buyButton">
                            <Button
                                variant="contained"
                                color="inherit"
                                size="large"
                                startIcon={<ShoppingCartIcon sx={{ color: 'white' }} />} 
                                sx={{ 
                                    marginTop: 2,
                                    backgroundColor: '#6a0dad',  
                                    color: 'white',
                                    '&:hover': { backgroundColor: '#5a0080' } 
                                }} 
                                onClick={handleSubmit}
                            >
                                Buy
                            </Button>

                            <Notification
                                message={formNotification.message}
                                type={formNotification.type}
                                visible={formNotification.visible}
                                onClose={() => setFormNotification({ message: '', type: '', visible: false })}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CartPage;
