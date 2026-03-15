import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import BlogPostCard from '../components/BlogPostCard';
import './Blogs.css';

const Blogs = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  const fetchCategories = React.useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/categories/");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  const fetchPosts = React.useCallback(async () => {
    setLoading(true);
    try {
      let url = "http://localhost:8000/api/posts/?status=published";
      if (searchTerm) url += `&search=${searchTerm}`;
      if (activeCategory !== "all") url += `&category__slug=${activeCategory}`;
      
      if (dateRange !== "all") {
        const now = new Date();
        let gteDate = new Date();
        if (dateRange === "7d") gteDate.setDate(now.getDate() - 7);
        else if (dateRange === "30d") gteDate.setDate(now.getDate() - 30);
        else if (dateRange === "1y") gteDate.setFullYear(now.getFullYear() - 1);
        
        url += `&created_at__gte=${gteDate.toISOString()}`;
      }

      const response = await axios.get(url);
      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    }
  }, [searchTerm, activeCategory, dateRange]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPosts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchPosts]);

  return (
    <Container className="py-5 mt-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3">All <span className="accent-text">Articles</span></h1>
        <p className="text-secondary lead">Discover our full collection of insights and stories.</p>
      </div>

      <Row className="justify-content-center mb-5">
        <Col md={8} lg={6}>
          <div className="d-flex flex-wrap flex-md-nowrap gap-3 mb-4">
            <div className="search-container glass-card p-2 d-flex align-items-center flex-grow-1">
              <i className="bi bi-search ms-3 text-secondary"></i>
              <input 
                type="text" 
                className="search-input w-100 bg-transparent border-0 px-3 text-white" 
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ outline: 'none' }}
              />
            </div>

            <div className="date-filter-container glass-card p-2 d-flex align-items-center">
              <i className="bi bi-calendar3 ms-3 text-secondary"></i>
              <select 
                className="date-select bg-transparent border-0 px-3 text-white"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                style={{ outline: 'none', cursor: 'pointer' }}
              >
                <option value="all" className="bg-dark">All Time</option>
                <option value="7d" className="bg-dark">Last 7 Days</option>
                <option value="30d" className="bg-dark">Last 30 Days</option>
                <option value="1y" className="bg-dark">Last 1 Year</option>
              </select>
            </div>
          </div>

          <div className="category-filters d-flex flex-wrap justify-content-center gap-2">
            <button 
              className={`filter-pill ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id}
                className={`filter-pill ${activeCategory === cat.slug ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.slug)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </Col>
      </Row>
      
      {loading ? (
        <div className="text-center py-5">
          <div className="accent-text h4">Syncing with database...</div>
        </div>
      ) : posts.length > 0 ? (
        <Row className="g-4">
          {posts.map(post => (
            <Col md={4} key={post.id}>
              <BlogPostCard 
                id={post.id}
                title={post.title}
                excerpt={post.excerpt}
                category={post.category?.name || "General"}
                date={new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                author={post.author?.username || post.author?.first_name || "Admin"}
                source="blogs"
                initialLikes={post.likes}
                initialIsLiked={post.is_liked}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center py-5 glass-card">
          <h3 className="text-secondary mb-3">No articles found</h3>
          <p className="text-muted">Try adjusting your search or filters.</p>
          <button 
            className="btn-primary-custom mt-3"
            onClick={() => { setSearchTerm(""); setActiveCategory("all"); setDateRange("all"); }}
          >
            Clear All Filters
          </button>
        </div>
      )}
    </Container>
  );
};

export default Blogs;
