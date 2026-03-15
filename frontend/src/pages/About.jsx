import React from 'react';
import { Container } from 'react-bootstrap';

const About = () => {
  return (
    <Container className="py-5 mt-5">
      <div className="glass-card p-5 mx-auto" style={{maxWidth: '800px'}}>
        <h1 className="detail-title mb-4 text-center">About <span className="accent-text">OpenBlog</span></h1>
        <div className="section-line mx-auto mb-5" style={{maxWidth: '100px'}}></div>
        
        <div className="post-content">
          <p className="lead text-center mb-5">
            OpenBlog is a high-performance space designed for engineers, researchers, and tech enthusiasts.
          </p>
          
          <h3>Our Mission</h3>
          <p>
            To demystify complex technologies and provide deep, technical insights that go beyond the surface-level noise of common tech media. We focus on AI, Decentralized Systems, and Modern Engineering.
          </p>
          
          <h3>Premium Design</h3>
          <p>
            Inspired by the minimalist, high-tech aesthetic of OpenClaw, this platform aims to provide a distraction-free, immersive reading experience using modern CSS techniques like glassmorphism.
          </p>
          
          <div className="mt-5 text-center">
            <button className="btn-primary-custom">Join the Community</button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default About;
