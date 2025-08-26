import React, { useState } from 'react';
import {
  Box, Typography, Button, Paper, IconButton, Avatar, List, ListItem, ListItemAvatar, ListItemText, Grid
} from '@mui/material';
import CreditScoreIcon from '@mui/icons-material/Speed';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend);

// Dummy Data
const balance = 31180.24;
const cards = [
  { type: 'Mastercard', number: '**** 4455', name: 'Jack Walson', color: '#e3eafe' },
  { type: 'Visa', number: '**** 1599', name: 'Jack Walson', color: '#e6f6f0' },
];
const spendingData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Spending',
      data: [400, 600, 500, 700, 800, 650, 900, 750, 820, 1020, 900, 625],
      backgroundColor: '#1A4D2E',
      borderRadius: 8,
      barThickness: 18,
    },
  ],
};
const expensesData = {
  labels: ['1 Dec', '2 Dec', '3 Dec', '4 Dec', '5 Dec', '6 Dec', '7 Dec', '8 Dec', '9 Dec', '10 Dec'],
  datasets: [
    {
      label: 'Expenses',
      data: [2000, 4000, 3000, 6000, 8000, 10245, 7000, 9000, 8500, 9500],
      fill: true,
      borderColor: '#1A4D2E',
      backgroundColor: 'rgba(26,77,46,0.08)',
      tension: 0.4,
      pointRadius: 0,
    },
  ],
};
const transactions = [
  { name: 'Apple Inc', date: '30 min ago', amount: -45.0 },
  { name: 'Jerry Helfer', date: '12 Dec 2024', amount: 120.0 },
  { name: 'Dribbble', date: '11 Dec 2024', amount: -350.0 },
  { name: 'Ekra Food', date: '09 Dec 2024', amount: -452.0 },
  { name: 'Paypal Payment', date: '04 Dec 2024', amount: 102.0 },
];
const creditScore = 1620;

export default function Dashboard() {
  const [showAllTxs, setShowAllTxs] = useState(false);

  return (
    <Box
      sx={{
        fontFamily: 'Cormorant Garamond, Inter, serif',
        background: 'linear-gradient(120deg, #f5fafd 0%, #eaf6f0 100%)',
        minHeight: '100vh',
        py: 4,
        px: { xs: 1, md: 4 },
      }}
    >
      <Grid container spacing={3} justifyContent="center" alignItems="flex-start" maxWidth="lg" mx="auto">
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {/* Total Balance - no card background */}
            <Grid item xs={12} md={7}>
              <Box sx={{ borderRadius: 0, p: 0, background: 'none' }}>
                <Typography variant="subtitle2" color="#7a8fa6" fontWeight={500} fontFamily="Inter">Total Balance</Typography>
                <Typography variant="h3" fontWeight={700} color="#1A4D2E" sx={{ fontFamily: 'Cormorant Garamond, serif', mt: 1 }}>
                  ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button variant="contained" color="primary" sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600, px: 3 }}>Send</Button>
                  <Button variant="outlined" color="primary" sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600, px: 3 }}>Receive</Button>
                </Box>
                {/* My Cards - no card backgrounds */}
                <Box sx={{ display: 'flex', gap: 4, mt: 4, alignItems: 'flex-end' }}>
                  {cards.map((card, idx) => (
                    <Box key={idx} sx={{ minWidth: 120, flex: 1, p: 0 }}>
                      <Typography variant="body2" color="#7a8fa6" fontWeight={500}>{card.type}</Typography>
                      <Box sx={{ my: 1, height: 24, background: 'url(https://svgshare.com/i/13kN.svg) no-repeat center/contain' }} />
                      <Typography variant="h6" fontWeight={700} color="#1A4D2E">{card.number}</Typography>
                      <Typography variant="caption" color="#7a8fa6">{card.name}</Typography>
                    </Box>
                  ))}
                  <Box sx={{ minWidth: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 60 }}>
                    <IconButton color="primary" size="large" sx={{ background: 'none', p: 0 }}><AddIcon /></IconButton>
                  </Box>
                </Box>
              </Box>
            </Grid>
            {/* Spending & Info - no card backgrounds */}
            <Grid item xs={12} md={5}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ borderRadius: 0, p: 0, background: 'none' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" color="#7a8fa6" fontWeight={500}>Spending</Typography>
                    <Button size="small" sx={{ color: '#1A4D2E', fontWeight: 600, textTransform: 'none' }}>Month</Button>
                  </Box>
                  <Box sx={{ height: 120, mt: 1 }}>
                    <Bar
                      data={spendingData}
                      options={{
                        plugins: { legend: { display: false } },
                        scales: {
                          x: { grid: { display: false }, ticks: { color: '#7a8fa6', font: { family: 'Inter' } } },
                          y: { grid: { display: false }, ticks: { display: false } },
                        },
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                    />
                  </Box>
                  <Typography variant="h6" fontWeight={700} color="#1A4D2E" sx={{ mt: 1 }}>$6250.00</Typography>
                </Box>
                <Box sx={{ borderRadius: 0, p: 0, background: 'none', minHeight: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography variant="subtitle2" color="#1A4D2E" fontWeight={600} fontFamily="Inter">How To Manage Money Well?</Typography>
                  <Button size="small" endIcon={<ArrowForwardIosIcon fontSize="small" />} sx={{ color: '#1A4D2E', fontWeight: 600, textTransform: 'none', mt: 1 }}>Learn More</Button>
                </Box>
              </Box>
            </Grid>
            {/* Expenses Chart - no card background */}
            <Grid item xs={12}>
              <Box sx={{ borderRadius: 0, p: 0, background: 'none' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" color="#7a8fa6" fontWeight={500}>Expenses</Typography>
                  <Button size="small" sx={{ color: '#1A4D2E', fontWeight: 600, textTransform: 'none' }}>Dec 06</Button>
                </Box>
                <Box sx={{ height: 180, mt: 1 }}>
                  <Line
                    data={expensesData}
                    options={{
                      plugins: { legend: { display: false } },
                      scales: {
                        x: { grid: { display: false }, ticks: { color: '#7a8fa6', font: { family: 'Inter' } } },
                        y: { grid: { display: false }, ticks: { color: '#7a8fa6', font: { family: 'Inter' } } },
                      },
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        {/* Right Column: Transactions and Credit Score in a row, no card backgrounds */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, alignItems: 'stretch', width: '100%' }}>
            {/* Transactions - collapsible and shorter height */}
            <Box sx={{ flex: 1, p: 0, background: 'none', minWidth: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, px: 0 }}>
                <Typography variant="subtitle2" color="#1A4D2E" fontWeight={600} fontFamily="Inter">Transactions</Typography>
                <Button size="small" sx={{ color: '#1A4D2E', fontWeight: 600, textTransform: 'none' }} onClick={() => setShowAllTxs(v => !v)}>
                  {showAllTxs ? 'Show Less' : 'Show All'}
                </Button>
              </Box>
              <List disablePadding sx={{ maxHeight: showAllTxs ? 400 : 160, overflow: 'hidden', transition: 'max-height 0.3s' }}>
                {(showAllTxs ? transactions : transactions.slice(0, 2)).map((tx, idx) => (
                  <ListItem key={idx} disableGutters sx={{ mb: 1, borderRadius: 2, px: 1, background: 'none' }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#1A4D2E', width: 36, height: 36, fontSize: 18 }}>{tx.name[0]}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography fontWeight={600} color="#1A4D2E">{tx.name}</Typography>}
                      secondary={<Typography variant="caption" color="#7a8fa6">{tx.date}</Typography>}
                    />
                    <Typography fontWeight={700} color={tx.amount < 0 ? '#e74c3c' : '#1A4D2E'}>
                      {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Box>
            {/* Credit Score */}
            <Box sx={{ flex: 1, p: 0, background: 'none', minWidth: 0, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>
                <CreditScoreIcon sx={{ color: '#1A4D2E', fontSize: 36, mr: 1 }} />
                <Typography variant="subtitle2" color="#1A4D2E" fontWeight={600} fontFamily="Inter">Credit Score</Typography>
              </Box>
              <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1 }}>
                {/* Gauge-like arc using SVG */}
                <svg width="120" height="60" viewBox="0 0 120 60">
                  <path d="M10,55 A50,50 0 0,1 110,55" fill="none" stroke="#e6f6f0" strokeWidth="12" />
                  <path d="M10,55 A50,50 0 0,1 110,55" fill="none" stroke="#1A4D2E" strokeWidth="10" strokeDasharray="80 100" />
                </svg>
                <Typography variant="h4" fontWeight={700} color="#1A4D2E">{creditScore}</Typography>
                <Typography variant="body2" color="#7a8fa6">Excellent</Typography>
              </Box>
              <Button size="small" sx={{ color: '#1A4D2E', fontWeight: 600, textTransform: 'none', mt: 1 }}>Explore Benefits</Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}