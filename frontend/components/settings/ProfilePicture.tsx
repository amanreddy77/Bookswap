import { useAuthContext } from '@/context/AuthContext';
import React from 'react';
import { User } from '@/types/user'; // Import for type safety

const ProfilePicture = () => {
  const { user } = useAuthContext() as { user: User | null };

  const profileUrl = user?.profile || '/person.svg'; // Use profile or default image

  return (
    <div>
      <img
        id="profilePicture"
        src={profileUrl}
        alt="Profile"
        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default ProfilePicture;