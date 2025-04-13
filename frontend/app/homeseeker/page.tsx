// app/homeseeker/page.tsx
"use client";

import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { JSX, useEffect } from "react";
import DashboardSeeker from "@/components/DashboardSeeker";
import { User } from "@/context/AuthContext"; // Import the User type

function Page(): JSX.Element {
  const { user } = useAuthContext() as { user: User | null }; // Use the defined User type
  const router = useRouter();

  useEffect(() => {
    // Redirect to the home page if the user is not logged in or not a seeker
    if (!user || user.role !== "seeker") {
      router.push("/");
    }
  }, [user, router]); // Dependency array includes user and router

  return <DashboardSeeker />;
}

export default Page;