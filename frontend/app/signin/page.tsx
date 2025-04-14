'use client';

import { useAuthContext } from '@/context/AuthContext';
import { JSX, useState } from 'react';
import AlertStatus from '@/components/AlertStatus';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Container from '@mui/joy/Container';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import { CssBaseline } from '@mui/joy';

function Page(): JSX.Element {
  const { login } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState<{ show: boolean; success: boolean; message: string }>({
    show: false,
    success: false,
    message: '',
  });

  const [loading, setLoading] = useState(false);

const handleForm = async (event: React.FormEvent) => {
  event.preventDefault();
  setLoading(true);

  try {
    await login(email, password);
    setAlert({ show: true, success: true, message: 'Login successful!' });

    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
  } catch {
    setAlert({ show: true, success: false, message: 'Invalid credentials' });
  } finally {
    setLoading(false);
  }
};


  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0f7fa, #ffffff)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        px: 2,
      }}
    >
      <CssBaseline />
      <Container maxWidth="xs">
        <Box
          sx={{
            backgroundColor: '#ffffff',
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            boxShadow: 'lg',
            textAlign: 'center',
          }}
        >
          <Typography level="h3" sx={{ fontWeight: 'bold', color: '#0077b6', mb: 2 }}>
            Login
          </Typography>

          {alert.show && (
            <Box sx={{ mt: 2 }}>
              <AlertStatus success={alert.success} message={alert.message} />
            </Box>
          )}

          <Box component="form" onSubmit={handleForm} noValidate sx={{ mt: 2 }}>
            <Input
              required
              fullWidth
              id="email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              sx={{ mb: 2 }}
            />
            <Input
              required
              fullWidth
              name="password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              sx={{ mb: 2 }}
            />
            <Button
  type="submit"
  fullWidth
  disabled={loading}
  sx={{
    mt: 1,
    bgcolor: '#00bcd4',
    '&:hover': { bgcolor: '#0097a7' },
  }}
>
  {loading ? 'Signing in...' : 'Sign In'}
</Button>

         
          </Box>

          <Button
            component="a"
            href="/signup"
            variant="soft"
            sx={{ mt: 2, color: '#0288d1' }}
          >
            Sign up
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default Page;
