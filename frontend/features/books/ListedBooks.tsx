import * as React from "react";
import { useEffect, useState } from "react";
import BookCard from "@/components/books/BookCard";
import { getListedBooks } from "@/services/BookService";
import { Book } from "@/types/book";
import { Box, Typography, Skeleton, Grid } from "@mui/joy";
import BookSearch from "@/features/search/components/BookSearch";
import { useAuthContext } from "@/context/AuthContext";

export default function BookList() {
  const { user } = useAuthContext() as { user: any }; // Use 'as' to assert the type as { user: any }
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      try {
        if (user?.email) {
          const bookList = await getListedBooks(user.email);
          setBooks(bookList);
        }
      } catch (error) {
        console.error("Error fetching listed books:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, [user?.email]);

  const handleEditBook = (updatedBook: Book) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.bookId === updatedBook.bookId ? updatedBook : book
      )
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          maxWidth: "100%",
          px: { xs: 2, sm: 3, md: 4 },
          py: 2,
          bgcolor: "background.surface",
          borderRadius: { xs: 0, sm: "8px" },
          boxShadow: { sm: "0 2px 8px rgba(0, 0, 0, 0.05)" },
        }}
      >
        <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
          {[...Array(6)].map((_, index) => (
            <Grid key={index} xs={12} sm={6} md={3} lg={2}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={250}
                sx={{ borderRadius: "8px" }}
              />
              <Skeleton variant="text" width="60%" sx={{ mt: 1 }} />
              <Skeleton variant="text" width="40%" />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        px: { xs: 2, sm: 3, md: 4 },
        py: 2,
        bgcolor: "background.surface",
        borderRadius: { xs: 0, sm: "8px" },
        boxShadow: { sm: "0 2px 8px rgba(0, 0, 0, 0.05)" },
      }}
    >
      <Typography
        level="h3"
        sx={{
          textAlign: "left",
          mb: { xs: 1, sm: 2, md: 3 },
          fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem" },
          fontWeight: "bold",
          color: "primary.800",
          letterSpacing: "-0.01em",
        }}
      >
        My List of Books
      </Typography>

      <Box sx={{ mb: { xs: 1, sm: 2, md: 3 }, maxWidth: { xs: "100%", sm: "1100px" } }}>
        <BookSearch books={books} onSetFilter={setBooks} />
      </Box>

      {books.length > 0 ? (
        <Grid
          container
          spacing={{ xs: 1, sm: 2, md: 3 }}
          sx={{
            width: "100%",
            m: 0,
          }}
        >
          {books.map((book) => (
            <Grid
              key={book.bookId}
              xs={12} // 1 card per row on mobile
              sm={6}  // 2 cards per row on tablet
              md={3}  // 3 cards per row on desktop
              lg={4}  // 2 cards per row on large screens
            >
              <BookCard
                {...book}
                onLike={(updatedBook) => {
                  handleEditBook(updatedBook);
                }}
                onEdit={handleEditBook} // Pass edit callback
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography
          level="body-lg"
          sx={{
            textAlign: "center",
            py: { xs: 2, sm: 3, md: 4 },
            color: "text.secondary",
            fontSize: { xs: "1rem", sm: "1.1rem" },
          }}
        >
          No books available.
        </Typography>
      )}
    </Box>
  );
}