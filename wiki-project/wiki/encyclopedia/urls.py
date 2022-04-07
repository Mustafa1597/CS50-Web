from django.urls import path

from . import views

app_name = "wiki"
urlpatterns = [
    path("", views.index, name = "index"),
    path("search", views.search, name = "search"),
    path("random", views.random, name = "random"),
    path("new", views.new_entry, name = "newentry"),
    path("edit/<str:title>", views.edit_entry, name = "editentry"),
    path("<str:title>", views.get_entry, name = "entry")
]
