// layouts/RootLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import { ThemeProvider, useTheme } from "../context/Theme.context";

function RootLayoutInner() {
  const { darkMode } = useTheme();
  return (
    <div className={darkMode ? "bg-gray-900 min-h-screen flex-col max-w-screen overflow-x-hidden" : "bg-gray-100 min-h-screen flex-col max-w-screen overflow-x-hidden"}>
      <Navbar />
      <Outlet />
    </div>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutInner />
    </ThemeProvider>
  );
}
