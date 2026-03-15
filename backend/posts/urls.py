from django.urls import path
from . import views

urlpatterns = [
    path('posts/', views.PostList.as_view(), name='post-list'),
    path('posts/<int:id>/', views.PostDetail.as_view(), name='post-detail'),
    path('posts/<int:id>/like/', views.PostLike.as_view(), name='post-like'),
    path('categories/', views.CategoryList.as_view(), name='category-list'),
]
