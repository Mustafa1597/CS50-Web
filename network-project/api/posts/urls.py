from django.urls import path

from . import views

urlpatterns = [
  path('', views.PostListCreateView.as_view(), name='posts'),
  path('<int:pk>', views.PostRetrieveUpdateDestroyView.as_view(), name='post'),
  path('<int:pk>/comments', views.CommentCreateView.as_view(), name="comments"),
  path('comments/<int:pk>', views.CommentRetrieveDestroyView.as_view(), name="delete-comment"),
  path('<int:pk>/like', views.LikeCreateView.as_view(), name='like'),
  path('<int:pk>/unlike', views.LikeDestroyView.as_view(), name='unlike'),
  path('following', views.FollowingPostsListView.as_view(), name='following_posts'),
]