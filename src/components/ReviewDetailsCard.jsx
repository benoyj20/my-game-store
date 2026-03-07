import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import gameData from '../assets/gameDetails';

export default function ReviewDetailsCard({ review }) {
  const specificGame = gameData.find(game => game.title === review.game_title);
  const gameImage = specificGame?.image;

  const numericRating = parseFloat(review.rating) || 0;


  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'row',
        maxWidth: 800,
        borderRadius: 3,
        boxShadow: 3,
        mb: 3,
        overflow: 'hidden',
        backgroundColor: 'background.paper',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flex: 1,
        }}
      >
        <CardMedia
          component="img"
          image={gameImage}
          alt={review.game_title}
          sx={{
            width: 100,
            height: '100%',
            objectFit: 'cover',
            flexShrink: 0,
          }}
        />

        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            flexGrow: 1,
            p: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            {review.game_title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            By {review.reviewer_first_name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {new Date(review.review_date).toLocaleDateString()}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mt: 'auto', 
            }}
          >
            <Rating
              name="read-only-rating"
              value={numericRating} 
              precision={0.5} 
              readOnly
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({numericRating})
            </Typography>
          </Box>
        </CardContent>
      </Box>

      <CardContent
        sx={{
          flex: 1,
          p: 2,
          borderLeft: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.5 }}>
          {review.comment}
        </Typography>
      </CardContent>
    </Card>
  );
}