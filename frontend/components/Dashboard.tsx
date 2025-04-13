import * as React from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Header from './Header';
import NavigationBar from './sidebar/NavigationBar';
import { CssBaseline, CssVarsProvider } from '@mui/joy';
import theme from '@/theme';
import { useAuthContext } from '@/context/AuthContext';
import BookList from '@/components/books/BookList';

const Dashboard: React.FC = () => {
  // Type for user to avoid 'any'
  const { user } = useAuthContext() as { user: { email: string; name?: string; role?: string } | null };

  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />

      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          bgcolor: 'background.body', // Ensures background changes based on the theme (dark or light)
          flexDirection: { xs: 'column', sm: 'row' }, // Stack on mobile, row on desktop
          overflow: 'hidden', // Prevent scroll issues
        }}
      >
        {/* Sidebar - Hidden on mobile, fixed on desktop */}
        <Box
          sx={{
            display: { xs: 'none', sm: 'block' }, // Hide on mobile
            width: { sm: '240px' }, // Fixed sidebar width
            flexShrink: 0,
            position: { sm: 'fixed' }, // Fixed on desktop
            height: { sm: '100vh' }, // Full height
            zIndex: 9999, // Above content
          }}
        >
          <NavigationBar />
        </Box>

        {/* Mobile Header - Visible only on mobile */}
        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
          <Header />
        </Box>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: {
              xs: '100%', // Full width on mobile
              sm: 'calc(100% - 240px)', // Adjust for sidebar
            },
            ml: { sm: '240px' }, // Offset for sidebar on desktop
            mt: { xs: 'var(--Header-height)', sm: 0 }, // Offset for header on mobile
            p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            bgcolor: 'background.surface', // Background will be responsive to the theme (dark or light)
            borderRadius: { xs: 0, sm: '8px' }, // No radius on mobile
            boxShadow: { sm: '0 4px 12px rgba(0, 0, 0, 0.05)' }, // Shadow on desktop
            minHeight: { xs: 'calc(100vh - var(--Header-height))', sm: '100vh' }, // Full height
            overflowY: 'auto', // Scrollable content
          }}
        >
          {/* Greeting */}
          <Box
            sx={{
              textAlign: 'center',
              py: 3,
              px: { xs: 2, sm: 3 },
              bgcolor: 'background.level1', // Adjusted for dark/light mode
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              mx: { xs: 0, sm: 'auto' }, // Center on desktop
              maxWidth: { xs: '100%', sm: '900px' }, // Full width on mobile
            }}
          >
            <Typography
              level="h1"
              sx={{
                fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' }, // Smaller on mobile
                fontWeight: 'bold',
                maxWidth: '900px',
                color: 'text.primary', // Text color adapts to theme (dark or light)
                mb: 1,
                letterSpacing: '-0.02em',
                lineHeight: 1.2, // Better readability
              }}
            >
              Welcome back, {user?.name || 'user'}!
            </Typography>
            <Typography
              level="body-md"
              sx={{
                color: 'text.secondary', // Text color for secondary text (adapted to theme)
                maxWidth: { xs: '90%', sm: '1000px' },
                mx: 'auto',
                width: '700px',
                fontSize: { xs: '0.875rem', sm: '1rem' }, // Smaller on mobile
              }}
            >
              Discover new books or Exchange your collection with the community.
            </Typography>
          </Box>

          {/* Book List */}
          <Box
            sx={{
              flexGrow: 1,
              p: { xs: 1, sm: 2 }, // Tighter padding on mobile
              width: '100%',
              maxWidth: '100%', // Prevent overflow
            }}
          >
            <BookList />
          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
};

export default Dashboard;
