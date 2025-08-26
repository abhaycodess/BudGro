import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Paper, IconButton, Avatar, List, ListItem, ListItemAvatar, ListItemText, Grid
} from '@mui/material';
import CreditScoreIcon from '@mui/icons-material/Speed';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend);


function getUserId() {
  try {
    const user = JSON.parse(localStorage.getItem('budgro_user'));
    return user?.id || user?._id || null;
  } catch {
    return null;
  }
}

export default function Dashboard() {
  const [showAllTxs, setShowAllTxs] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    balance: 0,
    spending: Array(12).fill(0),
    expenses: [],
    creditScore: 0,
    transactions: []
  });

  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;
    setLoading(true);
    fetch(`http://localhost:3003/dashboard/${userId}`)
      .then(res => res.json())
      .then(data => {
        setStats({
          balance: data.balance ?? 0,
          spending: data.spending ?? Array(12).fill(0),
          expenses: data.expenses ?? [],
          creditScore: data.creditScore ?? 0,
          transactions: data.transactions ?? []
        });
        setLoading(false);
      })
      .catch(() => {
        setStats({ balance: 0, spending: Array(12).fill(0), expenses: [], creditScore: 0, transactions: [] });
        setLoading(false);
      });
  }, []);

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
      {loading && <Typography sx={{ textAlign: 'center', mt: 8, color: '#1A4D2E', fontWeight: 600 }}>Loading your dashboard...</Typography>}
      <Grid container spacing={3} justifyContent="center" alignItems="flex-start" maxWidth="lg" mx="auto">
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {/* Total Balance - no card background */}
            <Grid item xs={12} md={7}>
              <Box sx={{ borderRadius: 0, p: 0, background: 'none' }}>
                <Typography variant="subtitle2" color="#7a8fa6" fontWeight={500} fontFamily="Inter">Total Balance</Typography>
                <Typography variant="h3" fontWeight={700} color="#1A4D2E" sx={{ fontFamily: 'Cormorant Garamond, serif', mt: 1 }}>
                  ₹{stats.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button variant="contained" color="primary" sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600, px: 3 }}>Send</Button>
                  <Button variant="outlined" color="primary" sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600, px: 3 }}>Receive</Button>
                </Box>
                {/* My Cards - no card backgrounds */}
                <Box sx={{ display: 'flex', gap: 4, mt: 4, alignItems: 'flex-end' }}>
                  {/* Cards UI can be enhanced later. For now, show user's name and a placeholder card */}
                  <Box sx={{ minWidth: 120, flex: 1, p: 0 }}>
                    <Typography variant="body2" color="#7a8fa6" fontWeight={500}>Card</Typography>
                    <Box sx={{ my: 1, height: 24, background: 'url(https://svgshare.com/i/13kN.svg) no-repeat center/contain' }} />
                    <Typography variant="h6" fontWeight={700} color="#1A4D2E">**** 0000</Typography>
                    <Typography variant="caption" color="#7a8fa6">User</Typography>
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
                      data={{
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                        datasets: [
                          {
                            label: 'Spending',
                            data: stats.spending,
                            backgroundColor: '#1A4D2E',
                            borderRadius: 8,
                            barThickness: 18,
                          },
                        ],
                      }}
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
                  <Typography variant="h6" fontWeight={700} color="#1A4D2E" sx={{ mt: 1 }}>
                    ₹{stats.spending.reduce((a, b) => a + b, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </Typography>
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
                    data={{
                      labels: stats.expenses.map((e) => {
                        const d = new Date(e.date);
                        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      }),
                      datasets: [
                        {
                          label: 'Expenses',
                          data: stats.expenses.map(e => e.amount),
                          fill: true,
                          borderColor: '#1A4D2E',
                          backgroundColor: 'rgba(26,77,46,0.08)',
                          tension: 0.4,
                          pointRadius: 0,
                        },
                      ],
                    }}
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
                {(showAllTxs ? stats.transactions : stats.transactions.slice(0, 2)).map((tx, idx) => (
                  <ListItem key={idx} disableGutters sx={{ mb: 1, borderRadius: 2, px: 1, background: 'none' }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#1A4D2E', width: 36, height: 36, fontSize: 18 }}>{tx.name?.[0] || 'T'}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography fontWeight={600} color="#1A4D2E">{tx.name || 'Transaction'}</Typography>}
                      secondary={<Typography variant="caption" color="#7a8fa6">{tx.date ? new Date(tx.date).toLocaleString() : ''}</Typography>}
                    />
                    <Typography fontWeight={700} color={tx.amount < 0 ? '#e74c3c' : '#1A4D2E'}>
                      {tx.amount < 0 ? '-' : '+'}₹{Math.abs(tx.amount || 0).toFixed(2)}
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
                <Typography variant="h4" fontWeight={700} color="#1A4D2E">{stats.creditScore}</Typography>
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