from rest_framework import serializers

from .models import Post, Like, Comment
from users.serializers import UserSerializer

class LikeSerializer(serializers.ModelSerializer):
  class Mata:
    model = Like
    exclude = ['post']

class CommentSerializer(serializers.ModelSerializer):
  user = UserSerializer(read_only=True)
  class Meta:
    model = Comment
    exclude = ['post']
    read_only_fields = ['wirtten']
    depth = 1

class PostSerializer(serializers.ModelSerializer):
  writer = UserSerializer(read_only=True)
  comments = CommentSerializer(many=True, read_only=True)
  class Meta:
    model = Post
    fields = [
      'id',
      'content',
      'likes_users',
      'created',
      'writer',
      'comments',
    ]
    read_only_fields = ['created']
    depth = 1