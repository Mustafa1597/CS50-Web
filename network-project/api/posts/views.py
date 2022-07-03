from django.shortcuts import get_object_or_404

from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import DestroyAPIView, CreateAPIView, ListAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView, RetrieveDestroyAPIView

from .models import Post, Like, Comment
from .serializers import PostSerializer, CommentSerializer, LikeSerializer

class PostListCreateView(ListCreateAPIView):
  """
  creating a post and listing the posts of all users
  """
  queryset = Post.objects.all().order_by('-created')
  serializer_class = PostSerializer

  def perform_create(self, serializer):
    serializer.save(writer=self.request.user)

class PostRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
  """
  Retrieve update or destroy a specific post
  """
  queryset = Post.objects.all()
  serializer_class = PostSerializer

class FollowingPostsListView(ListAPIView):
  serializer_class = PostSerializer
  
  def get_queryset(self):
    user = self.request.user
    following = user.following.all()
    return Post.objects.filter(writer__in=following)

class LikeCreateView(CreateAPIView):
  """
  like a post
  """
  def create(self, request, *args, **kwargs):
    post = get_object_or_404(Post, pk=self.kwargs['pk'])
    Like.objects.create(user=self.request.user, post=post)
    return Response(status=status.HTTP_201_CREATED)

class LikeDestroyView(DestroyAPIView):
  """
  unlike a post
  """
  def destroy(self, request, *args, **kwargs):
    post = get_object_or_404(Post, pk=self.kwargs['pk'])
    Like.objects.get(user=request.user, post=post).delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

class CommentCreateView(CreateAPIView):
  """
  list comments for a specific post or writing one
  """
  serializer_class = CommentSerializer
  
  def perform_create(self, serializer):
    post = get_object_or_404(Post, pk=self.kwargs['pk'])
    serializer.save(user=self.request.user, post=post)

class CommentRetrieveDestroyView(RetrieveDestroyAPIView):
  queryset = Comment.objects.all()
  serializer_class = CommentSerializer


