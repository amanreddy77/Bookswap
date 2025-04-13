'use client'
import Image from "next/image";
import * as React from 'react';
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import { CssVarsProvider } from '@mui/joy/styles';
import theme from "@/theme";
import Box from '@mui/joy/Box';
import Grid from '@mui/joy/Grid';
import { CssBaseline } from "@mui/joy";

export default function LandingPage() {
    return (
        <CssVarsProvider theme={theme}>
            <CssBaseline />
            <Box
                className="flex flex-col items-center justify-center min-h-screen"
                sx={{
                    background: 'linear-gradient(135deg, #e0f7fa, #ffffff)',
                    paddingX: { xs: 3, sm: 6 },
                    paddingY: { xs: 6, sm: 10 },
                    textAlign: 'center',
                }}
            >
                {/* Logo Image */}
                <Box
                    sx={{
                        boxShadow: 'lg',
                        borderRadius: 'xl',
                        overflow: 'hidden',
                        mb: { xs: 4, sm: 6 },
                        width: '100%',
                        maxWidth: 480,
                    }}
                >
                    <Image
                        src="/ibooks-app.png"
                        alt="Logo"
                        width={480}
                        height={320}
                        style={{
                            width: '100%',
                            height: 'auto',
                        }}
                        priority
                    />
                </Box>

                {/* Title */}
                <Typography
                    level="h2"
                    sx={{
                        fontWeight: 'bold',
                        color: '#0077b6',
                        fontSize: { xs: '1.75rem', sm: '2.25rem' },
                    }}
                >
                    Let&apos;s circulate books!
                </Typography>

                {/* Subtitle */}
                <Typography
                    level="title-md"
                    sx={{
                        mt: 1,
                        color: '#555',
                        fontSize: { xs: '1rem', sm: '1.2rem' },
                    }}
                >
                    A Peer-to-Peer Book Exchange Platform for anyone and everyone.
                </Typography>

                {/* Buttons */}
                <Grid
                    container
                    spacing={2}
                    sx={{
                        mt: { xs: 4, sm: 6 },
                        width: { xs: '100%', sm: '70%', md: '40%' },
                    }}
                >
                    <Grid xs={12} sm={6}>
                        <Button
                            variant="solid"
                            color="primary"
                            component="a"
                            href="/signin"
                            sx={{
                                width: '100%',
                                bgcolor: '#00bcd4',
                                '&:hover': {
                                    bgcolor: '#0097a7',
                                },
                            }}
                        >
                            Login
                        </Button>
                    </Grid>
                    <Grid xs={12} sm={6}>
                        <Button
                            variant="solid"
                            color="primary"
                            component="a"
                            href="/signup"
                            sx={{
                                width: '100%',
                                bgcolor: '#0288d1',
                                '&:hover': {
                                    bgcolor: '#0277bd',
                                },
                            }}
                        >
                            Sign Up
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </CssVarsProvider>
    );
}
