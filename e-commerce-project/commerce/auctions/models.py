from tkinter import CASCADE
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    pass

class Listing(models.Model):
    seller = models.ForeignKey(User, on_delete = models.CASCADE, related_name = "listings")
    observers = models.ManyToManyField(User, related_name = "observees", blank = True)

    title = models.CharField(max_length = 128)
    description = models.CharField(max_length = 1024)
    starting_bid = models.IntegerField()
    category = models.CharField(max_length = 50)
    date_time = models.DateTimeField()
    image = models.ImageField(blank = True)

    def __str__(self):
        return f"{self.title}"


class Comment(models.Model):
    listing = models.ForeignKey(Listing, on_delete = models.CASCADE, related_name = "comments")
    writer = models.ForeignKey(User, on_delete = models.CASCADE, related_name = "comments")
    
    content = models.CharField(max_length = 256)
    date_time = models.DateTimeField()

    def __str__(self):
        return f"{self.writer} => {self.listing}"

class Bid(models.Model):
    bidder = models.ForeignKey(User, on_delete = models.CASCADE)
    listing = models.ForeignKey(Listing, on_delete = models.CASCADE, related_name = "bids")
    
    amount = models.FloatField()

    def __str__(self):
        return f"{self.bidder} => {self.listing} by {self.amount}"

