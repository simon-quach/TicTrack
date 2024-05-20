import Navbar from "@/components/Navbar";

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className={`bg-[#f5f5f5]`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
