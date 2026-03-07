import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

export default function WishlistDetailsCard({ wishlist }) {
  const wishlistName = wishlist?.wishlist_name || 'N/A';
  const games = wishlist?.games ? wishlist.games.split(',') : [];

  return (
    <Card
      sx={{
        maxWidth: 800,
        borderRadius: 3,
        boxShadow: 5,
        mb: 3,
        backgroundColor: 'background.paper',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: 7 },
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        <Typography
          variant="h5"
          color="primary.main"
          sx={{ fontWeight: 700, mb: 1 }}
        >
          {wishlistName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {games.length === 0 ? "No games added yet." : "Games in this wishlist:"}
        </Typography>
      </CardContent>

      {games.length > 0 && (
        <CardContent sx={{ pt: 1, pb: 2 }}>
          <Stack direction="row" flexWrap="wrap" spacing={1}>
            {games.map((game, index) => (
              <Box
                key={index}
                sx={{
                  px: 2,
                  py: 0.7,
                  borderRadius: 2,
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  mb: 1,
                  cursor: 'default',
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: 'primary.main', transform: 'scale(1.05)' },
                }}
              >
                {game.trim()}
              </Box>
            ))}
          </Stack>
        </CardContent>
      )}
    </Card>
  );
}
