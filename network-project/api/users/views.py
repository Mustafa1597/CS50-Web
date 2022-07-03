from django.contrib.auth import login
from django.shortcuts import get_object_or_404

from knox.views import LoginView as KnoxLoginView

from rest_framework.response import Response
from rest_framework.exceptions import ParseError
from rest_framework.generics import CreateAPIView, RetrieveAPIView, ListAPIView, UpdateAPIView
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework import status

from .models import User
from .serializers import UserSerializer

class SignupView(CreateAPIView):
  queryset = User.objects.all()
  serializer_class = UserSerializer
  permission_classes = [AllowAny]

  def perform_create(self, serializer):
    serializer.validated_data.pop("confirmed_password")
    User.objects.create_user(**serializer.validated_data)

  def create(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    self.perform_create(serializer)

    serializer = UserSerializer(User.objects.get(username=serializer.validated_data['username']))
    return Response(serializer.data, status=status.HTTP_201_CREATED)
    

class LoginView(KnoxLoginView):
  authentication_classes = [BasicAuthentication]
  permission_classes = [IsAuthenticated]


class UserRetrieveView(RetrieveAPIView):
  queryset = User.objects.all()
  serializer_class = UserSerializer
  lookup_field = 'username'


class FollowingListView(ListAPIView):
  serializer_class = UserSerializer

  def get_queryset(self):
    return User.objects.get(pk=self.kwargs['pk']).following


class FollowersListView(ListAPIView):
  serializer_class = UserSerializer

  def get_queryset(self):
    return User.objects.get(pk=self.kwargs['pk']).followers

class FollowView(UpdateAPIView):
  def update(self, request, *args, **kwargs):
    user = request.user
    
    if user.id == kwargs['pk']:
      raise ParseError('Sorry,You Can Not Follow Your Self')

    user_to_follow = get_object_or_404(User, pk=kwargs['pk'])
    user.following.add(user_to_follow)
    
    serializer = UserSerializer(user)
    return Response(serializer.data)


class UnFollowView(UpdateAPIView):
  def update(self, request, *args, **kwargs):
    user = request.user
    
    if user.id == kwargs['pk']:
      raise ParseError('Sorry,You Can Not Unfollow Your Self')

    user_to_unfollow = get_object_or_404(User, pk=kwargs['pk'])
    user.following.remove(user_to_unfollow)

    serializer = UserSerializer(user)
    return Response(serializer.data)

