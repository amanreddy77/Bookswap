'use client';

import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { JSX, useEffect } from "react";
import Header from "@/components/Header";
import NavigationBar from "@/components/sidebar/NavigationBar";
import Box from '@mui/joy/Box';
import AddBook from "@/components/books/AddBook";

function Page(): JSX.Element {
    const { user } = useAuthContext() as { user: any };
    const router = useRouter();

    useEffect(() => {
        if (user == null) {
            router.push("/");
        }
    }, [user, router]);

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
            {/* Header */}
            <Header />

            {/* Main content wrapper */}
            <Box sx={{ display: 'flex', flex: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                {/* Sidebar */}
                <Box
                    component="nav"
                    sx={{
                        width: { sm: 240 },
                        flexShrink: { sm: 0 },
                        display: { xs: 'none', sm: 'block' }, // hide on mobile
                    }}
                >
                    <NavigationBar />
                </Box>

                {/* Main content */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: { xs: 2, sm: 3 },
                        width: '100%',
                        bgcolor: 'background.surface',
                        minHeight: 'calc(100vh - 64px)', // adjust if Header height changes
                    }}
                >
                    <AddBook />
                </Box>
            </Box>
        </Box> 
    );
}
 
export default Page;
