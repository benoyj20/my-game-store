import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

export default function PublisherDetailsCard({ publisher }) {

  const publisherID = publisher.publisher_id || 'N/A';
  const publisherName = publisher.publisher_name || 'N/A';
  const country = publisher.country || 'N/A';
  const year = publisher.year_founded || 'N/A';
  const totalGames = publisher.total_games ?? 'N/A';
  const listedGames = publisher.game_list ?? 'N/A';

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'row',
        maxWidth: 650, 
        borderRadius: 3,
        boxShadow: 2,
        mb: 2.5,
        overflow: 'hidden',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 6,
        },
        backgroundColor: '#fdfdfd',
      }}
    >

      <Box sx={{ flex: 1.2 }}>
        <CardContent sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          
          <Chip
            label={`#${publisherID}`}
            size="small"
            sx={{ 
              width: 'fit-content', 
              fontWeight: 600, 
              fontSize: 12, 
              bgcolor: '#ffcc80', 
              color: '#4e342e' 
            }}
          />

          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#6a1b9a' }}>
            {publisherName}
          </Typography>

          <Divider sx={{ my: 0.5, borderColor: '#ddd' }} />

          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
              <strong>Country:</strong> {country}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
              <strong>Founded:</strong> {year}
            </Typography>
          </Stack>

          <Divider sx={{ my: 1, borderColor: '#ddd' }} />

          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', fontWeight: 600 }}
          >
            TOTAL GAMES
          </Typography>

          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: '#ef6c00', mt: -0.5 }}
          >
            {totalGames}
          </Typography>
        </CardContent>
      </Box>

      <CardContent sx={{ flex: 1, p: 1.5 }}>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, mb: 2, fontSize: 13, color: '#424242' }}
        >
          Games Published
        </Typography>

        <Stack direction="row" flexWrap="wrap" spacing={0.5}>
          {listedGames.split(',').map((game, i) => (
            <Chip
              key={i}
              label={game}
              size="small"
              sx={{ 
                fontSize: 11, 
                mb: 0.3, 
                bgcolor: i % 2 === 0 ? '#b2dfdb' : '#ffe082', 
                color: '#424242' 
              }}
            />
          ))}
        </Stack>
      </CardContent>

    </Card>
  );
}
