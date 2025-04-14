"use client";

import * as React from 'react';
import { useEffect, useState } from 'react';
import BookCard from './BookCard';
import { getAllBooks } from '@/services/BookService';
import { Book } from '@/types/book';
import { Box, Typography, Skeleton, Grid, Container } from '@mui/joy';
import BookSearch from '@/features/search/components/BookSearch';

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const bookList = await getAllBooks();
        setBooks(bookList);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  return (
    <Container
      maxWidth="lg"
      sx={{
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3 },
      }}
    >
      {/* Heading */}
      <Typography
        level="h3"
        sx={{
          textAlign: 'left',
          mb: 2,
          fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
          fontWeight: 'bold',
          color: 'primary.800',
          letterSpacing: '-0.01em',
        }}
      >
        Explore Books
      </Typography>

      {/* Search Bar */}
      <Box sx={{ mb: 3, width: '100%' }}>
        <BookSearch books={books} onSetFilter={setBooks} />
      </Box>

      {/* Loading State */}
      {loading ? (
        <Grid container spacing={2}>
          {[...Array(6)].map((_, index) => (
            <Grid key={index} xs={12} sm={6} md={4} lg={3}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={250}
                sx={{ borderRadius: '8px' }}
              />
              <Skeleton variant="text" width="60%" sx={{ mt: 1 }} />
              <Skeleton variant="text" width="40%" />
            </Grid>
          ))}
        </Grid>
      ) : books.length > 0 ? (
        <Grid container spacing={2}>
          {books.map((book, index) => (
            <Grid
              key={book.bookId || index}
              xs={12}
              sm={6}
              md={4}
              lg={3}
            >
              <BookCard {...book} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography
          level="body-lg"
          sx={{
            textAlign: 'center',
            py: 4,
            color: 'text.secondary',
            fontSize: { xs: '1rem', sm: '1.1rem' },
          }}
        >
          No books available. Try adjusting your search or adding a new book!
        </Typography>
      )}
    </Container>
  );
}
