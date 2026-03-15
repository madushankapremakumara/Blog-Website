import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminPanel.css";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dashboard Stats State
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0 });

  // Filter & Pagination States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchStats = React.useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/post-summary/",
      );
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

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
      let url = "http://localhost:8000/api/posts/";
      const params = new URLSearchParams();

      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (categoryFilter !== "all")
        params.append("category__slug", categoryFilter);
      params.append("page", currentPage);

      if (dateRange !== "all") {
        const now = new Date();
        let gteDate = new Date();
        if (dateRange === "7d") gteDate.setDate(now.getDate() - 7);
        else if (dateRange === "30d") gteDate.setDate(now.getDate() - 30);
        else if (dateRange === "1y") gteDate.setFullYear(now.getFullYear() - 1);
        params.append("created_at__gte", gteDate.toISOString());
      }

      const queryString = params.toString();
      const response = await axios.get(
        queryString
          ? `${url}?${queryString}&page_size=10`
          : `${url}?page_size=10`,
      );
      setPosts(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 10)); // 10 is our page size
      setLoading(false);
    } catch (error) {
      console.error("Error fetching admin posts:", error);
      setLoading(false);
    }
  }, [searchTerm, statusFilter, categoryFilter, dateRange, currentPage]);

  useEffect(() => {
    fetchStats();
    fetchCategories();
  }, [fetchStats, fetchCategories]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPosts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchPosts]);

  const handleLogout = () => {
    localStorage.clear();
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  const handleDeleteClick = (post) => {
    setSelectedPost(post);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/posts/${selectedPost.id}/`);
      setPosts(posts.filter((p) => p.id !== selectedPost.id));
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
          <h1 className="detail-title mb-0">
            Admin <span className="accent-text">Dashboard</span>
          </h1>
          <p className="text-secondary mb-0">
            Manage your high-tech thoughts here.
          </p>
        </div>
        <div className="d-flex gap-3">
          <Button variant="outline-danger" onClick={handleLogout}>
            Logout
          </Button>
          <Button
            className="btn-primary-custom"
            onClick={() => navigate("/admin-panel/create")}
          >
            Create New Post
          </Button>
        </div>
      </div>

      <Row className="g-4">
        <Col lg={4}>
          <div className="glass-card p-4 text-center">
            <h3 className="h5 text-secondary">Total Posts</h3>
            <p className="display-4 fw-bold">{stats.total}</p>
          </div>
        </Col>
        <Col lg={4}>
          <div className="glass-card p-4 text-center">
            <h3 className="h5 text-secondary">Published</h3>
            <p className="display-4 fw-bold">{stats.published}</p>
          </div>
        </Col>
        <Col lg={4}>
          <div className="glass-card p-4 text-center">
            <h3 className="h5 text-secondary">Drafts</h3>
            <p className="display-4 fw-bold">{stats.drafts}</p>
          </div>
        </Col>
      </Row>

      <div className="glass-card mt-5 p-0 overflow-hidden">
        <div className="p-4 border-bottom border-secondary d-flex flex-wrap justify-content-between align-items-center gap-3">
          <h3 className="h4 mb-0">Manage Posts</h3>

          <div className="d-flex flex-wrap gap-3 flex-grow-1 justify-content-end">
            {/* Admin Search */}
            <div className="admin-search-container glass-card p-2 d-flex align-items-center">
              <i className="bi bi-search ms-2 text-secondary"></i>
              <input
                type="text"
                className="bg-transparent border-0 px-2 text-white"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ outline: "none", fontSize: "0.9rem" }}
              />
            </div>

            {/* Status Filter */}
            <select
              className="admin-filter-select glass-card border-0 px-3 text-white"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all" className="bg-dark">
                All Status
              </option>
              <option value="published" className="bg-dark">
                Published
              </option>
              <option value="draft" className="bg-dark">
                Drafts
              </option>
            </select>

            {/* Category Filter */}
            <select
              className="admin-filter-select glass-card border-0 px-3 text-white"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all" className="bg-dark">
                All Categories
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug} className="bg-dark">
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Date Filter */}
            <select
              className="admin-filter-select glass-card border-0 px-3 text-white"
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all" className="bg-dark">
                All Time
              </option>
              <option value="7d" className="bg-dark">
                Last 7 Days
              </option>
              <option value="30d" className="bg-dark">
                Last 30 Days
              </option>
              <option value="1y" className="bg-dark">
                Last 1 Year
              </option>
            </select>

            {(searchTerm ||
              statusFilter !== "all" ||
              categoryFilter !== "all" ||
              dateRange !== "all") && (
              <Button
                variant="link"
                className="text-accent p-0"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setCategoryFilter("all");
                  setDateRange("all");
                  setCurrentPage(1);
                }}
              >
                Clear
              </Button>
            )}
          </div>
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
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="px-4 fw-bold">{post.title}</td>
                  <td>
                    <span
                      className={`status-badge ${post.status.toLowerCase()}`}
                    >
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

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div
            className="px-4 py-4 border-top border-secondary d-flex justify-content-between align-items-center"
            style={{ minHeight: "unset" }}
          >
            <div className="text-secondary" style={{ fontSize: "0.75rem" }}>
              Page <span className="text-white">{currentPage}</span> of{" "}
              <span className="text-white">{totalPages}</span>
            </div>
            <div className="d-flex gap-2">
              <Button
                variant="outline-secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="glass-card px-2"
                style={{
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "0.75rem",
                  padding: "0 8px",
                }}
              >
                Previous
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="glass-card px-2"
                style={{
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "0.75rem",
                  padding: "0 8px",
                }}
              >
                Next
              </Button>
            </div>
          </div>
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
          <Modal.Title>
            Confirm <span className="accent-text">Deletion</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-secondary py-4">
          Are you sure you want to delete{" "}
          <strong className="text-white">"{selectedPost?.title}"</strong>? This
          action cannot be undone.
        </Modal.Body>
        <Modal.Footer className="border-0 p-0">
          <Button
            variant="outline-secondary"
            onClick={() => setShowDeleteModal(false)}
          >
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
