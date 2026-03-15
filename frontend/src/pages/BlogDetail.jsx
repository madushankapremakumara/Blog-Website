import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import './BlogDetail.css';

const BlogDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const from = location.state?.from || 'home';

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/posts/${id}/`);
        setPost(response.data);
        setLikes(response.data.likes);
        setIsLiked(response.data.is_liked);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post details:", error);
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      const response = await axios.post(`http://localhost:8000/api/posts/${id}/like/`);
      setLikes(response.data.likes);
      setIsLiked(response.data.is_liked);
    } catch (err) {
      console.error("Error liking post:", err);
    } finally {
      setIsLiking(false);
    }
  };

  if (loading) {
    return <Container className="py-5 text-center accent-text h4">Loading post...</Container>;
  }

  if (!post) {
    return (
      <Container className="py-5 text-center">
        <h2 className="accent-text">Post not found</h2>
        <Link to="/" className="btn-primary-custom mt-4 d-inline-block text-decoration-none">Back to Home</Link>
      </Container>
    );
  }

  return (
    <Container className="py-5 mt-5">
      <Link 
        to={from === 'blogs' ? '/blogs' : '/'} 
        className="back-link mb-4 d-inline-block text-decoration-none"
      >
        &larr; {from === 'blogs' ? 'Back to blogs' : 'Back to insights'}
      </Link>
      
      <div className="glass-card p-5">
        <div className="detail-meta mb-3">
          <span className="post-category me-3">{post.category?.name || "General"}</span>
          <span className="post-date">{new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
        
        <h1 className="detail-title mb-4">{post.title}</h1>
        
        <div className="author-info mb-5 d-flex align-items-center">
          <div className="author-avatar me-3"></div>
          <div className="d-flex align-items-center gap-4">
            <div>
              <div className="text-secondary small">Written by</div>
              <div className="accent-text fw-bold">{post.author?.username || post.author?.first_name || "Admin"}</div>
            </div>
            
            {/* Instagram-style Like Button in Detail View */}
            <button 
              className={`like-btn-insta ${isLiked ? 'liked' : ''} ${isLiking ? 'liking' : ''}`} 
              onClick={handleLike}
              style={{ fontSize: '1.2rem' }}
            >
              <span className="heart-emoji">{isLiked ? '❤️' : '🤍'}</span>
              <span className="like-count ms-1">{likes}</span>
            </button>
          </div>
        </div>
        
        <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }}>
        </div>
      </div>
    </Container>
  );
};

export default BlogDetail;
