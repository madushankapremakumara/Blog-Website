import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/posts/');
        setPosts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching admin posts:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    // Also remove from axios defaults just in case
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  const handleDeleteClick = (post) => {
    setSelectedPost(post);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/posts/${selectedPost.id}/`);
      setPosts(posts.filter(p => p.id !== selectedPost.id));
      setShowDeleteModal(false);
      setSelectedPost(null);
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post.");
    }
  };

  return (
    <Container className="py-5 mt-5">
      <div className="glass-card mb-4 p-4 d-flex justify-content-between align-items-center">
        <div>
          <h1 className="detail-title mb-0">Admin <span className="accent-text">Dashboard</span></h1>
          <p className="text-secondary mb-0">Manage your high-tech thoughts here.</p>
        </div>
        <div className="d-flex gap-3">
          <Button 
            variant="outline-danger"
            onClick={handleLogout}
          >
            Logout
          </Button>
          <Button 
            className="btn-primary-custom"
            onClick={() => navigate('/admin-panel/create')}
          >
            Create New Post
          </Button>
        </div>
      </div>

      <Row className="g-4">
        <Col lg={4}>
          <div className="glass-card p-4 text-center">
            <h3 className="h5 text-secondary">Total Posts</h3>
            <p className="display-4 fw-bold">{posts.length}</p>
          </div>
        </Col>
        <Col lg={4}>
          <div className="glass-card p-4 text-center">
            <h3 className="h5 text-secondary">Published</h3>
            <p className="display-4 fw-bold">
              {posts.filter(p => p.status === 'published').length}
            </p>
          </div>
        </Col>
        <Col lg={4}>
          <div className="glass-card p-4 text-center">
            <h3 className="h5 text-secondary">Drafts</h3>
            <p className="display-4 fw-bold">
              {posts.filter(p => p.status === 'draft').length}
            </p>
          </div>
        </Col>
      </Row>

      <div className="glass-card mt-5 p-0 overflow-hidden">
        <div className="p-4 border-bottom border-secondary">
          <h3 className="h4 mb-0">All Posts</h3>
        </div>
        {loading ? (
          <div className="p-5 text-center accent-text">Gathering data...</div>
        ) : (
          <Table responsive hover variant="dark" className="admin-table mb-0">
            <thead>
              <tr>
                <th className="px-4">Title</th>
                <th>Status</th>
                <th>Category</th>
                <th>Date</th>
                <th className="text-end px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id}>
                  <td className="px-4 fw-bold">{post.title}</td>
                  <td>
                    <span className={`status-badge ${post.status.toLowerCase()}`}>
                      {post.status}
                    </span>
                  </td>
                  <td>{post.category?.name || "None"}</td>
                  <td>{new Date(post.created_at).toLocaleDateString()}</td>
                  <td className="text-end px-4">
                    <Button 
                      variant="link" 
                      className="text-info p-0 me-3"
                      onClick={() => navigate(`/admin-panel/edit/${post.id}`)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="link" 
                      className="text-danger p-0"
                      onClick={() => handleDeleteClick(post)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal 
        show={showDeleteModal} 
        onHide={() => setShowDeleteModal(false)}
        centered
        contentClassName="glass-card p-4 border-0"
      >
        <Modal.Header closeButton closeVariant="white" className="border-0">
          <Modal.Title>Confirm <span className="accent-text">Deletion</span></Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-secondary py-4">
          Are you sure you want to delete <strong className="text-white">"{selectedPost?.title}"</strong>? 
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer className="border-0 p-0">
          <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)}>
            Keep it
          </Button>
          <Button variant="danger" className="px-4" onClick={confirmDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminPanel;
