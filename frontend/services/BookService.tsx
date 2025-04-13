import axios, { AxiosError } from "axios";
import { Book } from "@/types/book";

// Base URL for the backend API
const API_URL = "http://localhost:4000/api";

export function generateBookId(): string {
  return `book-${Math.random().toString(36).substr(2, 9)}`;
}

export async function addNewBook(formData: FormData): Promise<Book> {
  try {
    const response = await axios.post(`${API_URL}/books`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!response.data.book) {
      throw new Error("Unexpected response format: book data missing");
    }

    return response.data.book;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error || error.message || "Failed to add book";
    console.error("Error adding book:", {
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(errorMessage);
  }
}

export async function updateBook(bookId: string, updatedData: Partial<Book>): Promise<void> {
  try {
    await axios.put(`${API_URL}/books/${bookId}`, updatedData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error("Error updating book:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "Failed to update book");
  }
}

export async function updateListedBookRecords(userEmail: string, bookId: string): Promise<void> {
  try {
    console.log(`Simulated updating listed book ${bookId} for user ${userEmail}`);
  } catch (error: any) {
    console.error("Error updating book listing records:", error.message || error);
    throw new Error("Failed to update book listing records");
  }
}

export async function getAllBooks(): Promise<Book[]> {
  try {
    const response = await axios.get(`${API_URL}/books`);
    return response.data;
  } catch (error: any) {
    console.error("Error retrieving all books:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "Failed to retrieve books");
  }
}

export async function getListedBooks(userEmail: string): Promise<Book[]> {
  try {
    const allBooks = await getAllBooks();
    return allBooks.filter((book) => book.ownerUsername === userEmail) || [];
  } catch (error: any) {
    console.error("Error retrieving listed books:", error.message || error);
    throw new Error(error.response?.data?.error || "Failed to retrieve listed books");
  }
}

export async function retrieveBookById(bookId: string): Promise<Book> {
  try {
    const allBooks = await getAllBooks();
    const book = allBooks.find((b) => b.id === bookId || b.bookId === bookId);
    if (!book) {
      throw new Error(`Book with ID ${bookId} not found`);
    }
    return book;
  } catch (error: any) {
    console.error("Error retrieving book by ID:", error.message || error);
    throw new Error(error.response?.data?.error || "Failed to retrieve book");
  }
}