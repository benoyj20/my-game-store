import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

export default function EmployeeDetailsCard({ employee }) {
  const {
    user_id,
    email,
    first_name,
    last_name,
    contact_number,
    role,
    hire_date,
    store_name
  } = employee;

  return (
    <Card
      sx={{
        maxWidth: 900,
        borderRadius: 4,
        boxShadow: 5,
        mb: 3,
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: 7,
        },
        backgroundColor: 'background.paper',
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'row', p: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ letterSpacing: 0.5, mb: 0.5 }}
          >
            Employee ID: {user_id || 'N/A'}
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            {first_name || 'N/A'} {last_name || 'N/A'}
          </Typography>

          <Typography
            variant="body2"
            color="white"
            sx={{
              display: 'inline-block',
              px: 1.5,
              py: 0.5,
              bgcolor: 'primary.light',
              borderRadius: 1,
              fontWeight: 500,
            }}
          >
            {role || 'N/A'}
          </Typography>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ mx: 3 }} />

        <Box sx={{ flex: 1 }}>
          <Stack spacing={0.8}>
            <Typography variant="body2" color="text.secondary">
              <strong>Email:</strong> {email || 'N/A'}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              <strong>Phone:</strong> {contact_number || 'N/A'}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              <strong>Hire Date:</strong>{' '}
              {hire_date ? new Date(hire_date).toLocaleDateString() : 'N/A'}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              <strong>Store Name:</strong> {store_name || 'N/A'}
            </Typography>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
