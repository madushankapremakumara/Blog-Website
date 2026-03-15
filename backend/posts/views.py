from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.filters import OrderingFilter, SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from .models import Category, Post
from .serializers import PostSerializer, CategorySerializer

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class PostList(generics.ListCreateAPIView):
    pagination_class = StandardResultsSetPagination
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = {
        'category__slug': ['exact'],
        'created_at': ['gte', 'lte'],
        'status': ['exact'],
    }
    search_fields = ['title', 'content', 'excerpt']
    ordering_fields = ['created_at', 'likes']
    ordering = ['-created_at'] # Default

    def get_queryset(self):
        # Admins/Staff should see all posts in the dashboard
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return Post.objects.all()
        # Guests only see published posts
        return Post.objects.filter(status='published')

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'id'

class PostLike(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, id):
        guest_id = request.headers.get('X-Guest-ID')
        if not guest_id:
            return Response({'error': 'Guest-ID required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            from .models import PostLike as LikeRecord
            post = Post.objects.get(id=id)
            like_record = LikeRecord.objects.filter(post=post, session_id=guest_id)
            
            if like_record.exists():
                # Unlike
                like_record.delete()
                post.likes = max(0, post.likes - 1)
                liked = False
            else:
                # Like
                LikeRecord.objects.create(post=post, session_id=guest_id)
                post.likes += 1
                liked = True
            
            post.save()
            return Response({'likes': post.likes, 'is_liked': liked}, status=status.HTTP_200_OK)
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

class CategoryList(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class PostSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff:
            return Response({"detail": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
        
        all_posts = Post.objects.all()
        return Response({
            "total": all_posts.count(),
            "published": all_posts.filter(status='published').count(),
            "drafts": all_posts.filter(status='draft').count(),
        })
