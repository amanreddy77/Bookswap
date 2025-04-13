'use client';

import React from "react";
import { useAuthContext } from "@/context/AuthContext";
import Divider from "@mui/joy/Divider";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { CssVarsProvider, useColorScheme } from "@mui/joy";
import LightDarkMode from "./LightDarkMode";
import { usePathname } from "next/navigation";

function NavigationBar() {
  const { user, logout } = useAuthContext();
  const pathname = usePathname();
  const { mode } = useColorScheme(); // Access the color scheme mode (light/dark)

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Show "List Books" and "My Listed Books" only for owners
  const showSeekerRestrictedItems = user?.role !== "seeker";

  // Determine the home route based on user role
  const homeRoute = user?.role === "seeker" ? "/homeseeker" : "/home";

  return (
    <CssVarsProvider>
      <Sheet
        className="Sidebar"
        sx={{
          position: { xs: "fixed", md: "sticky" },
          transform: {
            xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
            md: "none",
          },
          transition: "transform 0.4s, width 0.4s",
          zIndex: 10000,
          height: "100dvh",
          width: "240px",
          top: 0,
          p: 2.5,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          borderRight: "1px solid",
          borderColor: "divider",
          background: mode === "dark"
            ? (theme) => `linear-gradient(135deg, ${theme.vars.palette.primary[700]}, ${theme.vars.palette.neutral[700]})`
            : (theme) => `linear-gradient(135deg, ${theme.vars.palette.primary[50]}, ${theme.vars.palette.neutral[100]})`,
          boxShadow: mode === "dark" ? "2px 0 10px rgba(0, 0, 0, 0.3)" : "2px 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <List variant="plain">
          <ListItem sx={{ mb: 3 }}>
            <Typography
              sx={{
                fontWeight: 700,
                color: mode === "dark" ? "primary.100" : "primary.800", // Adjust text color based on mode
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Book Swap
            </Typography>
            <LightDarkMode />
          </ListItem>

          <Divider sx={{ borderColor: "neutral.300" }} />

          <Box
            sx={{
              minHeight: 0,
              overflow: "hidden auto",
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "neutral.300",
                borderRadius: "3px",
              },
            }}
          >
            <List
              size="sm"
              sx={{
                gap: 1.5,
                "& .MuiListItemButton-root": {
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: mode === "dark" ? "primary.300" : "primary.100",
                  },
                },
              }}
            >
              <ListItem>
                <ListItemButton
                  variant="soft"
                  color="neutral"
                  component="a"
                  href={homeRoute}
                  sx={{ borderRadius: "8px", transition: "background-color 0.3s ease" }}
                >
                  <HomeRoundedIcon sx={{ color: "primary.600" }} />
                  <ListItemContent>
                    <Typography level="title-sm" sx={{ fontWeight: 500, color: "text.primary" }}>
                      Home
                    </Typography>
                  </ListItemContent>
                </ListItemButton>
              </ListItem>

              {showSeekerRestrictedItems && (
                <>
                  <ListItem>
                    <ListItemButton
                      variant="soft"
                      color="neutral"
                      component="a"
                      href="/list-books"
                      sx={{ borderRadius: "8px", transition: "background-color 0.3s ease" }}
                    >
                      <LibraryAddIcon sx={{ color: "primary.600" }} />
                      <ListItemContent>
                        <Typography level="title-sm" sx={{ fontWeight: 500, color: "text.primary" }}>
                          List Books
                        </Typography>
                      </ListItemContent>
                    </ListItemButton>
                  </ListItem>

                  <ListItem>
                    <ListItemButton
                      variant="soft"
                      color="neutral"
                      component="a"
                      href="/my-books"
                      sx={{ borderRadius: "8px", transition: "background-color 0.3s ease" }}
                    >
                      <CollectionsBookmarkIcon sx={{ color: "primary.600" }} />
                      <ListItemContent>
                        <Typography level="title-sm" sx={{ fontWeight: 500, color: "text.primary" }}>
                          My Listed Books
                        </Typography>
                      </ListItemContent>
                    </ListItemButton>
                  </ListItem>
                </>
              )}

              <Divider sx={{ borderColor: "neutral.300", my: 1.5 }} />

              <ListItem>
                <ListItemButton
                  variant="soft"
                  color="neutral"
                  component="a"
                  href="/settings"
                  sx={{ borderRadius: "8px", transition: "background-color 0.3s ease" }}
                >
                  <SettingsRoundedIcon sx={{ color: "primary.600" }} />
                  <ListItemContent>
                    <Typography level="title-sm" sx={{ fontWeight: 500, color: "text.primary" }}>
                      Settings
                    </Typography>
                  </ListItemContent>
                </ListItemButton>
              </ListItem>
            </List>
          </Box>

          <Divider sx={{ borderColor: "neutral.300" }} />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2, // Increased gap for better spacing
              p: 1.5, // Added padding for a balanced look
              borderRadius: "8px",
              backgroundColor: mode === "dark" ? "neutral.800" : "neutral.50", // Adjust background color
              boxShadow: mode === "dark" ? "0 2px 4px rgba(0, 0, 0, 0.3)" : "0 2px 4px rgba(0, 0, 0, 0.05)", // Adjust box shadow
            }}
          >
            {user && (
              <>
                <Avatar
                  variant="soft"
                  size="sm"
                  sx={{
                    border: "2px solid",
                    borderColor: "primary.200",
                    width: 40,
                    height: 40,
                  }}
                />
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    level="title-sm"
                    sx={{ fontWeight: 600, color: "text.primary", lineHeight: 1.2 }}
                  >
                    {user.name}
                  </Typography>
                </Box>
                <IconButton
                  size="sm"
                  variant="soft"
                  color="neutral"
                  onClick={handleLogout}
                  sx={{
                    "&:hover": {
                      backgroundColor: "danger.100",
                      color: "danger.600",
                    },
                  }}
                >
                  <LogoutRoundedIcon />
                </IconButton>
              </>
            )}
          </Box>
        </List>
      </Sheet>
    </CssVarsProvider>
  );
}

export default NavigationBar;
