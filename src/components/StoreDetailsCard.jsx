import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

export default function StoreDetailsCard({ store }) {
  const storeID = store.store_id || 'N/A';
  const storeName = store.store_name || 'N/A';
  const buildingNo = store.building_number || 'N/A';
  const street = store.street || 'N/A';
  const city = store.city || 'N/A';
  const state = store.state || 'N/A';
  const contactNo = store.contact_number || 'N/A';
  const employees = store.employee_list || "No employees";
  const totalEmployees = store.total_employees || '0';

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'row',
        maxWidth: 900,
        borderRadius: 4,
        boxShadow: 5,
        mb: 4,
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: 7,
        },
        backgroundColor: 'background.paper',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          p: 3,
        }}
      >
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ letterSpacing: 0.5, mb: 0.5 }}
        >
          STORE #{storeID}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1 }}
        >
          {buildingNo} {street}, {city}, {state}
        </Typography>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: 'primary.main',
          }}
        >
          {storeName}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          Contact: {contactNo}
        </Typography>
      </Box>

      <Divider orientation="vertical" flexItem />

      <CardContent
        sx={{
          flex: 1,
          p: 2.5,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, mb: 1 }}
        >
          Employees ({totalEmployees})
        </Typography>

        <Stack
          direction="row"
          flexWrap="wrap"
          spacing={1}
        >
          {employees.split(",").map((employee, i) => (
            <Chip
              key={i}
              label={employee}
              color="primary"
              size="small"
              sx={{ mb: 0.5 }}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
