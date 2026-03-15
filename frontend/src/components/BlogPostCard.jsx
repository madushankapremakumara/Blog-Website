import React, { useState } from "react";
import { Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import "./BlogPostCard.css";

const BlogPostCard = ({ id, title, excerpt, category, date, author, source, initialLikes, initialIsLiked }) => {
  const [likes, setLikes] = useState(initialLikes || 0);
  const [isLiked, setIsLiked] = useState(initialIsLiked || false);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault(); 
    e.stopPropagation();
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

  return (
    <div className="post-card-wrapper">
      <Link 
        to={`/post/${id}`} 
        state={{ from: source }}
        className="post-card-link text-decoration-none"
      >
        <div className="glass-card h-100 post-card">
          <div className="post-metadata mb-3 d-flex justify-content-between align-items-center">
            <div>
              <Badge className="category-badge">{category}</Badge>
              <span className="post-date ms-2">{date}</span>
            </div>
          </div>
          <h3 className="post-title">{title}</h3>
          <p className="post-excerpt text-secondary">{excerpt}</p>
          <div className="post-footer mt-auto d-flex justify-content-between align-items-center">
            <span className="post-author text-truncate me-2">
              By <span className="highlight">{author}</span>
            </span>
            <div className="d-flex gap-3 align-items-center">
              <button 
                className={`like-btn-insta ${isLiked ? 'liked' : ''} ${isLiking ? 'liking' : ''}`} 
                onClick={handleLike}
                title={isLiked ? "Unlike" : "Like"}
              >
                <span className="heart-emoji">{isLiked ? '❤️' : '🤍'}</span>
                <span className="like-count ms-1">{likes}</span>
              </button>
              <button className="read-more-btn">
                Read More <i className="bi bi-arrow-right" />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogPostCard;
