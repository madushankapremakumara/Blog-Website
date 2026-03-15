import React from 'react';
import { Container, Form } from 'react-bootstrap';

const Contact = () => {
  return (
    <Container className="py-5 mt-5">
      <div className="glass-card p-5 mx-auto" style={{maxWidth: '600px'}}>
        <h1 className="detail-title mb-2 text-center">Get in <span className="accent-text">Touch</span></h1>
        <p className="text-secondary text-center mb-5">Have a question or a story idea? Reach out to the team.</p>
        
        <Form>
          <Form.Group className="mb-4">
            <Form.Label className="text-secondary small text-uppercase fw-bold">Full Name</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Enter your name" 
              className="bg-dark text-white border-secondary"
              style={{background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)'}}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="text-secondary small text-uppercase fw-bold">Email Address</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="name@example.com" 
              className="bg-dark text-white border-secondary"
              style={{background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)'}}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="text-secondary small text-uppercase fw-bold">Message</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={4} 
              placeholder="Your message..." 
              className="bg-dark text-white border-secondary"
              style={{background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)'}}
            />
          </Form.Group>

          <button type="submit" className="btn-primary-custom w-100 py-3">
            Send Message
          </button>
        </Form>
      </div>
    </Container>
  );
};

export default Contact;
