import React, { use } from 'react';
import {
    Toolbar,
    Button,
    Box,
    IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountMenu from './AccountMenu.jsx';
import { useAuth } from '../../AuthContext';

function NavBar() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const navButtonStyles = {
        color: 'white',
        textTransform: 'none',
        fontWeight: 'bold',
        fontSize: '1.5rem',
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
    };

    return (
        <Box>
            <Toolbar className='nav'>
                <Button sx={navButtonStyles} className='navigationTitle' onClick={() => navigate('/')}>
                    Home
                </Button>

                {user ? (
                    <>
                        {(user.role === 'customer') && (
                            <>
                                <Button sx={navButtonStyles} className='navigationTitle' onClick={() => navigate('/games')}>
                                    Games
                                </Button>
                                <Button sx={navButtonStyles} className='navigationTitle' onClick={() => navigate('/publishers')}>
                                    Publishers
                                </Button>
                                <Button sx={navButtonStyles} className='navigationTitle' onClick={() => navigate('/reviews')}>
                                    Reviews
                                </Button>
                                <Button sx={navButtonStyles} className='navigationTitle' onClick={() => navigate('/wishlist')}>
                                    Wishlist
                                </Button>
                                <IconButton color="inherit" onClick={() => navigate('/cart')}>
                                    <ShoppingCartIcon style={{ fontSize: "28px" }} />
                                </IconButton>
                            </>
                        )}

                        {user.role === 'employee' && (
                            <>
                                <Button sx={navButtonStyles} className='navigationTitle' onClick={() => navigate('/updategame')}>
                                    Update Games
                                </Button>
                                <Button sx={navButtonStyles} className='navigationTitle' onClick={() => navigate('/publishermanagement')}>
                                    Publisher Management
                                </Button>
                            </>
                        )}

                        {user.role === 'admin' && (
                            <>
                                <Button sx={navButtonStyles} className='navigationTitle' onClick={() => navigate('/employeemanagement')}>
                                    Employee Management
                                </Button>
                                <Button sx={navButtonStyles} className='navigationTitle' onClick={() => navigate('/storemanagement')}>
                                    Store Management
                                </Button>
                            </>
                        )}

                        <AccountMenu />
                    </>
                ) : (
                    <>
                        <Button sx={navButtonStyles} className='navigationTitle' onClick={() => navigate('/registration')}>
                            Registration
                        </Button>
                        <Button sx={navButtonStyles} className='navigationTitle' onClick={() => navigate('/login')}>
                            Login
                        </Button>
                    </>
                )}
            </Toolbar>
        </Box>
    );
}

export default NavBar;