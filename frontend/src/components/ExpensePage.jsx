import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, Fade, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Slide } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpensePageVector from '../assets/ExpensePageVector.png';

const dummyCategories = [
  'Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other'
];

// Table row for each expense, with Edit and Delete icons
const ExpenseRow = ({ expense, onEdit, onDelete }) => (
  <Fade in timeout={600}>
    <tr style={{ borderBottom: '1.5px solid #E0E0E0', background: 'none' }}>
      <td style={{ fontWeight: 700, color: '#1A4D2E', fontFamily: 'Inter, Arial, sans-serif', padding: '16px 8px', minWidth: 120 }}>{expense.title}</td>
      <td style={{ color: '#828282', fontFamily: 'Inter, Arial, sans-serif', padding: '16px 8px', minWidth: 80 }}>{expense.category}</td>
      <td style={{ color: '#828282', fontFamily: 'Inter, Arial, sans-serif', padding: '16px 8px', minWidth: 80 }}>{expense.date}</td>
      <td style={{ color: '#828282', fontFamily: 'Inter, Arial, sans-serif', padding: '16px 8px', minWidth: 80 }}>{expense.time}</td>
      <td style={{ color: '#27AE60', fontWeight: 700, fontFamily: 'Inter, Arial, sans-serif', padding: '16px 8px', minWidth: 80 }}>₹{expense.amount}</td>
      <td style={{ color: '#F2994A', fontFamily: 'Inter, Arial, sans-serif', padding: '16px 8px', minWidth: 120 }}>{expense.notes}</td>
      <td style={{ padding: '16px 8px', minWidth: 60, display: 'flex', gap: 4 }}>
        <IconButton size="small" color="primary" onClick={onEdit} aria-label="Edit"><EditIcon /></IconButton>
        <IconButton size="small" color="error" onClick={onDelete} aria-label="Delete"><DeleteIcon /></IconButton>
      </td>
    </tr>
  </Fade>
);

// Dialog for adding or editing an expense
const ExpenseDialog = ({ open, onClose, onSave, initialData, isEdit }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [amount, setAmount] = useState(initialData?.amount || '');
  const [category, setCategory] = useState(initialData?.category || dummyCategories[0]);
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [time, setTime] = useState(initialData?.time || '');

  useEffect(() => {
    setTitle(initialData?.title || '');
    setAmount(initialData?.amount || '');
    setCategory(initialData?.category || dummyCategories[0]);
    setNotes(initialData?.notes || '');
    setTime(initialData?.time || '');
  }, [initialData, open]);

  const handleSave = () => {
    if (!title || !amount || !time) return;
    onSave({
      title,
      amount: parseFloat(amount),
      category,
      notes,
      date: isEdit && initialData?.date ? initialData.date : new Date().toLocaleDateString(),
      time
    });
    setTitle(''); setAmount(''); setCategory(dummyCategories[0]); setNotes(''); setTime('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Slide} TransitionProps={{ direction: 'up' }}>
      <DialogTitle sx={{ fontWeight: 700, color: 'primary.main', fontFamily: 'Cormorant Garamond, serif' }}>{isEdit ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
      <DialogContent>
        <TextField label="Title" fullWidth sx={{ mb: 2 }} value={title} onChange={e => setTitle(e.target.value)} />
        <TextField label="Amount (₹)" type="number" fullWidth sx={{ mb: 2 }} value={amount} onChange={e => setAmount(e.target.value)} />
        <TextField label="Category" select fullWidth sx={{ mb: 2 }} value={category} onChange={e => setCategory(e.target.value)} SelectProps={{ native: true }}>
          {dummyCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </TextField>
        <TextField label="Time" type="time" fullWidth sx={{ mb: 2 }} value={time} onChange={e => setTime(e.target.value)} InputLabelProps={{ shrink: true }} />
        <TextField label="Notes (optional)" fullWidth multiline rows={2} value={notes} onChange={e => setNotes(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">{isEdit ? 'Save' : 'Add'}</Button>
      </DialogActions>
    </Dialog>
  );
};

const ExpensePage = () => {
  const [expenses, setExpenses] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('budgro_expenses')) || [];
    } catch {
      return [];
    }
  });
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  // user info is not used here
  const isLoggedIn = !!localStorage.getItem('budgro_token');

  useEffect(() => {
    localStorage.setItem('budgro_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleAddExpense = (expense) => {
    setExpenses(prev => [expense, ...prev]);
  };

  const handleDeleteExpense = (idx) => {
    setExpenses(prev => prev.filter((_, i) => i !== idx));
  };

  const handleEditExpense = (idx) => {
    setEditIdx(idx);
    setEditOpen(true);
  };

  const handleSaveEditExpense = (updatedExpense) => {
    setExpenses(prev => {
      const arr = [...prev];
      arr[editIdx] = {
        ...updatedExpense,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      return arr;
    });
    setEditOpen(false);
    setEditIdx(null);
  };

  if (!isLoggedIn) {
    return (
      <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, Arial, sans-serif' }}>
        <Typography variant="h5" color="text.secondary">Please log in to view your expenses.</Typography>
      </Box>
    );
  }

  // Always show the summary beside the table, even if there are no expenses

  return (
    <Box sx={{ minHeight: '80vh', bgcolor: 'background.default', py: 6, px: { xs: 1, md: 6 }, fontFamily: 'Inter, Arial, sans-serif' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', fontFamily: 'Cormorant Garamond, serif' }}>My Expenses</Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setAddOpen(true)} sx={{ fontWeight: 700, fontSize: 18, borderRadius: 3, px: 4, py: 1.5, boxShadow: 0 }}>
          Add Expense
        </Button>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {expenses.length === 0 ? (
            <Box sx={{ width: '100%', minHeight: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ width: 340, height: 340, mb: 3 }}>
                <img src={ExpensePageVector} alt="No expenses" style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.9 }} />
              </Box>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 0.5 }}>No expenses yet</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: 22, letterSpacing: 0.5 }}>Try adding one !</Typography>
            </Box>
          ) : (
            <Box sx={{ overflowX: 'auto', border: 'none', borderRadius: 0, background: 'none', boxShadow: 'none', p: 0, m: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'none', border: 'none', boxShadow: 'none', margin: 0, padding: 0 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #1A4D2E', background: 'none' }}>
                    <th style={{ textAlign: 'left', padding: '12px 8px', color: '#1A4D2E', fontWeight: 700, fontSize: 18, background: 'none', border: 'none' }}>Title</th>
                    <th style={{ textAlign: 'left', padding: '12px 8px', color: '#1A4D2E', fontWeight: 700, fontSize: 18, background: 'none', border: 'none' }}>Category</th>
                    <th style={{ textAlign: 'left', padding: '12px 8px', color: '#1A4D2E', fontWeight: 700, fontSize: 18, background: 'none', border: 'none' }}>Date</th>
                    <th style={{ textAlign: 'left', padding: '12px 8px', color: '#1A4D2E', fontWeight: 700, fontSize: 18, background: 'none', border: 'none' }}>Time</th>
                    <th style={{ textAlign: 'left', padding: '12px 8px', color: '#1A4D2E', fontWeight: 700, fontSize: 18, background: 'none', border: 'none' }}>Amount</th>
                    <th style={{ textAlign: 'left', padding: '12px 8px', color: '#1A4D2E', fontWeight: 700, fontSize: 18, background: 'none', border: 'none' }}>Notes</th>
                    <th style={{ textAlign: 'left', padding: '12px 8px', color: '#1A4D2E', fontWeight: 700, fontSize: 18, background: 'none', border: 'none' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense, idx) => (
                    <ExpenseRow key={idx} expense={expense} onEdit={() => handleEditExpense(idx)} onDelete={() => handleDeleteExpense(idx)} />
                  ))}
                </tbody>
              </table>
            </Box>
          )}
        </Box>
        <Box sx={{ width: { xs: '100%', md: 340 }, minWidth: 260, maxWidth: 400, flexShrink: 0 }}>
          <Fade in timeout={800}>
            <Box sx={{ borderRadius: 0, background: 'none', mb: 3, p: 0 }}>
              <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700, mb: 1 }}>Expense Summary</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                Total Expenses: <span style={{ color: '#27AE60', fontWeight: 700 }}>₹{expenses.reduce((a, b) => a + b.amount, 0).toFixed(2)}</span>
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                Categories: {Array.from(new Set(expenses.map(e => e.category))).join(', ')}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Last Updated: {expenses[0]?.date} {expenses[0]?.time}
              </Typography>
            </Box>
          </Fade>
          <Fade in timeout={1000}>
            <Box sx={{ borderRadius: 0, background: 'none', p: 0 }}>
              <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700, mb: 1 }}>Add More Details</Typography>
              <TextField label="Payment Method" fullWidth sx={{ mb: 2, background: 'none' }} placeholder="e.g. UPI, Card, Cash" />
              <TextField label="Location" fullWidth sx={{ mb: 2, background: 'none' }} placeholder="e.g. Mumbai, Home" />
              <TextField label="Tags" fullWidth sx={{ mb: 2, background: 'none' }} placeholder="e.g. Office, Personal" />
            </Box>
          </Fade>
        </Box>
      </Box>
      <ExpenseDialog open={addOpen} onClose={() => setAddOpen(false)} onSave={handleAddExpense} initialData={null} isEdit={false} />
      <ExpenseDialog open={editOpen} onClose={() => { setEditOpen(false); setEditIdx(null); }} onSave={handleSaveEditExpense} initialData={editIdx !== null ? expenses[editIdx] : null} isEdit={true} />
    </Box>
  );
};

export default ExpensePage;
