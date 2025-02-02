// import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import './globals.css';

// const font = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <body className={font.className}>{children}</body> */}
      {/* Had to add this style to body because of GSAP problem with Next.js 15, should be solved in next GSAP version */}
      <body style={{ borderTopStyle: 'solid' }}>{children}</body>
    </html>
  );
}
