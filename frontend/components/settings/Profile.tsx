import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import IconButton from '@mui/joy/IconButton';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import Autocomplete from '@mui/joy/Autocomplete';
import AutocompleteOption from '@mui/joy/AutocompleteOption';
import { CssVarsProvider, CssBaseline } from '@mui/joy';
import theme from '@/theme';
import interestList from '@/data/interests.json';
import { useAuthContext } from '@/context/AuthContext';
import { useCallback, useEffect, useState } from 'react'; // Fixed import
import { Gender, User } from '@/types/user';
import { retrieveUser, updateUserData } from '@/services/UserService';
import AlertStatus from '../AlertStatus';

export default function MyProfile() {
  const [name, setName] = useState<string>(''); // Combined firstName and lastName
  const [email, setEmail] = useState<string>('');
  const [gender, setGender] = useState<string>('-');
  const [interests, setInterests] = useState<string[]>([]);
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [profile, setProfile] = useState<string>('/blank.svg'); // Default image or preview
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [alert, setAlert] = useState<{ show: boolean; success: boolean; message: string }>({
    show: false,
    success: false,
    message: '',
  });

  const { user } = useAuthContext() as { user: User | null };

  const getUser = useCallback(async () => {
    if (user?.email) {
      const userData = await retrieveUser(user.email);
      setName(userData.name || '');
      setEmail(userData.email || '');
      setGender(userData.gender || '-');
      setInterests(userData.interests || []);
      setLookingFor(userData.lookingFor || []);
      setProfile(userData.profile || '/blank.svg');
      console.log(`Profile picture: ${userData.profile}`);
    }
  }, [user?.email]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleGenderChange = (value: string | null) => {
    setGender(value ? value : '-');
  };

  const handleInterestsChange = (value: string[] | null) => {
    setInterests(value || []);
  };

  const handleLookingForChange = (value: string[] | null) => {
    setLookingFor(value || []);
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileFile(file);
      setProfile(URL.createObjectURL(file)); // Preview the selected image
    }
  };

  useEffect(() => {
    getUser();
  }, [getUser]);

  const submitProfileSettings = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const updatedUser = {
          name,
          
        email,
        gender: gender as Gender,
        interests,
        lookingFor,
        profile, // Store base64 or URL
      };
      await updateUserData(updatedUser);
      setAlert({ show: true, success: true, message: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setAlert({ show: true, success: false, message: 'Profile update failed!' });
    } finally {
      setTimeout(() => {
        setAlert({ show: false, success: false, message: '' });
      }, 5000);
    }
  };

  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />

      <Box sx={{ flex: 1, width: '90%', justifyContent: 'center' }}>
        <Box
          sx={{
            position: 'sticky',
            top: { sm: -100, md: -110 },
            bgcolor: 'background.body',
            zIndex: 9995,
          }}
        >
          <Box sx={{ px: { xs: 2, md: 5 } }}>
            <Typography level="h1" component="h1" sx={{ mt: 1 }}>
              My Profile
            </Typography>
          </Box>
        </Box>

        <Box
          component="form"
          onSubmit={submitProfileSettings}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 2,
            width: '100%',
            px: { xs: 2, md: 5 },
          }}
        >
          <Card sx={{ width: '100%', height: '100%' }}>
            {alert.show && (
              <Box sx={{ paddingLeft: 2, paddingRight: 2 }}>
                <AlertStatus success={alert.success} message={alert.message} />
              </Box>
            )}

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
              }}
            >
              <Box component="form" sx={{ flex: 3, display: 'flex', flexDirection: 'row' }}>
                <Stack direction="column" spacing={3} sx={{ py: 1, px: 2, flexGrow: 1 }}>
                  <Stack direction="row" spacing={3}>
                    <FormControl sx={{ flexGrow: 1 }}>
                      <FormLabel>Name</FormLabel>
                      <Input
                        size="sm"
                        placeholder="Name"
                        value={name}
                        onChange={handleNameChange}
                        fullWidth
                      />
                    </FormControl>
                  </Stack>

                  <Stack direction="row" spacing={3}>
                    <FormControl sx={{ flexGrow: 1 }}>
                      <FormLabel>Email</FormLabel>
                      <Input
                        size="sm"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={handleEmailChange}
                        disabled
                        fullWidth
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        size="sm"
                        value={gender}
                        onChange={(e, newValue) => handleGenderChange(newValue)}
                      >
                        <Option value="F">F</Option>
                        <Option value="M">M</Option>
                        <Option value="-">-</Option>
                      </Select>
                    </FormControl>
                  </Stack>

                  <Stack>
                    <FormControl>
                      <FormLabel>I am interested in these genres of books:</FormLabel>
                      <Autocomplete
                        multiple
                        size="sm"
                        autoHighlight
                        value={interests}
                        onChange={(e, newValue) => handleInterestsChange(newValue)}
                        options={interestList}
                        renderOption={(optionProps, option) => (
                          <AutocompleteOption {...optionProps}>{option}</AutocompleteOption>
                        )}
                      />
                    </FormControl>
                  </Stack>

                  <Stack>
                    <FormControl>
                      <FormLabel>I am looking for these genres of books:</FormLabel>
                      <Autocomplete
                        multiple
                        size="sm"
                        autoHighlight
                        value={lookingFor}
                        onChange={(e, newValue) => handleLookingForChange(newValue)}
                        options={interestList}
                        renderOption={(optionProps, option) => (
                          <AutocompleteOption {...optionProps}>{option}</AutocompleteOption>
                        )}
                      />
                    </FormControl>
                  </Stack>
                </Stack>
              </Box>

              <Box component="form" sx={{ flex: 1, display: 'flex', alignItems: 'top', paddingLeft: 2, paddingRight: 2 }}>
                <FormControl sx={{ width: '100%', height: '80%', display: 'flex', flexDirection: 'column' }}>
                  <FormLabel sx={{ paddingTop: 1 }}>Profile Picture</FormLabel>
                  <AspectRatio
                    ratio="1"
                    sx={{
                      width: '100%',
                      height: '100%',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'transparent',
                      position: 'relative',
                    }}
                  >
                    <img
                      src={profile}
                      alt="Profile"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '0%',
                      }}
                    />
                  </AspectRatio>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileChange}
                    style={{ display: 'none' }}
                    id="profile-picture"
                  />
                  <label htmlFor="profile-picture">
                    <IconButton
                      aria-label="upload new picture"
                      size="sm"
                      variant="solid"
                      color="primary"
                      component="span"
                      sx={{
                        bgcolor: 'background.body',
                        position: 'absolute',
                        right: '6%',
                        bottom: '6%',
                        borderRadius: '50%',
                        boxShadow: 'sm',
                      }}
                    >
                      <EditRoundedIcon />
                    </IconButton>
                  </label>
                </FormControl>
              </Box>
            </Box>

            <CardActions sx={{ p: 2, justifyContent: 'center' }}>
              <Button type="submit">Update Profile</Button>
            </CardActions>
          </Card>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}