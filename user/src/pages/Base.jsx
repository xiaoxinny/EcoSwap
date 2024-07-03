import { Outlet, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

const Layout = () => {
  return (
    <>
      <Navbar expand="lg" className="bg-success" sticky="top">
        {/* Use Link component for navigation */}
        <Link to="/" className="navbar-brand">EcoSwap</Link>
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {/* Use as prop to render Nav.Link as Link */}
              <Nav.Link as={Link} to="/home">Home</Nav.Link>
              <Nav.Link as={Link} to="/link">Link</Nav.Link>
              <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/action/3.2">Another action</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/action/3.4">Separated link</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Outlet />
    </>
  );
};

export default Layout;
