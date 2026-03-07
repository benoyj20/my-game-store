import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

export default function OrderDetailsCard({ order }) {

  const totalAmount = parseFloat(order.total_cost) || 0;
  const orderID = order.order_id || 'N/A';
  const orderDate = order.order_date ? new Date(order.order_date).toLocaleDateString() : 'N/A';
  const orderItemName = order.games_bought || "/N/A";
  const orderItemPrice = order.prices || "/N/A";
  const orderItemQuantity = order.quantities || "/N/A";  

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

        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.2,
            p: 2.5,
          }}
        >
          <Typography 
            variant="subtitle2" 
            color="text.secondary" 
            sx={{ letterSpacing: 0.5 }}
          >
            ORDER #{orderID}
          </Typography>

          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ mb: 0.5 }}
          >
            {orderDate}
          </Typography>

          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700, 
              color: 'primary.main',
              mt: 1 
            }}
          >
            {totalAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </Typography>
        </CardContent>

      </Box>

      <CardContent
        sx={{
          flex: 3,
          p: 2,
          borderLeft: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack spacing={1}>
        {orderItemName.split(",").map((name, i) => (
          <Stack
            key={i}
            direction="row"
            alignItems="center"
            sx={{
              p: 1,
              borderRadius: 1,
              bgcolor: i % 2 === 0 ? 'grey.100' : 'grey.50',
            }}
          >
            <Box sx={{ flex: 1, pr: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 500, wordBreak: 'break-word' }}
              >
                {name}
              </Typography>
            </Box>
            <Box sx={{ whiteSpace: 'nowrap', textAlign: 'right' }}>
              <Typography variant="body2" color="text.secondary">
                Qty: {orderItemQuantity.split(",")[i]} &nbsp;|&nbsp; 
                {parseFloat(orderItemPrice.split(",")[i]).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </Typography>
            </Box>
          </Stack>
        ))}
      </Stack>

      </CardContent>
    </Card>
  );
}