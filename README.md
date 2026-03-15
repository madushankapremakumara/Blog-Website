# OpenBlog - High-Tech Glassmorphic Blog System 🚀🪐

OpenBlog is a premium, feature-rich blog platform designed with a sleek glassmorphic aesthetic inspired by modern tech interfaces. It features a powerful Django REST Framework backend and a dynamic React frontend.

## 🌟 Key Features

### 📬 Contact & Feedback System (v1.0)
- **Public Contact Form**: Sleek, validated form for user inquiries.
- **Admin Inbox**: Dedicated dashboard section to view, delete, and reply to messages via email.
- **Unread Tracking**: Real-time counters for new feedback.

### 🏛️ Advanced Admin Dashboard
- **Dual-Tab Management**: Switch between managing blog posts and read feedback instantly.
- **Full CRUD**: Create, edit, and delete posts with status toggling (Published/Draft).
- **Multi-Filter**: Advanced filtering by Search, Status, Category, and Date range.
- **Compact Pagination**: Optimized admin view showing 10 items per page.

### 🏠 Public Experience
- **Dynamic Homepage**: Highlights "Trending", "Recent", and "Most Liked" content.
- **Advanced Discovery**: Search and filter blogs by text, category pills, or date ranges.
- **Like System**: Instagram-style heart reaction system with guest session tracking.
- **Optimized Loading**: 9-post grid pagination for the public blogs page.

## 🛠️ Tech Stack

**Frontend:**
- **React (Vite)**: Modern, fast frontend build tool.
- **React Bootstrap**: Responsive UI framework.
- **Vanilla CSS**: Premium glassmorphism and animations.
- **Axios**: API communication.

**Backend:**
- **Django**: Robust Python web framework.
- **DRF (Django REST Framework)**: Powerful API development.
- **JWT Authentication**: Secure admin access.
- **SQLite**: Lightweight and efficient database.

## 🚀 Getting Started

### Prerequisites
- Python 3.x
- Node.js & npm

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/Scripts/activate # Windows
   ```
3. Install dependencies:
   ```bash
   pip install django djangorestframework django-cors-headers django-filter djangorestframework-simplejwt
   ```
4. Run migrations:
   ```bash
   python manage.py migrate
   ```
5. Start the server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🔐 Admin Access
To access the admin dashboard:
1. Create a superuser in the backend: `python manage.py createsuperuser`.
2. Navigate to `http://localhost:5173/login` in the browser.
3. Log in with your admin credentials.

---
Planet-wide Release **Version 1.0** 🪐✨
