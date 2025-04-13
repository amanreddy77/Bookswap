import { AuthContextProvider } from '@/context/AuthContext';
import { Inter } from 'next/font/google';
import './globals.css';
import React, { JSX } from 'react';
import Header from '@/components/Header';
import theme from '@/theme';
import { CssVarsProvider } from '@mui/joy/styles';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Book Swap',
  description: 'A book exchange platform for everyone',
};

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="en" className={inter.className}>
      <head />
      <body>
        <CssVarsProvider theme={theme}>
          <Header />
          <AuthContextProvider>
            {children}
          </AuthContextProvider>
        </CssVarsProvider>
      </body>
    </html>
  );
}