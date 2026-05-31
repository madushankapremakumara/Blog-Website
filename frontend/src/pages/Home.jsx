import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import BlogPostCard from '../components/BlogPostCard';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recent'); // recent, top, trending

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params = {
          status: 'published',
          ordering: activeTab === 'top' || activeTab === 'trending' ? '-likes' : '-created_at'
        };

        if (activeTab === 'trending') {
          params.limit = 10;
        }

        const response = await axios.get('/api/posts/', { params });
        setPosts(response.data.results || response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [activeTab]);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section text-center d-flex align-items-center justify-content-center">
        <div className="hero-content">
          <h1 className="hero-title">
            The Future of <span className="accent-text">Intelligence</span>
          </h1>
          <p className="hero-subtitle">
            A high-performance space for deep dives into AI, web evolution,
            and futuristic engineering.
          </p>
          <Link to="/blogs" className="btn-primary-custom btn-lg text-decoration-none">
            Explore Blogs
          </Link>
        </div>
      </div>

      {/* Latest Insights Section */}
      <Container className="py-5">
        <div className="d-flex align-items-center justify-content-between mb-5 flex-wrap gap-4">
          <div className="d-flex align-items-center flex-grow-1">
            <h2 className="section-title mb-0">Latest <span className="accent-text">Insights</span></h2>
            <div className="section-line ms-4 flex-grow-1 d-none d-md-block"></div>
          </div>
          
          <div className="custom-tabs d-flex gap-2">
            {['recent', 'top', 'trending'].map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="accent-text h4">Syncing with neural network...</div>
          </div>
        ) : (
          <Row className="g-4">
            {posts.length > 0 ? (
              posts.map((post) => (
                <Col md={4} key={post.id}>
                  <BlogPostCard 
                    id={post.id}
                    title={post.title}
                    excerpt={post.excerpt}
                    category={post.category?.name || "General"}
                    date={new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    author={post.author?.username || post.author?.first_name || "Admin"}
                    source="home"
                    initialLikes={post.likes}
                    initialIsLiked={post.is_liked}
                  />
                </Col>
              ))
            ) : (
              <Col className="text-center py-5">
                <p className="text-secondary">No data found in this sector.</p>
              </Col>
            )}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Home;
