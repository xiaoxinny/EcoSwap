import React from "react";
import { Outlet, Link } from "react-router-dom";
import '../styles/Base.css';

function Layout(){
  return (
    <>
      <div>
        {/* Top Bar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow p-3 mb-5 bg-body-tertiary rounded fixed-top" style={{ height: "56px" }}>
        <Link className="navbar-brand text-dark fs-2" to="/">EcoSwap</Link>
          <div className="container">
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
        </nav>

        <div className="container-fluid ">
          <div className="row">
            {/* Side Navbar */}
            <div className="col-2 bg-dark" style={{ marginTop: '56px', minHeight: '100vh', position: 'fixed' }}>
              <nav className="nav flex-column">
                <h3 className="text-light pt-4">Users</h3>
                <Link className="nav-link text-light" to="/">Account Management</Link>
                <Link className="nav-link text-light" to="/">Violations</Link>

                <h3 className="text-light pt-4">Staff</h3>
                <Link className="nav-link text-light" to="/FAQ">FAQs Management</Link>
                <Link className="nav-link text-light" to="/">Listings Management</Link>
                <Link className="nav-link text-light" to="/">Event Management</Link>
              </nav>
            </div>

            {/* Scrolling */}
            <div className="col-10 offset-2" style={{ marginTop: '56px' }}>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Layout;
