import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import './Login.css';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8000/api/token/', credentials);
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            
            // Set default axios header
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
            
            navigate('/admin-panel');
        } catch (err) {
            setError('Invalid username or password. Please try again.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="login-container d-flex align-items-center justify-content-center">
            <div className="glass-card login-card p-5">
                <div className="text-center mb-5">
                    <h1 className="detail-title mb-2">Admin <span className="accent-text">Login</span></h1>
                    <p className="text-secondary small">Access the control center.</p>
                </div>

                {error && <Alert variant="danger" className="bg-transparent text-danger border-danger small mb-4">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4">
                        <Form.Label className="text-secondary small text-uppercase fw-bold">Username</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="username"
                            value={credentials.username}
                            onChange={handleChange}
                            placeholder="Enter username" 
                            className="bg-transparent text-white border-secondary py-3 px-4"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-5">
                        <Form.Label className="text-secondary small text-uppercase fw-bold">Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            placeholder="Enter password" 
                            className="bg-transparent text-white border-secondary py-3 px-4"
                            required
                        />
                    </Form.Group>

                    <Button 
                        type="submit" 
                        className="btn-primary-custom w-100 py-3"
                        disabled={loading}
                    >
                        {loading ? 'Authenticating...' : 'Enter Dashboard'}
                    </Button>
                </Form>
                
                <div className="mt-4 text-center">
                    <button 
                        onClick={() => navigate('/')} 
                        className="btn btn-link text-secondary text-decoration-none small"
                    >
                        &larr; Back to Public Site
                    </button>
                </div>
            </div>
        </Container>
    );
};

export default Login;
