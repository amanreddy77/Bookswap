import axios, { AxiosError } from "axios";
import { User } from "@/types/user";

// Base URL for the backend API (matches server/index.js port)
const API_URL = "http://localhost:4000/api";

export function createUser(
  email: string,
  name: string,
  mobile: string,
  password: string,
  role: "owner" | "seeker",
  firstName: string,
  lastName: string,
  username: string
): User {
  return {
    email,
    firstName,
    lastName,
    username,
    name,
    mobile,
    password,
    role,
  };
}

// Function to add a new user
export async function addNewUser(user: User): Promise<void> {
  try {
    const response = await axios.post(`${API_URL}/register`, user);
    console.log("User registered:", response.data.message);
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("Error adding user:", axiosError.message);
    throw new Error(axiosError.response?.data?.error || "Failed to register user");
  }
}

// Function to retrieve a user by email
export async function retrieveUser(email: string): Promise<User> {
  try {
    const response = await axios.get(`${API_URL}/users?email=${encodeURIComponent(email)}`);
    const users = response.data as User[];
    const user = users.find((u) => u.email === email);
    if (!user) throw new Error("User not found");
    return user;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("Error retrieving user:", axiosError.message);
    throw new Error(axiosError.message || "Failed to retrieve user");
  }
}

// Function to retrieve a user by username (added to support params.user)
export async function retrieveUserFromUsername(username: string): Promise<User> {
  try {
    const response = await axios.get(`${API_URL}/users?username=${encodeURIComponent(username)}`);
    const users = response.data as User[];
    const user = users.find((u) => u.username === username);
    if (!user) throw new Error("User not found");
    return user;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("Error retrieving user by username:", axiosError.message);
    throw new Error(axiosError.message || "Failed to retrieve user by username");
  }
}

// Function to refresh user data (re-retrieve user)
export async function refreshUser(email: string): Promise<User> {
  try {
    const user = await retrieveUser(email);
    return user;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("Error refreshing user:", axiosError.message);
    throw new Error(axiosError.message || "Failed to refresh user");
  }
}

// Function to update user data
export async function updateUserData(user: User): Promise<void> {
  try {
    const response = await axios.put(`${API_URL}/users`, user, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("User updated:", response.data.message);
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("Error updating user:", axiosError.message);
    throw new Error(axiosError.response?.data?.error || "Failed to update user");
  }
}

// Function to retrieve all users
export async function getAllUsers(): Promise<User[]> {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data as User[];
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("Error retrieving all users:", axiosError.message);
    throw new Error(axiosError.message || "Failed to retrieve users");
  }
}

// Function to check if email exists
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const response = await axios.get(`${API_URL}/users/check-email?email=${encodeURIComponent(email)}`);
    return response.data.exists as boolean;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("Error checking email existence:", axiosError.message);
    throw new Error(axiosError.message || "Failed to check email existence");
  }
}

// Function to check if username exists
export async function checkNameExists(name: string): Promise<boolean> {
  try {
    const response = await axios.get(`${API_URL}/users/check-name?name=${encodeURIComponent(name)}`);
    return response.data.exists as boolean;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("Error checking name existence:", axiosError.message);
    throw new Error(axiosError.message || "Failed to check name existence");
  }
}