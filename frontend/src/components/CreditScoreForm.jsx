import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';

export default function CreditScoreForm({ initial, onSave, onCancel }) {
  const [score, setScore] = useState(initial || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    await onSave(Number(score));
    setSaving(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Credit Score"
        type="number"
        value={score}
        onChange={e => setScore(e.target.value)}
        required
        inputProps={{ min: 0, max: 2000 }}
      />
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button variant="contained" color="primary" type="submit" disabled={saving} sx={{ fontWeight: 600 }}>Save</Button>
        <Button variant="outlined" onClick={onCancel} disabled={saving}>Cancel</Button>
      </Box>
    </Box>
  );
}
