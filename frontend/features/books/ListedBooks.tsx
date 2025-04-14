import * as React from "react";
import { useEffect, useState } from "react";
import BookCard from "@/components/books/BookCard";
import { getListedBooks } from "@/services/BookService";
import { Book } from "@/types/book";
import { Box, Typography, Skeleton, Grid } from "@mui/joy";
import BookSearch from "@/features/search/components/BookSearch";
import { useAuthContext } from "@/context/AuthContext";

export default function BookList() {
  const { user } = useAuthContext() as { user: any };
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

  const gridSpacing = { xs: 1, sm: 2, md: 3 };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3 },
        bgcolor: "background.surface",
        borderRadius: { xs: 0, sm: "8px" },
        boxShadow: { sm: "0 2px 8px rgba(0, 0, 0, 0.05)" },
      }}
    >
      {/* Title */}
      <Typography
        level="h3"
        sx={{
          textAlign: "left",
          mb: { xs: 1.5, sm: 2.5 },
          fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem" },
          fontWeight: "bold",
          color: "primary.800",
          letterSpacing: "-0.01em",
        }}
      >
        My List of Books
      </Typography>

      {/* Search */}
      <Box sx={{ mb: { xs: 2, sm: 3 }, maxWidth: "100%" }}>
        <BookSearch books={books} onSetFilter={setBooks} />
      </Box>

      {/* Skeleton Loading */}
      {loading ? (
        <Grid container spacing={gridSpacing}>
          {[...Array(6)].map((_, index) => (
            <Grid key={index} xs={12} sm={6} md={4} lg={3}>
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
      ) : books.length > 0 ? (
        <Grid container spacing={gridSpacing}>
          {books.map((book) => (
            <Grid
              key={book.bookId}
              xs={12} // full width on mobile
              sm={6}  // 2 per row on small
              md={4}  // 3 per row on medium
              lg={3}  // 4 per row on large
              xl={2.4} // ~5 per row on extra large (if screen allows fractional)
            >
              <BookCard
                {...book}
                onLike={handleEditBook}
                onEdit={handleEditBook}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography
          level="body-lg"
          sx={{
            textAlign: "center",
            py: { xs: 2, sm: 3 },
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
