import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import gameData from '../assets/gameDetails'; 
import Box from '@mui/material/Box';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: 'rotate(0deg)',
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: 'rotate(180deg)',
      },
    },
  ],
}));

export default function GameDetailsCard({game, setCart, cart}) {
  const specificGame = gameData.find(gameFound => gameFound.title === game.title);
  let gameImage
  let publisherImage
  if (specificGame) {
    gameImage = specificGame.image;
    publisherImage = specificGame.developerLogoImage;
  }

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const isInCart = cart.some(item => item.game_id === game.game_id);

  const handleCartToggle = () => {
    if (isInCart) {
      setCart(prev => prev.filter(item => item.game_id !== game.game_id));
    } else {
      setCart(prev => [...prev, game]);
    }
    console.log("Current cart:", cart);
  };

  return (
    <Card sx={{ maxWidth: 345, display: "flex", flexDirection: "column" }}>
      <CardHeader
        avatar={
          <Avatar src = {publisherImage} alt={game.title[0]}>
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title= {game.name}
        subheader={game.developer}
      />

      
      {gameImage ? (
        <CardMedia
          component="img"
          height="400"
          image={gameImage}
          alt={game.title}
        />
      ) : (
        <Box
          sx={{
            height: 400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'grey.200',
            color: 'text.primary',
            fontSize: 24,
            fontWeight: 700,
            textAlign: 'center',
            px: 2
          }}
        >
          {game.title}
        </Box>
      )}
      <CardContent sx={{ flexGrow: 1 }}>
      </CardContent >
      <CardActions disableSpacing sx={{ gap: 2 }}>
        <Button
          variant={isInCart ? "outlined" : "contained"}
          color={isInCart ? "success" : "success"}
          size="small"
          startIcon={isInCart ? <CheckCircleIcon /> : null}
          onClick={handleCartToggle}
          sx={{ 
            minWidth: 150,       
            whiteSpace: 'nowrap' 
          }}
        >
          {isInCart ? "Added to Cart" : "Add to Cart"}
        
        </Button>
        {specificGame && specificGame.trailerLink && specificGame.trailerLink !== "TBD" && (
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => window.open(specificGame.trailerLink, "_blank")}
          sx={{ 
            minWidth: 115,   
            whiteSpace: 'nowrap' 
          }}
        >
          Watch Trailer
        </Button>
        )}
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography sx={{ marginBottom: 2 }}>
            {game.description}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
