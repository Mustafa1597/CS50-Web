from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.db.models import Max
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.forms import ModelForm, Textarea
from datetime import datetime
from django import forms
from django.http import HttpResponseRedirect
from django.urls import reverse

from django.contrib.auth.decorators import login_required

from .models import User, Listing, Comment, Bid


def index(request):
    return render(request, "auctions/index.html", {
            "listings": Listing.objects.filter(active = True)
            .annotate(current_price = Max("bids__amount"))
            .order_by("date_time")
        })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("auctions:index"))
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("auctions:index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("auctions:index"))
    else:
        return render(request, "auctions/register.html")

class ListingForm(ModelForm):
    class Meta():
        model = Listing
        exclude = ["seller", "spectators", "date_time"]
        widgets = {
            "description": Textarea(attrs = {"rows": 5})
        }


@login_required
def create_listing(request):
    if request.method == "POST":
        modelform = ListingForm(request.POST)
        if modelform.is_valid():
            listing = modelform.save(commit = False)
            listing.seller = request.user
            listing.save()
            return HttpResponseRedirect(reverse("auctions:index"))
        else:
            return render(request, "autctions/create-listing.html", {"form": modelform})
    else:
        form = ListingForm()
        return render(request, "auctions/create-listing.html", {"form": form})

class BidForm(ModelForm):
    class Meta:
        model = Bid
        fields = ["amount"]
        widgets = {
            "amount": forms.NumberInput(attrs = {"placeholder": "Bid"})
        }

class CommentForm(ModelForm):
    class Meta:
        model = Comment
        fields = ["content"]
        widgets = {
            "content": forms.Textarea(attrs = {
                "placeholder": "Write a comment...",
                "cols": 50,
                "rows": 5
            })
        }

def listing_view(request, listing_id):
    listing = Listing.objects.get(pk = listing_id)
    if not listing.active:
        max_bid = listing.bids.aggregate(max_bid = Max("amount"))
        winner = listing.bids.get(amount = max_bid.get("max_bid")).bidder
        message = "Auction has Closed"
        if request.user == winner:
            message += ", You Are The Winner"
        return render(request, "auctions/listing.html", {
            "message": message
        })

    bidform = BidForm()
    commentform = CommentForm()
    if request.method == "POST":
        if request.user.is_authenticated:
            bidform = BidForm(request.POST)
            bidform.instance.bidder = request.user
            bidform.instance.listing = Listing.objects.get(pk = listing_id)
            if bidform.is_valid():
                bidform.save()
                return HttpResponseRedirect(reverse("auctions:viewlisting", args = [listing_id]))
        else:
            return HttpResponseRedirect(reverse("auctions:login"))
            
    return render(request, "auctions/listing.html", {
        "listing": Listing.objects.annotate(current_price = Max("bids__amount")).get(pk = listing_id),
        "comments": Listing.objects.get(pk = listing_id).comments.all(),
        "bidform": bidform,
        "commentform": commentform
    })

@login_required
def watchlist_view(request):
    return render(request, "auctions/watchlist.html", {
        "watchlist": User.objects.get(pk = request.user.id).watchlist.all()
    })

def add_to_watchlist(request, listing_id):
    if request.user.is_authenticated:
        listing = Listing.objects.get(pk = listing_id)
        User.objects.get(pk = request.user.id).watchlist.add(listing)
        return HttpResponseRedirect(reverse("auctions:viewwatchlist"))
    else:
        return HttpResponseRedirect(reverse("auctions:login"))

def close_auction(request, listing_id):
    Listing.objects.filter(pk = listing_id).update(active = False)
    return HttpResponseRedirect(reverse("auctions:viewlisting", args = [listing_id]))

@login_required
def add_comment(request, listing_id):
    if request.method == "POST":
        commentform = CommentForm(request.POST)
        if commentform.is_valid():
            comment = commentform.save(commit = False)
            comment.listing = Listing.objects.get(pk = listing_id)
            comment.writer = request.user
            comment.save()
        return HttpResponseRedirect(reverse("auctions:viewlisting", args = [listing_id]))

def categories_view(request):
    return render(request, "auctions/categories.html", {
        "categories": Listing.objects.values_list("category", flat = True).distinct().all()
    })

def category_view(request, category):
    return render(request, "auctions/category.html", {
        "listings": Listing.objects.filter(category = category)
        .filter(active = True)
        .all()
    })