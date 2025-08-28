import React, { useState } from 'react';
import { Box, IconButton, Tooltip, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ChatBubbleIcon from '@mui/icons-material/ChatBubbleOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';


const icons = [
  { icon: <HomeIcon />, label: 'Home', to: '/dashboard' },
  { icon: <DashboardIcon />, label: 'Dashboard', to: '/dashboard' },
  { icon: <ChatBubbleIcon />, label: 'Chat', to: '/chat' },
  { icon: <AccountCircleIcon />, label: 'Account', to: '/account' },
  { icon: <SettingsIcon />, label: 'Settings', to: '/settings' },
  { icon: <ExitToAppIcon />, label: 'Logout', action: 'logout' },
];

export default function FloatingSidebar() {
  const [open, setOpen] = useState(false);

  // Logout handler: clears localStorage and redirects to correct login page
  const handleLogout = () => {
    const user = (() => {
      try {
        return JSON.parse(localStorage.getItem('budgro_user'));
      } catch {
        return null;
      }
    })();
    localStorage.removeItem('budgro_token');
    localStorage.removeItem('budgro_user');
    localStorage.removeItem('budgro_avatar');
    // Detect org user (role/type/email)
    const isOrg = user?.role === 'Organization' || user?.type === 'Organization' || (user?.email && user.email.includes('org'));
    window.location.href = isOrg ? '/org-login' : '/login';
  };

  return (
    <Box
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      sx={{
        position: 'fixed',
        top: '50%',
        left: 0,
        transform: 'translateY(-50%)',
        zIndex: 1300,
        borderRadius: 1,
        boxShadow: 4,
        bgcolor: 'background.paper',
        p: open ? 1 : 0.5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: 320,
        width: open ? 56 : 8,
        border: '1.5px solid #e0e6e6',
        cursor: 'pointer',
        transition: 'width 0.25s',
        overflow: 'hidden',
      }}
    >
      {open && icons.map(({ icon, label, to, action }) => (
        <Tooltip title={label} placement="left" key={label} arrow>
          <IconButton
            color="primary"
            size="large"
            sx={{ my: 1, borderRadius: 2 }}
            onClick={() => {
              if (action === 'logout') return handleLogout();
              if (to) window.location.href = to;
            }}
          >
            {icon}
          </IconButton>
        </Tooltip>
      ))}
    </Box>
  );
}
