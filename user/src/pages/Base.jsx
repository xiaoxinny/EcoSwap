import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Layout() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "space-between",
      }}
    >
      <Navbar />
      <div style={{ flexGrow: 1 }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
