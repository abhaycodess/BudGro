import React, { useRef, useState } from 'react';
import { Box, Typography, Avatar, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const defaultUser = {
  name: 'Demo User',
  email: 'demo@budgro.com',
  avatar: `https://avatar.iran.liara.run/public/boy?username=demo@budgro.com`,
  status: 'On duty',
  about: 'Discuss only on work hour, unless you wanna discuss about music 🎵.',
};
function AccountPage() {
  const [user, setUser] = useState(defaultUser);
  const [avatarUrl, setAvatarUrl] = useState(defaultUser.avatar);
  const [edited, setEdited] = useState(false);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const handleAvatarChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatarUrl(ev.target.result);
        setUser((prev) => ({ ...prev, avatar: ev.target.result }));
        setEdited(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFieldChange = (field) => (e) => {
    setUser((prev) => ({ ...prev, [field]: e.target.value }));
    setEdited(true);
  };

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('budgro_account', JSON.stringify(user));
    // Also store avatar separately for global access
    localStorage.setItem('budgro_avatar', user.avatar);
    setEdited(false);
    // Notify other tabs/components (Navbar) to update avatar
    window.dispatchEvent(new Event('storage'));
    // Redirect to dashboard
    navigate('/dashboard');
  };

  // On mount, load from localStorage if exists
  React.useEffect(() => {
    const saved = localStorage.getItem('budgro_account');
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed);
      setAvatarUrl(parsed.avatar);
    }
  }, []);

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100vw',
      bgcolor: '#f7fbf9',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Inter, Arial, sans-serif',
    }}>
      <Box sx={{
        width: '100%',
        maxWidth: 420,
        px: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        bgcolor: 'transparent',
      }}>
        <Avatar src={avatarUrl} alt={user.name} sx={{ width: 64, height: 64, mb: 1, border: '2px solid #1A4D2E' }} />
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleAvatarChange}
        />
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <Button
            variant="contained"
            sx={{ bgcolor: '#1A4D2E', fontWeight: 600, fontFamily: 'Inter', fontSize: 14, borderRadius: 2, textTransform: 'none', px: 2, '&:hover': { bgcolor: '#16381F' } }}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            Change picture
          </Button>
          <Button variant="outlined" sx={{ color: '#e74c3c', borderColor: '#e74c3c', fontWeight: 600, fontFamily: 'Inter', fontSize: 14, borderRadius: 2, textTransform: 'none', px: 2, '&:hover': { bgcolor: '#fbeaea', borderColor: '#e74c3c' } }}>Delete picture</Button>
        </Box>
        <Typography sx={{ fontWeight: 700, fontFamily: 'Cormorant Garamond, serif', color: '#1A4D2E', fontSize: 20, mb: 1, alignSelf: 'flex-start' }}>Profile name</Typography>
        <TextField fullWidth size="small" value={user.name} onChange={handleFieldChange('name')} sx={{ mb: 2 }} InputProps={{ style: { fontWeight: 600, fontFamily: 'Inter', color: '#1A4D2E', background: '#f7fbf9', borderRadius: 8 } }} />
        <Typography sx={{ fontWeight: 700, fontFamily: 'Cormorant Garamond, serif', color: '#1A4D2E', fontSize: 20, mb: 1, alignSelf: 'flex-start' }}>Username</Typography>
        <TextField fullWidth size="small" value={user.email} onChange={handleFieldChange('email')} sx={{ mb: 2 }} InputProps={{ style: { fontWeight: 500, fontFamily: 'Inter', color: '#7a8fa6', background: '#f7fbf9', borderRadius: 8 } }} />
        <Typography sx={{ fontWeight: 700, fontFamily: 'Cormorant Garamond, serif', color: '#1A4D2E', fontSize: 20, mb: 1, alignSelf: 'flex-start' }}>Status recently</Typography>
        <TextField fullWidth size="small" value={user.status} onChange={handleFieldChange('status')} sx={{ mb: 2 }} InputProps={{ style: { fontWeight: 500, fontFamily: 'Inter', color: '#1A4D2E', background: '#f7fbf9', borderRadius: 8 } }} />
        <Typography sx={{ fontWeight: 700, fontFamily: 'Cormorant Garamond, serif', color: '#1A4D2E', fontSize: 20, mb: 1, alignSelf: 'flex-start' }}>About me</Typography>
        <TextField
          fullWidth
          size="small"
          value={user.about}
          onChange={handleFieldChange('about')}
          multiline
          minRows={3}
          sx={{ mb: 3 }}
          InputProps={{ style: { fontWeight: 500, fontFamily: 'Inter', color: '#1A4D2E', background: '#f7fbf9', borderRadius: 8 } }}
        />
        <Button
          variant="contained"
          fullWidth
          sx={{ bgcolor: '#1A4D2E', fontWeight: 700, fontFamily: 'Inter', fontSize: 16, borderRadius: 2, textTransform: 'none', py: 1.2, '&:hover': { bgcolor: '#16381F' } }}
          onClick={handleSave}
          disabled={!edited}
        >
          Save changes
        </Button>
      </Box>
    </Box>
  );
}

export default AccountPage;
