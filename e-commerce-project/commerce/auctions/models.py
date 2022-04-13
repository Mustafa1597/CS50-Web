from email.policy import default
from tkinter import CASCADE
from xml.dom import ValidationErr
from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import datetime

from django.db.models import Max

from django.core.exceptions import ValidationError


class User(AbstractUser):
    pass

class Listing(models.Model):
    seller = models.ForeignKey(User, on_delete = models.CASCADE, related_name = "listings")
    spectators = models.ManyToManyField(User, related_name = "watchlist", blank = True)

    title = models.CharField(max_length = 128)
    description = models.TextField(max_length = 1024)
    starting_bid = models.IntegerField()
    category = models.CharField(max_length = 50)
    date_time = models.DateTimeField(auto_now = True)
    image = models.ImageField(blank = True)

    active = models.BooleanField(default = True)

    def __str__(self):
        return f"{self.title}"


class Comment(models.Model):
    listing = models.ForeignKey(Listing, on_delete = models.CASCADE, related_name = "comments")
    writer = models.ForeignKey(User, on_delete = models.CASCADE, related_name = "comments")
    
    content = models.CharField(max_length = 256)
    date_time = models.DateTimeField(auto_now = True)

    def __str__(self):
        return f"{self.writer} => {self.listing}"


class Bid(models.Model):
    bidder = models.ForeignKey(User, on_delete = models.CASCADE)
    listing = models.ForeignKey(Listing, on_delete = models.CASCADE, related_name = "bids")
    
    amount = models.FloatField()

    def __str__(self):
        return f"{self.bidder} => {self.listing} by {self.amount}"

    def clean(self):
        if self.amount <= self.listing.starting_bid:
            raise ValidationError("your bid should be greater than the starting bid")
        if not self.listing.bids:
            if self.amount <= self.listing.bids.aggregate(current_price = Max("amount"))["current_price"]:
                raise ValidationError("your bid should be greater than the current price")
        super().clean()

