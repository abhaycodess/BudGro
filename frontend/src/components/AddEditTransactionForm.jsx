import React, { useState } from 'react';
import { Box, Button, TextField, MenuItem } from '@mui/material';

const categories = [
  'Food', 'Travel', 'Bills', 'Shopping', 'Health', 'Entertainment', 'Other'
];

export default function AddEditTransactionForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || {
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().slice(0, 10),
    type: 'expense',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Amount"
        name="amount"
        type="number"
        value={form.amount}
        onChange={handleChange}
        required
        inputProps={{ min: 0, step: 0.01 }}
      />
      <TextField
        select
        label="Category"
        name="category"
        value={form.category}
        onChange={handleChange}
        required
      >
        {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
      </TextField>
      <TextField
        label="Description"
        name="description"
        value={form.description}
        onChange={handleChange}
      />
      <TextField
        label="Date"
        name="date"
        type="date"
        value={form.date}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        required
      />
      <TextField
        select
        label="Type"
        name="type"
        value={form.type}
        onChange={handleChange}
        required
      >
        <MenuItem value="expense">Expense</MenuItem>
        <MenuItem value="income">Income</MenuItem>
      </TextField>
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button variant="contained" color="primary" type="submit" disabled={saving} sx={{ fontWeight: 600 }}>Save</Button>
        <Button variant="outlined" onClick={onCancel} disabled={saving}>Cancel</Button>
      </Box>
    </Box>
  );
}
