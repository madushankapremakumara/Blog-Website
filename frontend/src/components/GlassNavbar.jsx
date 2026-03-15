import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./GlassNavbar.css";

const GlassNavbar = () => {
  return (
    <Navbar className="glass-nav" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="brand-text d-flex align-items-center"
        >
          <div>
            OPEN<span className="accent">BLOG</span>
          </div>
          <span className="beta-flag ms-2">Beta v0.5</span>
        </Navbar.Brand>
        <Navbar.Toggle
          className="custom-toggler"
          aria-controls="basic-navbar-nav"
        />
        <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
          <Nav>
            <Nav.Link as={Link} to="/" className="nav-link-custom">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/blogs" className="nav-link-custom">
              Blogs
            </Nav.Link>
            <Nav.Link as={Link} to="/about" className="nav-link-custom">
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" className="nav-link-custom">
              Contact
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default GlassNavbar;
