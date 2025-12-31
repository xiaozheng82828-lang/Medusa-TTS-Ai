import "./globals.css";

export const metadata = {
  title: "AI Voice Studio",
  description: "Text to Speech Generator",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
