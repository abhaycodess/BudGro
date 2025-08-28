import React, { useState, useEffect } from 'react';
import { useExpenseUpdate } from '../context/useExpenseUpdate.js';
import { Box, Typography, Button, IconButton, Avatar, List, ListItem, ListItemAvatar, ListItemText, Grid } from '@mui/material';
import CreditScoreIcon from '@mui/icons-material/Speed';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js';
import SimpleModal from './SimpleModal';
import AddEditTransactionForm from './AddEditTransactionForm';
import CreditScoreForm from './CreditScoreForm';
import AddCardIcon from '@mui/icons-material/AddCard';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaymentIcon from '@mui/icons-material/Payment';
import CloseIcon from '@mui/icons-material/Close';
import visaLogo from '../assets/visa.png';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend);

function getUserId() {
  try {
    const user = JSON.parse(localStorage.getItem('budgro_user'));
    return user?.id || user?._id || null;
  } catch {
    return null;
  }
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('budgro_user')) || {};
  } catch {
    return {};
  }
}

const CARD_ICONS = {
  visa: <img src={visaLogo} alt="Visa" style={{ width: 32, height: 20 }} />, 
  mastercard: <img src="/mastercard.svg" alt="Mastercard" style={{ width: 32, height: 20 }} />,
  rupay: <img src="/rupay.svg" alt="RuPay" style={{ width: 32, height: 20 }} />,
  discover: <img src="/discover.svg" alt="Discover" style={{ width: 32, height: 20 }} />,
  default: <PaymentIcon sx={{ fontSize: 32, color: '#fff', opacity: 0.7 }} />,
};

function getCardType(number) {
  if (/^4/.test(number)) return 'visa';
  if (/^5[1-5]/.test(number)) return 'mastercard';
  if (/^6/.test(number)) return 'discover';
  if (/^60|^6521|^6522/.test(number)) return 'rupay';
  return 'default';
}

export default function Dashboard() {
  // const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    balance: 0,
    spending: Array(12).fill(0),
    expenses: [],
    creditScore: 0,
    transactions: []
  });
  const [txModal, setTxModal] = useState({ open: false, initial: null });
  const [creditModal, setCreditModal] = useState(false);
  const [editTxId, setEditTxId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardType, setCardType] = useState('debit');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState(currentUser.name || '');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [addedCard, setAddedCard] = useState(null); // {number, name, expiry, type}
  const [editMode, setEditMode] = useState(false);
  // const theme = useTheme();

  // Fetch dashboard data
  const fetchDashboard = async (uid) => {
  // setLoading(true);
    const res = await fetch(`http://localhost:3003/dashboard/${uid}`);
    const data = await res.json();
    setStats({
      balance: data.balance ?? 0,
      spending: data.spending ?? Array(12).fill(0),
      expenses: data.expenses ?? [],
      creditScore: data.creditScore ?? 0,
      transactions: data.transactions ?? []
    });
  // setLoading(false);
  };

  const { updateFlag } = useExpenseUpdate();
  useEffect(() => {
    const uid = getUserId();
    setUserId(uid);
    setCurrentUser(getCurrentUser());
    if (!uid) return;
    fetchDashboard(uid);
  }, [updateFlag]);

  // Add or edit transaction
  const handleSaveTx = async (form) => {
    if (!userId) return;
    const payload = { ...form, userId };
    if (editTxId) {
      await fetch(`http://localhost:3003/expense/${editTxId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      await fetch('http://localhost:3003/expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
    setTxModal({ open: false, initial: null });
    setEditTxId(null);
    fetchDashboard(userId);
  };


  // Add or edit credit score
  const handleSaveCredit = async (score) => {
    if (!userId) return;
    await fetch(`http://localhost:3003/credit-score/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creditScore: score })
    });
    setCreditModal(false);
    fetchDashboard(userId);
  };

  // Card number input handler with auto-formatting
  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    // Insert space after every 4 digits
    val = val.replace(/(.{4})/g, '$1 ').trim();
    if (val.length > 19) val = val.slice(0, 19);
    setCardNumber(val);
  };

  // Expiry input handler with auto-insert '/'
  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/[^0-9/]/g, '');
    if (val.length === 2 && expiry.length === 1) {
      val += '/';
    }
    // Prevent more than 5 chars and only one '/'
    if (val.length > 5) val = val.slice(0, 5);
    if ((val.match(/\//g) || []).length > 1) return;
    setExpiry(val);
  };

  // When opening add/edit, prefill card number
  const openAddCard = (edit = false) => {
    setShowAddCard(true);
    setEditMode(edit);
    if (edit && addedCard) {
      setCardNumber(addedCard.number.replace(/(.{4})/g, '$1 ').trim());
      setCardName(addedCard.name);
      setExpiry(addedCard.expiry || '');
      setCardType(addedCard.type);
    } else {
      setCardNumber('');
      setCardName(currentUser.name || '');
      setExpiry('');
      setCardType('debit');
    }
  };

  // Card form submit
  const handleAddCard = (e) => {
    e.preventDefault();
    const rawCardNumber = cardNumber.replace(/\s/g, '');
    if (rawCardNumber.length !== 16 || !expiry || !cardName || !/^\d{2}\/\d{2}$/.test(expiry)) return;
    setAddedCard({
      number: rawCardNumber,
      name: cardName,
      expiry,
      type: cardType,
    });
    setShowAddCard(false);
  };

  return (
    <>
      <Box
        sx={{
          fontFamily: 'Cormorant Garamond, Inter, serif',
          background: 'linear-gradient(120deg, #f5fafd 0%, #f8f6fa 100%)',
          minHeight: '100vh',
          py: 4,
          px: { xs: 1, md: 4 },
        }}
      >
        {/* Top: Search, Upgrade Banner, User Info */}
        <Grid container spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1A4D2E', fontFamily: 'Cormorant Garamond, serif', mb: 0.5 }}>My Activity</Typography>
            <Typography variant="body2" sx={{ color: '#7a8fa6', fontFamily: 'Inter' }}>Check your expenses here</Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flex: 1, maxWidth: 320 }}>
              <input type="text" placeholder="Search anything..." style={{ width: '100%', padding: '10px 16px', borderRadius: 8, border: '1.5px solid #e0e6e6', fontFamily: 'Inter', fontSize: 16, outline: 'none' }} />
            </Box>
          </Grid>
        </Grid>
        {/* Main Content Row */}
        <Grid container spacing={3} alignItems="stretch">
          {/* Activity Summary (Line Chart) */}
          <Grid item xs={12} md={8}>
            <Box sx={{ background: '#fff', borderRadius: 1, boxShadow: 2, p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A4D2E', fontFamily: 'Inter' }}>Activity Summary</Typography>
                <Button size="small" sx={{ color: '#1A4D2E', fontWeight: 600, textTransform: 'none', borderRadius: 2 }}>Today</Button>
              </Box>
              <Box sx={{ height: 180 }}>
                <Line
                  data={{
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [
                      {
                        label: 'Expenses',
                        data: stats.spending,
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
            {/* Expense Analytics (Pie Chart) & Hurray Card */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ background: '#fff', borderRadius: 1, boxShadow: 2, p: 3, height: 240, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1A4D2E', fontFamily: 'Inter', mb: 2 }}>Expense Analytics</Typography>
                  <Pie
                    data={{
                      labels: stats.expenses.map(e => e.category),
                      datasets: [
                        {
                          data: stats.expenses.map(e => e.amount),
                          backgroundColor: ['#F2994A', '#27AE60', '#1A4D2E', '#1ABC9C', '#e67e22', '#e74c3c'],
                          borderWidth: 2,
                        },
                      ],
                    }}
                    options={{ plugins: { legend: { display: true, position: 'bottom' } }, responsive: true, maintainAspectRatio: false }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ background: 'linear-gradient(120deg, #f5fafd 0%, #eaf6f0 100%)', borderRadius: 1, boxShadow: 2, p: 3, height: 240, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A4D2E', fontFamily: 'Inter', mb: 1 }}>Hurray!</Typography>
                  <Typography variant="body1" sx={{ color: '#27AE60', fontWeight: 700, fontSize: 22 }}>You saved ₹{(stats.balance || 0).toLocaleString('en-IN')}</Typography>
                  <Typography variant="body2" sx={{ color: '#7a8fa6', fontFamily: 'Inter', mt: 1 }}>this month!</Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          {/* My Cards & Recent Transactions */}
          <Grid item xs={12} md={4}>
            <Box sx={{ background: '#fff', borderRadius: 1, boxShadow: 2, p: 3, mb: 3, position: 'relative' }}>
              {/* 1. My Cards header row with edit icon in top right */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Cormorant Garamond' }}>My Cards</Typography>
                {addedCard && (
                  <IconButton onClick={openAddCard} size="small" style={{ background: '#e0e6e6', marginLeft: 8 }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </div>
              {addedCard ? (
                // Only render one card, styled as a floating card (no overlay)
                <div style={{ position: 'relative', width: 300, height: 160, borderRadius: 18, background: 'linear-gradient(120deg, #176a3a 60%, #e0ffe6 100%)', boxShadow: '0 4px 24px #0002', padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', margin: '0 auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 600, fontSize: 18, fontFamily: 'Inter' }}>{cardName}</Typography>
                    <span style={{ background: '#fff8', color: '#176a3a', fontWeight: 700, fontSize: 12, borderRadius: 8, padding: '2px 10px', marginLeft: 8, marginTop: 2, letterSpacing: 1 }}>{cardType.toUpperCase()}</span>
                  </div>
                  <div style={{ marginTop: 18 }}>
                    <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, letterSpacing: 2, fontFamily: 'Inter' }}>**** {cardNumber.replace(/\s/g, '').slice(-4)}</Typography>
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                      <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500, fontFamily: 'Inter', marginRight: 12 }}>{expiry}</Typography>
                      {cardType === 'visa' && <img src={visaLogo} alt="Visa" style={{ height: 28, marginLeft: 'auto', filter: 'drop-shadow(0 0 2px #fff)' }} />}
                    </div>
                  </div>
                </div>
              ) : (
                <Box sx={{ width: '100%', height: 120, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', border: '2px dashed #27AE60', cursor: 'pointer', transition: 'border 0.2s', '&:hover': { borderColor: '#1A4D2E' } }} onClick={() => openAddCard(false)}>
                  <AddCardIcon sx={{ fontSize: 36, color: '#27AE60', mb: 1 }} />
                  <Typography sx={{ fontFamily: 'Cormorant Garamond, serif', color: '#27AE60', fontWeight: 600, fontSize: 22 }}>Add a card!</Typography>
                </Box>
              )}
            </Box>
            <Box sx={{ background: '#fff', borderRadius: 1, boxShadow: 2, p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A4D2E', fontFamily: 'Inter', mb: 2 }}>Recent Transactions</Typography>
              <List disablePadding>
                {(!stats.transactions || stats.transactions.length === 0) ? (
                  <ListItem disableGutters sx={{ justifyContent: 'center', minHeight: 80 }}>
                    <IconButton onClick={() => setTxModal({ open: true, initial: { type: 'expense' } })} sx={{ bgcolor: '#eaf6f0', borderRadius: 2, border: '1.5px solid #d0e6e0' }}>
                      <AddIcon fontSize="large" />
                    </IconButton>
                  </ListItem>
                ) : (
                  stats.transactions.slice(0, 4).map((tx, idx) => (
                    <ListItem key={idx} disableGutters sx={{ mb: 1, borderRadius: 2, px: 1, background: 'none' }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: '#1A4D2E', width: 36, height: 36, fontSize: 18 }}>{currentUser.name ? currentUser.name[0] : (tx.name?.[0] || 'T')}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={<Typography fontWeight={600} color="#1A4D2E">{tx.name || 'Transaction'}</Typography>}
                        secondary={<Typography variant="caption" color="#7a8fa6">{tx.date ? new Date(tx.date).toLocaleString() : ''}</Typography>}
                      />
                      <Typography fontWeight={700} color={tx.amount < 0 ? '#e74c3c' : '#1A4D2E'}>
                        {tx.amount < 0 ? '-' : '+'}₹{Math.abs(tx.amount || 0).toFixed(2)}
                      </Typography>
                    </ListItem>
                  ))
                )}
              </List>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <SimpleModal open={txModal.open} onClose={() => { setTxModal({ open: false, initial: null }); setEditTxId(null); }} title={editTxId ? 'Edit Transaction' : 'Add Transaction'} width={420}>
        <AddEditTransactionForm
          initial={txModal.initial}
          onSave={handleSaveTx}
          onCancel={() => { setTxModal({ open: false, initial: null }); setEditTxId(null); }}
        />
      </SimpleModal>
      <SimpleModal open={creditModal} onClose={() => setCreditModal(false)} title="Set Credit Score" width={340}>
        <CreditScoreForm
          initial={stats.creditScore}
          onSave={handleSaveCredit}
          onCancel={() => setCreditModal(false)}
        />
      </SimpleModal>
      {/* Add Card Modal */}
      {showAddCard && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', bgcolor: 'rgba(0,0,0,0.18)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ background: '#fff', borderRadius: 1, boxShadow: 4, p: 4, minWidth: 340, maxWidth: 380, width: '90vw', display: 'flex', flexDirection: 'column', gap: 2, position: 'relative' }}>
            <IconButton sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }} onClick={() => setShowAddCard(false)}>
              <CloseIcon />
            </IconButton>
            <Typography sx={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, color: '#1A4D2E', fontSize: 24, mb: 1 }}>{editMode ? 'Edit Card Details' : 'Add Card Details'}</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
              <Button variant={cardType === 'debit' ? 'contained' : 'outlined'} sx={{ borderRadius: 1, fontFamily: 'Inter', fontWeight: 600 }} onClick={() => setCardType('debit')}>Debit Card</Button>
              <Button variant={cardType === 'credit' ? 'contained' : 'outlined'} sx={{ borderRadius: 1, fontFamily: 'Inter', fontWeight: 600 }} onClick={() => setCardType('credit')}>Credit Card</Button>
            </Box>
            <form onSubmit={handleAddCard} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input type="text" placeholder="Cardholder Name" value={cardName} onChange={e => setCardName(e.target.value)} style={{ fontFamily: 'Inter', fontSize: 16, padding: 8, borderRadius: 6, border: '1.5px solid #e0e6e6', marginBottom: 8 }} required />
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={handleCardNumberChange}
                maxLength={19}
                style={{ fontFamily: 'Inter', fontSize: 16, padding: 8, borderRadius: 6, border: '1.5px solid #e0e6e6', marginBottom: 8, letterSpacing: 2 }}
                required
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={handleExpiryChange}
                  maxLength={5}
                  style={{ fontFamily: 'Inter', fontSize: 16, padding: 8, borderRadius: 6, border: '1.5px solid #e0e6e6', width: 90, textAlign: 'center' }}
                  required
                />
                <input type="password" placeholder="CVV" value={cvv} onChange={e => setCvv(e.target.value.replace(/[^0-9]/g, ''))} maxLength={4} style={{ fontFamily: 'Inter', fontSize: 16, padding: 8, borderRadius: 6, border: '1.5px solid #e0e6e6', width: 80 }} required />
              </Box>
              <Button type="submit" variant="contained" sx={{ borderRadius: 1, fontFamily: 'Inter', fontWeight: 700, mt: 2 }}>{editMode ? 'Save Changes' : 'Add Card'}</Button>
            </form>
            {/* Card Preview */}
            {cardNumber.replace(/\s/g, '').length >= 4 && (
              <Box sx={{ mt: 3, width: '100%', borderRadius: 1, background: 'linear-gradient(120deg, #1A4D2E 60%, #27AE60 100%)', color: '#fff', p: 2, minHeight: 80, position: 'relative', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={{ fontFamily: 'Inter', fontWeight: 500 }}>{cardName || 'Cardholder'}</Typography>
                <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 20, letterSpacing: 2 }}>**** {cardNumber.replace(/\s/g, '').slice(-4)}</Typography>
                <Typography sx={{ fontFamily: 'Inter', fontSize: 13, opacity: 0.8 }}>{expiry || 'MM/YY'}</Typography>
                <Box sx={{ position: 'absolute', right: 12, bottom: 8 }}>
                  {CARD_ICONS[getCardType(cardNumber.replace(/\s/g, ''))] || CARD_ICONS.default}
                </Box>
                <Box sx={{ position: 'absolute', top: 8, right: 12, bgcolor: '#fff2', borderRadius: 1, px: 1, fontSize: 12, fontWeight: 600, fontFamily: 'Inter' }}>{cardType.toUpperCase()}</Box>
                {/* Visa logo is handled by CARD_ICONS and getCardType */}
              </Box>
            )}
          </Box>
        </Box>
      )}
    </>
  );
}