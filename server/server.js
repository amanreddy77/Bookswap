const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const path = require("path");

const app = express();

// Parse JSON and URL-encoded bodies first
app.use(express.json({ limit: "10mb" })); // Increased limit to 10MB
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// CORS middleware
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Include OPTIONS for CORS pre-flight
  credentials: true,
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};
app.use(cors(corsOptions));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Logging middleware to debug all requests
app.use((req, res, next) => {
  console.log("Incoming Request:", {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body || "No body parsed", // Log even if body is undefined
    rawBody: req.rawBody || "No raw body", // Optional: Capture raw body if needed
  });
  next();
});
app.get("/api/users", (req, res) => {
  const { email, username } = req.query;
  let safeUsers = users.map(({ password, ...user }) => user); // Exclude password
  if (email) {
    safeUsers = safeUsers.filter((u) => u.email === email);
  } else if (username) {
    safeUsers = safeUsers.filter((u) => u.username === username);
  }
  res.json(safeUsers);
});
// Configure multer for file uploads on /api/books only
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

let users = [];
let books = [];

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validateMobile = (mobile) => /^\d{10}$/.test(mobile);

// Middleware to authenticate user
const authenticateUser = (req, res, next) => {
  console.log("Authenticating:", { body: req.body }); // Debug log
  const email = req.body?.email;
  if (!email) {
    return res.status(400).json({ error: "Email is required in the request body" });
  }
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(401).json({ error: "Unauthorized: User not found" });
  req.user = user;
  next();
};

// User Routes
app.post("/api/register", (req, res) => {
  console.log("Register Request Body:", req.body); // Debug log
  const { name, mobile, email, password, role, firstName, lastName, username } = req.body || {};
  if (!name || !mobile || !email || !password || !["owner", "seeker"].includes(role)) {
    return res.status(400).json({ error: "Invalid input: All fields and valid role required" });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  if (!validateMobile(mobile)) {
    return res.status(400).json({ error: "Invalid mobile number (10 digits required)" });
  }
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ error: "Email already exists" });
  }
  const user = { id: uuidv4(), name, mobile, email, password, role, firstName, lastName, username };
  users.push(user);
  console.log(`Registered user: ${email}`);
  res.status(201).json({
    message: "User registered",
    user: { id: user.id, name, email, role, firstName, lastName, username },
  });
});

app.post("/api/login", (req, res) => {
  console.log("Login Request Body:", req.body); // Debug log
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  console.log(`Logged in: ${email}`);
  res.json({
    message: "Login successful",
    user: { id: user.id, name: user.name, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName, username: user.username },
  });
});

app.get("/api/users", (req, res) => {
  const { email } = req.query;
  let safeUsers = users.map(({ password, ...user }) => user);
  if (email) {
    safeUsers = safeUsers.filter((u) => u.email === email);
  }
  res.json(safeUsers);
});

app.put("/api/users", authenticateUser, (req, res) => {
  const { email, name, mobile, firstName, lastName, username } = req.body || {};
  const userIndex = users.findIndex((u) => u.email === email);
  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }
  const user = users[userIndex];
  if (name) user.name = name;
  if (mobile && validateMobile(mobile)) user.mobile = mobile;
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (username) user.username = username;
  console.log(`Updated user: ${email}`);
  res.json({ message: "User updated", user: { id: user.id, name, email, role: user.role, firstName, lastName, username } });
});

app.get("/api/users/check-email", (req, res) => {
  const { email } = req.query;
  if (!email || !validateEmail(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }
  const exists = users.some((u) => u.email === email);
  res.json({ exists });
});

app.get("/api/users/check-name", (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: "Invalid name" });
  }
  const exists = users.some((u) => u.name === name);
  res.json({ exists });
});

// Book Routes
app.post("/api/books", upload.single("image"), (req, res) => {
  const { title, author, category, city, location, rating, ownerUsername } = req.body || {};
  if (!title || !author || !city || !ownerUsername) {
    return res.status(400).json({ error: "Missing required fields: title, author, city, ownerUsername" });
  }
  const user = users.find((u) => u.email === ownerUsername && u.role === "owner");
  if (!user) {
    return res.status(403).json({ error: "Only owners can list books" });
  }
  const imagePath = req.file ? `/uploads/${req.file.filename}` : "";
  const book = {
    id: uuidv4(),
    title,
    author,
    genre: category || "",
    city,
    location: location || city,
    rating: rating ? parseFloat(rating) : 0,
    image: imagePath,
    ownerId: user.id,
    ownerUsername,
    status: "available",
    email: ownerUsername,
    phone: user.mobile || "",
  };
  books.push(book);
  res.status(201).json({ message: "Book added", book });
});

app.get("/api/books", (req, res) => {
  const { title, city, genre } = req.query;
  let filteredBooks = books;
  if (title) {
    filteredBooks = filteredBooks.filter((b) => b.title.toLowerCase().includes(title.toLowerCase()));
  }
  if (city) {
    filteredBooks = filteredBooks.filter((b) => b.city.toLowerCase().includes(city.toLowerCase()));
  }
  if (genre) {
    filteredBooks = filteredBooks.filter((b) => b.genre.toLowerCase().includes(genre.toLowerCase()));
  }
  res.json(filteredBooks);
});

app.put("/api/books/:id", (req, res) => {
  const { id } = req.params;
  const { status, title, author, genre, city, email, phone } = req.body || {};
  const book = books.find((b) => b.id === id);
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  if (status) book.status = status;
  if (title) book.title = title;
  if (author) book.author = author;
  if (genre) book.genre = genre;
  if (city) book.city = city;
  if (email) book.email = email;
  if (phone) book.phone = phone;
  res.json({ message: "Book updated", book });
});

app.delete("/api/books/:id", (req, res) => {
  const { id } = req.params;
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Book not found" });
  }
  books.splice(index, 1);
  res.json({ message: "Book deleted" });
});

// Ensure uploads directory exists
const fs = require("fs");
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));