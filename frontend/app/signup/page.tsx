'use client';

import { JSX, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import AlertStatus from '@/components/AlertStatus';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Container from '@mui/joy/Container';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import { CssBaseline } from '@mui/joy';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';

function Page(): JSX.Element {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'owner' | 'seeker'>('owner');
  const [alert, setAlert] = useState<{ show: boolean; success: boolean; message: string }>({
    show: false,
    success: false,
    message: '',
  });

  const router = useRouter();

  const handleForm = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:4000/api/register', {
        name,
        mobile,
        email,
        password,
        role,
      });

      setAlert({ show: true, success: true, message: response.data.message });
      router.push('/');
    } catch (error: any) {
      setAlert({
        show: true,
        success: false,
        message: error.response?.data?.error || 'Registration failed',
      });
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
            Sign Up
          </Typography>

          {alert.show && (
            <Box sx={{ mt: 2 }}>
              <AlertStatus success={alert.success} message={alert.message} />
            </Box>
          )}

          <Box component="form" onSubmit={handleForm} sx={{ mt: 2 }}>
            <Input
              required
              fullWidth
              id="name"
              name="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              sx={{ mb: 2 }}
            />
            <Input
              required
              fullWidth
              id="mobile"
              name="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Mobile (10 digits)"
              sx={{ mb: 2 }}
            />
            <Input
              required
              fullWidth
              id="email"
              name="email"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              sx={{ mb: 2 }}
            />
            <Select
  required
  fullWidth
  value={role}
  onChange={(_, newValue) => setRole(newValue as 'owner' | 'seeker')}
  sx={{ mb: 2 }}
>
  <Option value="owner">Owner</Option>
  <Option value="seeker">Seeker</Option>
</Select>
            <Button
              type="submit"
              fullWidth
              sx={{
                mt: 1,
                bgcolor: '#00bcd4',
                '&:hover': { bgcolor: '#0097a7' },
              }}
            >
              Sign Up
            </Button>
          </Box>

          <Button
            component="a"
            href="/signin"
            variant="soft"
            sx={{ mt: 2, color: '#0288d1' }}
          >
            Back to Login
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default Page;
