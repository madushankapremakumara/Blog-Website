import React, { useState } from 'react';
import { Container, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      await axios.post('http://localhost:8000/api/contact/', formData);
      setStatus({ type: 'success', msg: 'Thank you! Your message has been sent successfully.' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus({ type: 'danger', msg: 'Something went wrong. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5 mt-5">
      <div className="glass-card p-5 mx-auto" style={{maxWidth: '600px'}}>
        <h1 className="detail-title mb-2 text-center">Get in <span className="accent-text">Touch</span></h1>
        <p className="text-secondary text-center mb-5">Have a question or a story idea? Reach out to the team.</p>
        
        {status.msg && (
          <Alert variant={status.type} className="glass-card border-0 text-white mb-4">
            {status.msg}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label className="text-secondary small text-uppercase fw-bold">Full Name</Form.Label>
            <Form.Control 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name" 
              required
              className="bg-dark text-white border-secondary"
              style={{background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)'}}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="text-secondary small text-uppercase fw-bold">Email Address</Form.Label>
            <Form.Control 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com" 
              required
              className="bg-dark text-white border-secondary"
              style={{background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)'}}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="text-secondary small text-uppercase fw-bold">Subject</Form.Label>
            <Form.Control 
              type="text" 
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="What is this about?" 
              required
              className="bg-dark text-white border-secondary"
              style={{background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)'}}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="text-secondary small text-uppercase fw-bold">Message</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={4} 
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message..." 
              required
              className="bg-dark text-white border-secondary"
              style={{background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)'}}
            />
          </Form.Group>

          <button 
            type="submit" 
            className="btn-primary-custom w-100 py-3"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </Form>
      </div>
    </Container>
  );
};

export default Contact;
