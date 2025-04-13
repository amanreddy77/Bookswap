import * as React from "react";
import { useState } from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Typography from "@mui/joy/Typography";
import Card from "@mui/joy/Card";
import CardActions from "@mui/joy/CardActions";
import { CssVarsProvider, CssBaseline } from "@mui/joy";
import theme from "@/theme";
import interestList from "@/data/interests.json";
import { useAuthContext } from "@/context/AuthContext";
import AlertStatus from "../AlertStatus";
import { generateBookId, updateListedBookRecords, addNewBook } from "@/services/BookService";
import { Book, genre} from "@/types/book";

interface AuthContextType {
  user: { email: string; mobile?: string } | null;
}

export default function AddBook() {
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [genre, setGenre] = useState<genre | null>(null);
  const [location, setLocation] = useState<string>("");
  const [rating, setRating] = useState<number | null>(null);
  const [image, setImage] = useState<string>("/blank.svg"); // Default placeholder
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [alert, setAlert] = useState<{ show: boolean; success: boolean; message: string }>({
    show: false,
    success: false,
    message: "",
  });

  const { user } = useAuthContext() as AuthContextType;

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleAuthorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAuthor(event.target.value);
  };

  const handleGenreChange = (value: string | null) => { // Changed from handleCategoryChange
    setGenre(value as genre);
    console.log("Selected genre:", value); // Debug log
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(event.target.value);
  };

  const handleRatingChange = (value: number | null) => {
    setRating(value);
  };

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 300;
        canvas.height = 400;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, 300, 400);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const resizedImage = await resizeImage(file);
      setImageFile(file);
      setImage(resizedImage);
    }
  };

  const submitBookDetails = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      setAlert({ show: true, success: false, message: "You must be logged in to add a book" });
      return;
    }

    if (!title || !author || !genre || !location) { // Changed from category to genre
      setAlert({
        show: true,
        success: false,
        message: "All fields except rating and image are required",
      });
      return;
    }

    const bookId = generateBookId();
    const formData = new FormData();
    formData.append("bookId", bookId);
    formData.append("title", title);
    formData.append("author", author);
    formData.append("genre", genre || ""); // Changed from category to genre
    formData.append("city", location);
    formData.append("location", location);
    formData.append("rating", (rating ?? 2).toString());
    formData.append("ownerUsername", user.email);
    if (imageFile) formData.append("image", imageFile);

    try {
      const response = await addNewBook(formData);
      console.log("Server response:", response); // Debug response
      await updateListedBookRecords(user.email, bookId);

      setAlert({ show: true, success: true, message: "Book added successfully!" });

      setTitle("");
      setAuthor("");
      setGenre(null); // Changed from setCategory to setGenre
      setImage("/blank.svg");
      setImageFile(null);
      setLocation("");
      setRating(null);
    } catch (error: any) {
      console.error("Error adding book:", error.message || error);
      setAlert({ show: true, success: false, message: error.message || "Failed to add book" });
    }

    setTimeout(() => {
      setAlert({ show: false, success: false, message: "" });
    }, 5000);
  };

  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flex: 1, width: "100%", maxWidth: "none", justifyContent: "center", mx: "auto", px: { xs: 2, md: 4 } }}>
        <Box
          sx={{
            position: "sticky",
            top: { sm: -100, md: -110 },
            bgcolor: "background.body",
            zIndex: 9995,
          }}
        >
          <Box sx={{ px: { xs: 2, md: 5 } }}>
            <Typography level="h1" component="h1" sx={{ mt: 1 }}>
              Add a Book
            </Typography>
            <Typography level="h4" component="h2" sx={{ mt: 1 }}>
              Fill in the details of the book you want to list.
            </Typography>
          </Box>
        </Box>

        <Box
          component="form"
          onSubmit={submitBookDetails}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 2,
            width: "100%",
            maxWidth: "1200px",
            mx: "auto",
            paddingLeft: { xs: 2, md: 5 },
          }}
        >
          <Card sx={{ width: "100%", height: "100%", p: { xs: 1, md: 2 } }}>
            {alert.show && (
              <Box sx={{ paddingLeft: 2, paddingRight: 2 }}>
                <AlertStatus success={alert.success} message={alert.message} />
              </Box>
            )}

            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, width: "100%" }}>
              <Box sx={{ flex: 3, display: "flex", flexDirection: "column", width: "100%" }}>
                <Stack direction="column" spacing={3} sx={{ py: 1, px: 2, flexGrow: 1 }}>
                  <FormControl sx={{ flexGrow: 1 }}>
                    <FormLabel>Title</FormLabel>
                    <Input
                      size="sm"
                      placeholder="Book Title"
                      value={title}
                      onChange={handleTitleChange}
                      fullWidth
                      required
                    />
                  </FormControl>

                  <FormControl sx={{ flexGrow: 1 }}>
                    <FormLabel>Author of the book</FormLabel>
                    <Input
                      size="sm"
                      placeholder="Author"
                      value={author}
                      onChange={handleAuthorChange}
                      fullWidth
                      required
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Genre of the book</FormLabel>
                    <Select
                      size="sm"
                      value={genre ?? ""} // Changed from category to genre
                      onChange={(e, value) => handleGenreChange(value)}
                      required
                    >
                      <Option value="" disabled>
                        Select a Genre
                      </Option>
                      {interestList.map((interest) => (
                        <Option key={interest} value={interest}>
                          {interest}
                        </Option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl sx={{ flexGrow: 1 }}>
                    <FormLabel>Location</FormLabel>
                    <Input
                      size="sm"
                      placeholder="Specify city or pincode details"
                      value={location}
                      onChange={handleLocationChange}
                      fullWidth
                      required
                    />
                  </FormControl>

                  <FormControl sx={{ flexGrow: 1 }}>
                    <FormLabel>Rating</FormLabel>
                    <Select
                      size="sm"
                      value={rating ?? ""}
                      onChange={(e, newValue) => handleRatingChange(newValue as number | null)}
                    >
                      <Option value="">Select rating</Option>
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Option key={value} value={value}>
                          {value}
                        </Option>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Box>

              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingLeft: { xs: 0, md: 2 },
                  paddingRight: { xs: 0, md: 2 },
                  height: "auto",
                  mt: { xs: 2, md: 0 },
                  width: "100%",
                }}
              >
                <FormControl sx={{ width: "100%", maxWidth: "300px" }}>
                  <FormLabel>Book Cover Image</FormLabel>
                  <Stack spacing={2} sx={{ alignItems: "center" }}>
                    <AspectRatio
                      ratio="3/4"
                      sx={{
                        width: "100%",
                        height: "400px",
                        border: "2px dashed",
                        borderColor: "neutral.300",
                        borderRadius: "8px",
                        overflow: "hidden",
                        bgcolor: image === "/blank.svg" ? "neutral.100" : "transparent",
                      }}
                    >
                      <img
                        src={image}
                        alt=""
                        style={{
                          width: "100%",
                          height: "140%",
                          objectFit: "cover",
                          borderRadius: "6px",
                        }}
                        onError={(e) => {
                          e.currentTarget.src = "/blank.svg"; // Fallback to placeholder
                        }}
                      />
                    </AspectRatio>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                      id="book-image-upload"
                    />
                    <Button
                      component="label"
                      htmlFor="book-image-upload"
                      variant="solid"
                      color="primary"
                      size="md"
                      sx={{ width: "100%", borderRadius: "8px" }}
                    >
                      Upload Image
                    </Button>
                    {image !== "/blank.svg" && (
                      <Typography level="body-sm" sx={{ color: "text.secondary", textAlign: "center" }}>
                        Click "Upload Image" to change
                      </Typography>
                    )}
                  </Stack>
                </FormControl>
              </Box>
            </Box>

            <CardActions sx={{ p: 2, justifyContent: "center" }}>
              <Button type="submit" size="lg">
                List this Book for Exchange
              </Button>
            </CardActions>
          </Card>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}