from django.urls import path

from . import views

app_name = "auctions"
urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("create-listing", views.create_listing, name = "createlisting"),
    path("view-listing/<int:listing_id>", views.listing_view, name = "viewlisting"),
    path("view-watchlist", views.watchlist_view, name = "viewwatchlist"),
    path("add-to-watchlist/<int:listing_id>", views.add_to_watchlist, name = "addtowatchlist"),
    path("close-auction/<int:listing_id>", views.close_auction, name = "closeauction"),
    path("add-comment/<int:listing_id>", views.add_comment, name = "addcomment"),
    path("view-categories", views.categories_view, name = "categories"),
    path("view-category/<str:category>", views.category_view, name = "category")
]
