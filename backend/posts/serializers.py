from rest_framework import serializers
from .models import Category, Post, ContactMessage
from django.contrib.auth.models import User



class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'
        read_only_fields = ('created_at',)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name')

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = (
            'id', 'title', 'slug', 'author', 'category', 'category_id',
            'excerpt', 'content', 'status', 'likes', 'is_liked', 'created_at', 'updated_at'
        )
        read_only_fields = ('slug', 'created_at', 'updated_at')

    def get_is_liked(self, obj):
        guest_id = self.context.get('request').headers.get('X-Guest-ID')
        if not guest_id:
            return False
        return obj.post_likes.filter(session_id=guest_id).exists()
