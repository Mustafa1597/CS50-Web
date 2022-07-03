from rest_framework import serializers

from .models import User

class UserSerializer(serializers.ModelSerializer):
  followers = serializers.SlugRelatedField(many=True, slug_field='username', read_only=True)
  following = serializers.SlugRelatedField(many=True, slug_field='username', read_only=True)
  confirmed_password = serializers.CharField(write_only=True)
  class Meta:
    model = User
    fields = [
      'id', 
      'username', 
      'email', 
      'following', 
      'followers', 
      'password', 
      'confirmed_password'
    ]
    extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
      if data['password'] != data['confirmed_password']:
        raise serializers.ValidationError('password and confirmed password should be the same')
      return data
