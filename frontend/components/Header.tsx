"use client";

import * as React from 'react';
import IconButton from '@mui/joy/IconButton';
import Sheet from '@mui/joy/Sheet';
import GlobalStyles from '@mui/joy/GlobalStyles';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import Typography from '@mui/joy/Typography';
import { toggleSidebar } from '@/utils/sidebar';

export default function Header() {
  return (
    <Sheet
      sx={{
        display: { xs: 'flex', md: 'none' }, // Visible only on mobile
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'fixed',
        top: 0,
        width: '100vw',
        height: 'var(--Header-height)',
        zIndex: 9998, // Increased for prominence
        p: 1.5, // Slightly tighter padding
        gap: 2,
        borderBottom: '1px solid',
        borderColor: 'divider', // Use theme divider for consistency
        background: (theme) =>
          `linear-gradient(90deg, ${theme.vars.palette.primary[50]}, ${theme.vars.palette.primary[100]})`, // Subtle gradient
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Softer shadow
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease', // Smooth transitions
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ':root': {
            '--Header-height': '56px', // Slightly taller for better touch targets
            [theme.breakpoints.up('md')]: {
              '--Header-height': '0px', // Hidden on desktop
            },
          },
        })}
      />

      {/* Branding/Logo Area */}
      <Typography
        level="h4"
        sx={{
          fontWeight: 'bold',
          color: 'primary.800',
          letterSpacing: '0.02em',
          userSelect: 'none', // Prevent text selection
          ml: 1, // Align with content
          textTransform: 'uppercase', // Professional touch
        }}
      >
        BookSwap
      </Typography>

      {/* Menu Button */}
      <IconButton
        onClick={() => toggleSidebar()}
        variant="soft" // Softer variant for elegance
        color="primary"
        size="md" // Slightly larger for better touch
        sx={{
          borderRadius: '50%', // Circular button
          bgcolor: 'primary.100', // Light background
          color: 'primary.700', // Darker icon
          transition: 'all 0.2s ease-in-out', // Smooth hover/active
          '&:hover': {
            bgcolor: 'primary.200',
            transform: 'scale(1.1)', // Subtle zoom on hover
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', // Hover shadow
          },
          '&:active': {
            transform: 'scale(0.95)', // Click feedback
          },
        }}
      >
        <MenuRoundedIcon fontSize="medium" />
      </IconButton>
    </Sheet>
  );
}