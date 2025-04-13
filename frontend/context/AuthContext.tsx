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
  password: string;
  role: "owner" | "seeker";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);

    // Optional: Fetch user data on mount if needed
    axios
      .get("http://localhost:4000/api/users")
      .catch((err: unknown) => {
        if (isAxiosError(err)) {
          console.error("Failed to fetch users:", err.message);
        } else {
          console.error("Unexpected error:", err);
        }
      });
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true); // Show loading state during login
      const res = await axios.post("http://localhost:4000/api/login", { email, password });
      const loggedInUser = res.data.user;

      if (!loggedInUser || !loggedInUser.role) {
        throw new Error("Invalid user data received from server");
      }

      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser));

      // Redirect based on role
      const redirectPath = loggedInUser.role === "owner" ? "/home" : "/homeseeker";
      router.push(redirectPath);
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        alert(err.response?.data?.error || "Login failed");
      } else {
        alert("An unexpected error occurred");
      }
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.push("/");
  };

  const refreshUser = async () => {
    if (user) {
      try {
        setLoading(true);
        const res = await axios.post("http://localhost:4000/api/login", {
          email: user.email,
          password: user.password,
        });
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } catch (err: unknown) {
        if (isAxiosError(err)) {
          console.error("Refresh failed:", err.message);
        }
      } finally {
        setLoading(false);
      }
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