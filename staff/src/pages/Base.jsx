import { React, useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import "../styles/base.css";
import { Container, Navbar } from "react-bootstrap";

function Layout() {
  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 768px)").matches
  );

  useEffect(() => {
    window
      .matchMedia("(min-width: 768px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  return (
    <>
      {!matches && (
        <div>
          <Navbar
           
            className="navbar-light navbar-expand-sm bg-white shadow p-3 mb-5 bg-body-tertiary rounded fixed-top"
            style={{ height: "56px" }}
          >
            <Container fluid>
              <Link className="navbar-brand text-dark fs-2" to="/">
                <img src="../assets/staff\src\assets\IT2155 - EcoSwap Logo.png - EcoSwap Logo.png" alt=""></img>
                <p>EcoSwap</p>
              </Link>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <Container
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link
                      className="nav-link active"
                      aria-current="page"
                      to="/"
                    >
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/FAQ">
                      FAQs
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/">
                      Violations
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/">
                      Account Management
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/">
                      Listings Management
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/">
                      Event Management
                    </Link>
                  </li>
                </ul>
              </Container>
            </Container>
          </Navbar>
        </div>
      )}
      {matches && (
        <div>
          {/* Top Bar */}
          <Navbar
            className="navbar-light bg-white shadow p-3 mb-5 bg-body-tertiary rounded fixed-top"
            style={{ height: "56px" }}
          >
            <Link className="navbar-brand text-dark fs-2" to="/">
              EcoSwap
            </Link>
          </Navbar>
          <div className="container-fluid">
            <div className="row">
              {/* Side Navbar */}
              <div
                className="col-2 bg-dark"
                style={{
                  marginTop: "56px",
                  minHeight: "100vh",
                  position: "fixed",
                }}
              >
                <nav className="nav flex-column">
                  <h3 className="text-light pt-4">Users</h3>
                  <Link className="nav-link text-light" to="/">
                    Account Management
                  </Link>
                  <Link className="nav-link text-light" to="/">
                    Violations
                  </Link>

                  <h3 className="text-light pt-4">Staff</h3>
                  <Link className="nav-link text-light" to="/FAQ">
                    FAQs Management
                  </Link>
                  <Link className="nav-link text-light" to="/">
                    Listings Management
                  </Link>
                  <Link className="nav-link text-light" to="/">
                    Event Management
                  </Link>
                </nav>
              </div>

              {/* Scrolling */}
              <div className="col-10 offset-2" style={{ marginTop: "56px" }}>
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Layout;
