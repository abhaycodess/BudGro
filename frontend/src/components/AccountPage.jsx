import React, { useRef, useState } from 'react';
import ImageCropper from './ImageCropper';
import { Box, Typography, Avatar, Button, TextField, IconButton, Menu, MenuItem, Fade, Snackbar, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';



function getInitialUser() {
  try {
    const user = JSON.parse(localStorage.getItem('budgro_user'));
    if (!user) return null;
    // Add default fields if missing
    return {
      name: user.name || '',
      email: user.email || '',
      status: user.status || 'On duty',
      about: user.about || 'Discuss only on work hour, unless you wanna discuss about music 🎵.',
      avatar: localStorage.getItem('budgro_avatar') || (user.email ? `https://avatar.iran.liara.run/public/boy?username=${encodeURIComponent(user.email)}` : undefined)
    };
  } catch {
    return null;
  }
}


function AccountPage() {
  const [user, setUser] = useState(getInitialUser);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar);
  const [edited, setEdited] = useState(false);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [rawImage, setRawImage] = useState(null);
  const [avatarMenuAnchor, setAvatarMenuAnchor] = useState(null);
  const [profileEditMode, setProfileEditMode] = useState(false);
  const fileInputRef = useRef();
  // Snackbar state
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setRawImage(ev.target.result);
        setCropDialogOpen(true);
      };
      reader.readAsDataURL(file);
    }
    setAvatarMenuAnchor(null);
  };

  // For avatar hover/edit logic
  const [avatarHover, setAvatarHover] = useState(false);
  const handleAvatarMenuClose = () => {
    setAvatarMenuAnchor(null);
  };
  const handleAvatarDelete = () => {
    // Set to default avatar (same logic as getInitialUser)
    const defaultAvatar = user?.email ? `https://avatar.iran.liara.run/public/boy?username=${encodeURIComponent(user.email)}` : undefined;
    setAvatarUrl(defaultAvatar);
    setUser((prev) => ({ ...prev, avatar: defaultAvatar }));
    setEdited(true);
    setAvatarMenuAnchor(null);
    setAvatarHover(false);
  };

  const handleCropDone = (croppedImg) => {
    setAvatarUrl(croppedImg);
    setUser((prev) => ({ ...prev, avatar: croppedImg }));
    setEdited(true);
    setCropDialogOpen(false);
    setRawImage(null);
  };

  const handleCropCancel = () => {
    setCropDialogOpen(false);
    setRawImage(null);
  };

  const handleFieldChange = (field) => (e) => {
    setUser((prev) => ({ ...prev, [field]: e.target.value }));
    setEdited(true);
  };

  const handleProfileEditToggle = () => {
    setProfileEditMode((prev) => !prev);
    setEdited(true);
  };

  const handleSave = async () => {
    try {
      // Send avatar to backend
      await fetch('http://localhost:3002/user/avatar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, avatar: user.avatar })
      });
      // Save to localStorage
      localStorage.setItem('budgro_account', JSON.stringify(user));
      localStorage.setItem('budgro_avatar', user.avatar);
      setEdited(false);
      window.dispatchEvent(new Event('storage'));
      setShowSuccess(true);
      setAvatarHover(false);
    } catch {
      alert('Failed to save avatar to backend.');
    }
  };

  // On mount, fetch avatar from backend if exists
  React.useEffect(() => {
    async function fetchAvatar() {
      if (user?.email) {
        try {
          const res = await fetch('http://localhost:3002/user/avatar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email })
          });
          const data = await res.json();
          if (data.avatar) {
            setAvatarUrl(data.avatar);
            setUser((prev) => ({ ...prev, avatar: data.avatar }));
            localStorage.setItem('budgro_avatar', data.avatar);
          }
        } catch {
          // Failed to fetch avatar; ignore for now
        }
      }
    }
    fetchAvatar();
  }, [user?.email]);

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
        maxWidth: 900,
        px: { xs: 2, md: 6 },
        py: { xs: 4, md: 6 },
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'center', md: 'flex-start' },
        gap: { xs: 4, md: 6 },
        bgcolor: 'transparent',
        borderRadius: 0,
        boxShadow: 'none',
      }}>
        {/* Left: Enlarged Avatar */}
        <Box sx={{
          flexShrink: 0,
          width: { xs: 120, md: 220 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 2,
        }}>
          <Box
            sx={{ position: 'relative', mb: 2, width: { xs: 100, md: 180 }, height: { xs: 100, md: 180 }, cursor: 'pointer' }}
            onMouseEnter={() => setAvatarHover(true)}
            onMouseLeave={() => setAvatarHover(false)}
          >
            <Avatar
              src={avatarUrl}
              alt={user.name}
              sx={{
                width: '100%',
                height: '100%',
                border: '3px solid #1A4D2E',
                boxShadow: '0 2px 16px rgba(26,77,46,0.10)',
                transition: 'box-shadow 0.2s, filter 0.2s',
                zIndex: 1,
                filter: avatarHover ? 'blur(2.5px)' : 'none',
              }}
            />
            {avatarHover && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                  background: 'transparent',
                }}
              >
                <IconButton
                  sx={{
                    color: 'rgba(255,255,255,0.92)',
                    bgcolor: 'transparent',
                    opacity: 0.9,
                    fontSize: 36,
                    '&:hover': { bgcolor: 'transparent' },
                  }}
                  onClick={e => {
                    e.stopPropagation();
                    setAvatarMenuAnchor(e.currentTarget);
                  }}
                  size="large"
                >
                  <EditIcon fontSize="inherit" />
                </IconButton>
              </Box>
            )}
            <Menu
              anchorEl={avatarMenuAnchor && avatarMenuAnchor !== 'centered' ? avatarMenuAnchor : undefined}
              open={Boolean(avatarMenuAnchor)}
              onClose={handleAvatarMenuClose}
              TransitionComponent={Fade}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              transformOrigin={{ vertical: 'top', horizontal: 'center' }}
              slotProps={{ paper: { sx: { borderRadius: 1, minWidth: 180, p: 1.5, boxShadow: '0 8px 32px 0 rgba(26,77,46,0.14)' } } }}
            >
              <MenuItem onClick={() => { fileInputRef.current && fileInputRef.current.click(); handleAvatarMenuClose(); }} sx={{ borderRadius: 1, fontWeight: 600, color: 'primary.main', fontFamily: 'Inter' }}>
                <EditIcon sx={{ mr: 1, color: 'primary.main' }} fontSize="small" /> Change picture
              </MenuItem>
              <MenuItem onClick={handleAvatarDelete} sx={{ borderRadius: 1, fontWeight: 600, color: '#e74c3c', fontFamily: 'Inter' }}>
                <DeleteIcon sx={{ mr: 1, color: '#e74c3c' }} fontSize="small" /> Delete picture
              </MenuItem>
            </Menu>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleAvatarChange}
            />
            <ImageCropper
              open={cropDialogOpen}
              image={rawImage}
              onClose={handleCropCancel}
              onCropDone={handleCropDone}
            />
          </Box>
        </Box>
        {/* Right: Content */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
          <Box sx={{ width: '100%', mb: 1, position: 'relative' }}>
            <Typography sx={{ fontWeight: 700, fontFamily: 'Cormorant Garamond, serif', color: '#1A4D2E', fontSize: 28 }}>Profile name</Typography>
            <Button
              startIcon={<EditIcon sx={{ color: 'primary.main' }} />}
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                fontFamily: 'Inter',
                fontSize: 16,
                textTransform: 'none',
                position: 'absolute',
                right: 0,
                top: 0,
                px: 2,
                py: 0.5,
                minHeight: 0,
                minWidth: 0,
              }}
              onClick={handleProfileEditToggle}
            >
              Edit
            </Button>
          </Box>
          <TextField
            fullWidth
            size="small"
            value={user.name}
            onChange={handleFieldChange('name')}
            sx={{ mb: 2 }}
            InputProps={{
              style: { fontWeight: 600, fontFamily: 'Inter', color: '#1A4D2E', background: '#f7fbf9', borderRadius: 8 },
              readOnly: !profileEditMode,
            }}
          />
          <Typography sx={{ fontWeight: 700, fontFamily: 'Cormorant Garamond, serif', color: '#1A4D2E', fontSize: 22, mb: 1 }}>Username</Typography>
          <TextField
            fullWidth
            size="small"
            value={user.email}
            onChange={handleFieldChange('email')}
            sx={{ mb: 2 }}
            InputProps={{
              style: { fontWeight: 500, fontFamily: 'Inter', color: '#7a8fa6', background: '#f7fbf9', borderRadius: 8 },
              readOnly: !profileEditMode,
            }}
          />
          <Typography sx={{ fontWeight: 700, fontFamily: 'Cormorant Garamond, serif', color: '#1A4D2E', fontSize: 22, mb: 1 }}>Status recently</Typography>
          <TextField
            fullWidth
            size="small"
            value={user.status}
            onChange={handleFieldChange('status')}
            sx={{ mb: 2 }}
            InputProps={{
              style: { fontWeight: 500, fontFamily: 'Inter', color: '#1A4D2E', background: '#f7fbf9', borderRadius: 8 },
              readOnly: !profileEditMode,
            }}
          />
          <Typography sx={{ fontWeight: 700, fontFamily: 'Cormorant Garamond, serif', color: '#1A4D2E', fontSize: 22, mb: 1 }}>About me</Typography>
          <TextField
            fullWidth
            size="small"
            value={user.about}
            onChange={handleFieldChange('about')}
            multiline
            minRows={3}
            sx={{ mb: 3 }}
            InputProps={{
              style: { fontWeight: 500, fontFamily: 'Inter', color: '#1A4D2E', background: '#f7fbf9', borderRadius: 8 },
              readOnly: !profileEditMode,
            }}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{ bgcolor: '#1A4D2E', fontWeight: 700, fontFamily: 'Inter', fontSize: 16, borderRadius: 2, textTransform: 'none', py: 1.2, boxShadow: 'none', '&:hover': { bgcolor: '#16381F' } }}
            onClick={handleSave}
            disabled={!edited}
          >
            Save changes
          </Button>
        </Box>
      </Box>
    {/* Success Snackbar */}
  <Snackbar open={showSuccess} autoHideDuration={2000} onClose={() => setShowSuccess(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: '100%' }}>
        Profile updated successfully!
      </Alert>
    </Snackbar>
    </Box>
  );
}

export default AccountPage;
