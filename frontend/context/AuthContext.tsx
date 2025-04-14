"use client";

import { createContext, useContext, useEffect, useState, ReactNode, JSX } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { Skeleton, Box, Typography } from "@mui/joy";

export interface User {
  id?: string;
  name: string;
  mobile: string;
  email: string;
  password: string; // Ensure password is present if used in refreshUser
  role: "owner" | "seeker";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

interface AuthContextProviderProps {
  children: ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProviderProps): JSX.Element {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user"); // Clean up invalid data
      }
    }
    setLoading(false);
  }, []); // Empty dependency array is fine here since this is a one-time load

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:4000/api/login", { email, password });
      const loggedInUser = res.data.user as User; // Type assertion with interface

      if (!loggedInUser || !loggedInUser.role) {
        throw new Error("Invalid user data received from server");
      }

      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser));

      const redirectPath = loggedInUser.role === "owner" ? "/home" : "/homeseeker";
      router.push(redirectPath);
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        alert(err.response?.data?.error || "Login failed");
      } else {
        alert("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.push("/");
  };

  const refreshUser = async () => {
    if (!user) {
      console.warn("No user logged in to refresh");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:4000/api/login", {
        email: user.email,
        password: user.password,
      });
      const refreshedUser = res.data.user as User;

      if (!refreshedUser || !refreshedUser.role) {
        throw new Error("Invalid refreshed user data");
      }

      setUser(refreshedUser);
      localStorage.setItem("user", JSON.stringify(refreshedUser));
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        console.error("Refresh failed:", err.message);
      } else {
        console.error("Unexpected error during refresh:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser }}>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            position: "relative",
          }}
        >
          <Skeleton
            sx={{ width: "100%", height: "100vh", position: "absolute", top: 0, left: 0, zIndex: 1 }}
          />
          <Box sx={{ zIndex: 2, textAlign: "center" }}>
            <Typography level="title-md" sx={{ marginTop: 2 }}>
              Loading...
            </Typography>
          </Box>
        </Box>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}