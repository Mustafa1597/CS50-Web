from django.db import models

from users.models import User

class Post(models.Model):
  writer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
  content = models.TextField(max_length=1024)
  created = models.DateTimeField(auto_now_add=True)

  def likes_users(self):
    return self.likes.values_list("user__username", flat=True)

  def __str__(self):
    return self.content

class Like(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE)
  post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')

  def __str__(self):
    return f'{self.user}=>{self.post}'

class Comment(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE)
  post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
  text = models.TextField(max_length=128)
  written = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return f"{self.text}=>{self.post}"
