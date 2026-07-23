import { useState } from "react";
// import { BrowserRouter, useLocation } from "react-router-dom";
import { HashRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import AppRouter from "./router";
import "./styles/global.css";

const AUTH_PATHS = ["/login", "/register"];

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isAuthPage = AUTH_PATHS.includes(location.pathname);

  if (isAuthPage) {
    return <AppRouter />;
  }

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} />
      <div className="main-content">
        <Navbar onToggleSidebar={() => setSidebarOpen((o) => !o)} />
        <main className="page-content">
          <AppRouter />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    // <BrowserRouter>
    //   <AuthProvider>
    //     <Layout />
    //   </AuthProvider>
    // </BrowserRouter>
    <HashRouter>
  <AuthProvider>
    <Layout />
  </AuthProvider>
</HashRouter>
  );
}
