import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import './PostEditor.css';

const PostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [categories, setCategories] = useState([]);
  const [post, setPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    category_id: '',
    status: 'draft'
  });
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    // 1. Fetch Categories
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/categories/');
        setCategories(res.data);
        // Default to first category if creating
        if (!isEdit && res.data.length > 0) {
          setPost(prev => ({ ...prev, category_id: res.data[0].id }));
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    // 2. Fetch Post if Editing
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/posts/${id}/`);
        setPost({
          title: res.data.title,
          excerpt: res.data.excerpt,
          content: res.data.content,
          category_id: res.data.category?.id || '',
          status: res.data.status
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching post for edit:", err);
        setLoading(false);
      }
    };

    fetchCategories();
    if (isEdit) fetchPost();
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axios.put(`http://localhost:8000/api/posts/${id}/`, post);
      } else {
        await axios.post('http://localhost:8000/api/posts/', post);
      }
      navigate('/admin-panel');
    } catch (err) {
      console.error("Error saving post:", err);
      alert("Error saving post. Make sure you are logged in if required.");
    }
  };

  if (loading) return <Container className="py-5 text-center accent-text h4">Preparing editor...</Container>;

  return (
    <Container className="py-5 mt-5">
      <div className="glass-card p-5">
        <h1 className="detail-title mb-4">{isEdit ? 'Edit' : 'Create New'} <span className="accent-text">Post</span></h1>
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label className="text-secondary small text-uppercase fw-bold">Post Title</Form.Label>
            <Form.Control 
              type="text" 
              value={post.title}
              onChange={(e) => setPost({...post, title: e.target.value})}
              placeholder="e.g. The Future of Quantum Computing" 
              className="bg-transparent text-white border-secondary py-3 px-4"
              required
            />
          </Form.Group>

          <Row className="g-4 mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-secondary small text-uppercase fw-bold">Category</Form.Label>
                <Form.Select 
                  value={post.category_id}
                  onChange={(e) => setPost({...post, category_id: e.target.value})}
                  className="bg-transparent text-white border-secondary py-3 px-4"
                  required
                >
                  <option value="" disabled className="bg-dark">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id} className="bg-dark">
                      {cat.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-secondary small text-uppercase fw-bold">Status</Form.Label>
                <Form.Select 
                  value={post.status}
                  onChange={(e) => setPost({...post, status: e.target.value})}
                  className="bg-transparent text-white border-secondary py-3 px-4"
                >
                  <option value="draft" className="bg-dark">Draft</option>
                  <option value="published" className="bg-dark">Published</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label className="text-secondary small text-uppercase fw-bold">Post Excerpt (Short Description)</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={2}
              value={post.excerpt}
              onChange={(e) => setPost({...post, excerpt: e.target.value})}
              placeholder="A brief summary to entice readers..." 
              className="bg-transparent text-white border-secondary py-3 px-4"
              required
            />
          </Form.Group>

          <Form.Group className="mb-5">
            <Form.Label className="text-secondary small text-uppercase fw-bold">Detailed Content (HTML Supported)</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={10} 
              value={post.content}
              onChange={(e) => setPost({...post, content: e.target.value})}
              placeholder="Write your high-tech thoughts here..." 
              className="bg-transparent text-white border-secondary py-3 px-4"
              required
            />
          </Form.Group>

          <div className="d-flex gap-3">
            <Button type="submit" className="btn-primary-custom py-3 px-5">
              {isEdit ? 'Update Post' : 'Publish Post'}
            </Button>
            <Button 
              variant="outline-secondary" 
              className="py-3 px-5"
              onClick={() => navigate('/admin-panel')}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default PostEditor;
