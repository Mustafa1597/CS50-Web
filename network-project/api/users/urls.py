from django.urls import path

from knox import views as knox_views

from . import views

urlpatterns = [
  path('signup', views.SignupView.as_view(), name='signup'),
  path('login', views.LoginView.as_view() , name='login'),
  path('logout', knox_views.LogoutView.as_view(), name='logout'),
  path('<str:username>', views.UserRetrieveView.as_view(), name='user'),
  path('<int:pk>/following', views.FollowingListView.as_view(), name='following'),
  path('<int:pk>/followers', views.FollowersListView.as_view(), name='followers'),
  path('<int:pk>/follow', views.FollowView.as_view(), name='follow'),
  path('<int:pk>/unfollow', views.UnFollowView.as_view(), name='unfollow'),
]