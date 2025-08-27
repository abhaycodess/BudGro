import React from 'react';
import { Box, Typography, AppBar, Toolbar, IconButton, Avatar, Menu, MenuItem, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function OrgDashboard() {
  // Placeholder for org/user info
  const orgName = 'Your Organization';
  const userName = 'Admin User';
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Top Bar */}
      <AppBar position="static" color="default" elevation={1} sx={{ bgcolor: '#fff', color: 'primary.main' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Cormorant Garamond, serif' }}>
              {orgName} Dashboard
            </Typography>
          </Box>
          <Box>
            <IconButton onClick={handleMenu} size="small">
              <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>{userName[0]}</Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose} onClick={handleClose}>
              <MenuItem>{userName}</MenuItem>
              <Divider />
              <MenuItem>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      {/* Main Content */}
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          Welcome to your Organization Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Here you will see an overview of your organization's expenses, team, and analytics. Use the sidebar (coming soon) to navigate between features.
        </Typography>
      </Box>
    </Box>
  );
}
