from rest_framework import serializers
from users.models import User
from publications.models import Publication
from users.serializers import DepartmentSerializer

class UserListSerializer(serializers.ModelSerializer):
    date_joined = serializers.SerializerMethodField()
    degree = DepartmentSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ["id", "name", "email", "code", "last_name","is_active","degree","date_joined"]
        
    def get_date_joined(self, obj):
        return obj.date_joined.strftime('%d/%m/%Y %H:%M')

class PublicationListSerializer(serializers.ModelSerializer):
    created_at = serializers.SerializerMethodField()
    user = UserListSerializer(read_only=True)
    
    class Meta:
        model = Publication
        fields = ["id", "content", "created_at", "user"]
    
    def get_created_at(self, obj):
        return obj.created_at.strftime('%d/%m/%Y %H:%M')
