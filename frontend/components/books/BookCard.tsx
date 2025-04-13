import * as React from "react";
import { useEffect, useState } from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import IconButton from "@mui/joy/IconButton";
import Link from "next/link";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import Star from "@mui/icons-material/Star";
import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";
import { Book } from "@/types/book";
import Box from "@mui/joy/Box";
import { retrieveUser } from "@/services/UserService";
import { updateBook } from "@/services/BookService";
import { User } from "@/types/user";
import { useAuthContext } from "@/context/AuthContext";
import Tooltip from "@mui/joy/Tooltip";
import { CssVarsProvider } from "@mui/joy/styles";
import theme from "@/theme";
import { CssBaseline, Skeleton, TextField } from "@mui/joy";
import MarkAsExchanged from "@/features/books/MarkAsExchanged";
import EditIcon from "@mui/icons-material/Edit";
// import SaveIcon from "@mui/icons-material/Save";
// import CancelIcon from "@mui/icons-material/Cancel";

type BookCardProps = Book & {
  liked?: boolean;
  email: string;
  onLike?: (book: Book) => void;
  onEdit?: (updatedBook: Book) => void; // Callback to notify parent of edit
};

export default function BookCard(props: BookCardProps) {
  const {
    bookId,
    genre,
    title,
    author,
    liked = false,
    image,
    location,
    rating = 0,
    email,
    onLike,
    onEdit,
  } = props;

  const { user } = useAuthContext() as { user: User | null };
  const [isLiked, setIsLiked] = useState(liked);
  const [owner, setOwner] = useState<User | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBook, setEditedBook] = useState<Book>(props);

  const handleLikeClick = () => {
    setIsLiked((prev) => !prev);
    if (onLike) {
      onLike;
    }
  };

  const handleEditClick = () => {
    if (user?.email === email) {
      setIsEditing(true);
    }
  };

  const handleSaveClick = async () => {
    if (user?.email === email && onEdit) {
      try {
        const updatedData: Partial<Book> = {
          title: editedBook.title,
          author: editedBook.author,
          genre: editedBook.genre,
          location: editedBook.location,
        };
        await updateBook(bookId, updatedData);
        onEdit({ ...editedBook, ...updatedData });
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating book:", error);
      }
    }
  };

  const handleCancelClick = () => {
    setEditedBook(props);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedBook((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchOwner = async () => {
      if (email) {
        console.log("Fetching owner with email:", email);
        try {
          const fetchedUser = await retrieveUser(email);
          console.log("Fetched owner data:", fetchedUser);
          setOwner(fetchedUser);
        } catch (error) {
          console.error("Error fetching owner:", error);
          setOwner(null);
        }
      } else {
        console.log("ownerEmail is undefined or empty");
      }
    };
    fetchOwner();
  }, [email]);

  const placeholderImage = "/placeholder-book.jpg";

  // if (isEditing && user?.email === email) {
  //   return (
  //     <CssVarsProvider theme={theme}>
  //       <CssBaseline />
  //       <Card
  //         variant="outlined"
  //         sx={{
  //           width: "100%",
  //           maxWidth: { sm: "360px" },
  //           display: "flex",
  //           flexDirection: "column",
  //           overflow: "hidden",
  //           bgcolor: "background.surface",
  //           borderColor: "neutral.200",
  //           p: { xs: 1.5, sm: 2 },
  //         }}
  //       >
  //         <CardContent sx={{ p: { xs: 1.5, sm: 2 }, flexGrow: 1 }}>
  //           <Stack spacing={2}>
  //             <TextField
  //               name="title"
  //               value={editedBook.title || ""}
  //               onChange={handleInputChange}
  //               label="Title"
  //               variant="outlined"
  //               required
  //               sx={{ mb: 1 }}
  //             />
  //             <TextField
  //               name="author"
  //               value={editedBook.author || ""}
  //               onChange={handleInputChange}
  //               label="Author"
  //               variant="outlined"
  //               required
  //               sx={{ mb: 1 }}
  //             />
  //             <TextField
  //               name="genre"
  //               value={editedBook.genre || ""}
  //               onChange={handleInputChange}
  //               label="Genre"
  //               variant="outlined"
  //               required
  //               sx={{ mb: 1 }}
  //             />
  //             <TextField
  //               name="location"
  //               value={editedBook.location || ""}
  //               onChange={handleInputChange}
  //               label="Location"
  //               variant="outlined"
  //               required
  //               sx={{ mb: 1 }}
  //             />
  //             <Box sx={{ display: "flex", gap: 1 }}>
  //               <Button
  //                 variant="solid"
  //                 color="primary"
  //                 startIcon={<SaveIcon />}
  //                 onClick={handleSaveClick}
  //                 sx={{ flexGrow: 1 }}
  //                 disabled={!editedBook.title || !editedBook.author || !editedBook.genre || !editedBook.location}
  //               >
  //                 Save
  //               </Button>
  //               <Button
  //                 variant="outlined"
  //                 color="neutral"
  //                 startIcon={<CancelIcon />}
  //                 onClick={handleCancelClick}
  //                 sx={{ flexGrow: 1 }}
  //               >
  //                 Cancel
  //               </Button>
  //             </Box>
  //           </Stack>
  //         </CardContent>
  //       </Card>
  //     </CssVarsProvider>
  //   );
  // }

  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <Card
        variant="outlined"
        sx={{
          width: "100%",
          maxWidth: { sm: "360px" },
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          bgcolor: "background.surface",
          borderColor: "neutral.200",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 6px 16px rgba(0, 0, 0, 0.12)",
          },
          p: { xs: 1.5, sm: 2 },
        }}
      >
        {/* Image Section */}
        <AspectRatio
          ratio="3/3"
          sx={{
            width: "100%",
            minHeight: { xs: "160px", sm: "200px" },
            bgcolor: "neutral.100",
          }}
        >
          {imageLoading && (
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              sx={{ position: "absolute", top: 0, left: 0 }}
            />
          )}
          <img
            alt={title}
            src={image ? `http://localhost:4000${image}` : placeholderImage}
            style={{
              objectFit: "cover",
              display: imageLoading ? "none" : "block",
            }}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              console.error("Image load failed:", image);
              setImageLoading(false);
            }}
          />
          <IconButton
            variant="soft"
            size="sm"
            color={isLiked ? "danger" : "neutral"}
            onClick={handleLikeClick}
            sx={{
              position: "absolute",
              top: { xs: 6, sm: 8 },
              right: { xs: 6, sm: 8 },
              bgcolor: "background.surface",
              borderRadius: "50%",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                bgcolor: "neutral.100",
              },
            }}
          >
            <FavoriteRoundedIcon fontSize="small" />
          {/* </IconButton>
          {user?.email === email && (
            <IconButton
              variant="soft"
              size="sm"
              color="primary"
              onClick={handleEditClick}
              sx={{
                position: "absolute",
                top: { xs: 6, sm: 8 },
                right: { xs: 20, sm: 28 },
                bgcolor: "background.surface",
                borderRadius: "50%",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  bgcolor: "neutral.100",
                },
              }}
            >
              <EditIcon fontSize="small" />*/}
            </IconButton> 
          
        </AspectRatio>

        {/* Content Section */}
        <CardContent
          sx={{
            p: { xs: 1.5, sm: 2 },
            flexGrow: 1,
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Stack spacing={1} sx={{ flexGrow: 1 }}>
            {/* Genre Chip */}
            <Chip
              variant="soft"
              color="primary"
              size="sm"
              sx={{
                alignSelf: "flex-start",
                borderRadius: "4px",
                fontWeight: "medium",
              }}
            >
              {genre || "General"}
            </Chip>

            {/* Title */}
            <Typography
              level="title-lg"
              sx={{
                fontSize: { xs: "1.1rem", sm: "1.25rem" },
                fontWeight: "bold",
                color: "text.primary",
                lineHeight: 1.2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {title || "Untitled"}
            </Typography>

            {/* Author */}
            <Typography
              level="body-md"
              sx={{
                fontSize: { xs: "0.9rem", sm: "1rem" },
                color: "text.secondary",
                fontWeight: "medium",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              by {author || "Unknown Author"}
            </Typography>

            {/* Rating */}
            <Stack direction="row" spacing={0.5}>
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  fontSize="small"
                  sx={{
                    color: index < Math.floor(rating) ? "warning.400" : "neutral.300",
                  }}
                />
              ))}
              <Typography
                level="body-xs"
                sx={{ ml: 1, color: "text.secondary", alignSelf: "center" }}
              >
                ({rating.toFixed(1)})
              </Typography>
            </Stack>

            {/* Owner and Location */}
            <Box
              sx={{
                mt: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
              }}
            >
              <Box
                component={Link}
                href={''}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
                  Listed by
                </Typography>
                <Typography
                  level="body-sm"
                  sx={{
                    fontWeight: "medium",
                    color: "primary.600",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {owner?.name || (email ? email : "Unknown User")}
                </Typography>
              </Box>
              <Typography
                level="body-xs"
                sx={{
                  color: "text.secondary",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {location || "No location"}
              </Typography>
            </Box>
          </Stack>
        </CardContent>

        {/* Actions */}
        <Box
          sx={{
            p: { xs: 1.5, sm: 2 },
            pt: 0,
            display: "flex",
            gap: 1,
            borderTop: "1px solid",
            borderColor: "neutral.200",
            bgcolor: "neutral.50",
          }}
        >
          {owner && user && owner.email !== user.email ? (
            <Tooltip title={`Chat with ${owner?.name || email}`} arrow>
              <Button
                component={Link}
                href=""
                variant="solid"
                color="primary"
                size="sm"
                sx={{
                  flexGrow: 1,
                  borderRadius: "6px",
                  transition: "background-color 0.2s ease",
                }}
              >
                Exchange
              </Button>
            </Tooltip>
          ) : (
            <MarkAsExchanged />
          )}
        </Box>
      </Card>
    </CssVarsProvider>
  );
}