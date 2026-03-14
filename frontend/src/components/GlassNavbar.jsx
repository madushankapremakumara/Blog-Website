import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import "./GlassNavbar.css";

const GlassNavbar = () => {
  return (
    <>
      <Navbar className="glass-nav" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand className="brand-text" href="/">
            OPEN<span className="accent">BLOG</span>
          </Navbar.Brand>
          <Navbar.Toggle
            className="custom-toggler"
            aria-controls="basic-navbar-nav"
          />
          <Navbar.Collapse
            className="justify-content-end"
            id="basic-navbar-nav"
          >
            <Nav>
              <Nav.Link className="nav-link-custom" href="/">
                Home
              </Nav.Link>
              <Nav.Link className="nav-link-custom" href="/blogs">
                Blogs
              </Nav.Link>
              <Nav.Link className="nav-link-custom" href="/about">
                About
              </Nav.Link>
              <Nav.Link className="nav-link-custom" href="/contact">
                Contact
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default GlassNavbar;
