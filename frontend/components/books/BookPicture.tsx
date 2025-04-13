import { useAuthContext } from '@/context/AuthContext';
import React from 'react';

const BookPicture = () => {
  const { user } = useAuthContext() as { user: any }; // Adjust type to User if possible

  // Use a default image or mock URL
  const imageUrl = user ? '/blank.svg' : '/blank.svg'; // Fallback to default image

  return (
    <div>
      <img
        id="bookPicture"
        src={imageUrl}
        alt="Book"
        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default BookPicture;