import { Book } from "@/types/book";
import React, { useEffect, useState } from "react";
import Stack from "@mui/joy/Stack";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";

interface BookSearchProps {
  books: Book[];
  onSetFilter: (books: Book[]) => void;
}

const BookSearch: React.FC<BookSearchProps> = ({ books, onSetFilter }) => {
  const [search, setSearch] = useState("");

  useEffect(() => {
    const filtered =
      search.trim() === ""
        ? books
        : books.filter(
            (b) =>
              (b.title &&
                b.title.toLowerCase().includes(search.toLowerCase())) ||
              (b.author &&
                b.author.toLowerCase().includes(search.toLowerCase()))
          );
    onSetFilter(filtered);
  }, [search, books, onSetFilter]);

  return (
    <Stack
      direction="row"
      alignItems="flex-end"
      spacing={1}
      sx={{ width: "100%", paddingTop: 1, paddingBottom: 2 }}
    >
      <Input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search for a book title or author here!"
        sx={{ flexGrow: 1 }}
      />
      <Button variant="solid" onClick={() => {}}>
        Search
      </Button>
    </Stack>
  );
};

export default BookSearch;
