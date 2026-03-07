import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import gameData from '../assets/gameDetails'; 

export default function CartItem({game, setCart}) {
    const handleRemove = () => {
        setCart(prev => prev.filter(item => item.game_id !== game.game_id));
    };

    const specificGame = gameData.find(gameFound => gameFound.title === game.title);
    let gameImage
    if (specificGame) {
        gameImage = specificGame.image;
    }
    return (
        <Card sx={{ maxWidth: 800, maxHeight: 600, objectFit: "contain", display: "flex", flexDirection: "row", position: "relative", mb: 2}}>
            <CardMedia
                component="img"
                image={gameImage}
                alt={game.title}
                sx={{
                    width: "110px",        
                    height: "auto",        
                }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>
                    {game.title}
                </Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    By {game.developer}
                </Typography>

                <Typography variant="h6" sx={{ color: 'success.main', fontWeight: 'medium' }}>
                    ${game.price}
                </Typography>
            </CardContent>
            <CardActions sx={{ position: "absolute", bottom: 8, right: 8 }}>
                <Button 
                    variant="contained" 
                    color="error" 
                    size="medium" 
                    startIcon={<DeleteIcon />}
                    onClick={handleRemove}
                >
                    Remove
                </Button>
            </CardActions>
        </Card>
    );
}