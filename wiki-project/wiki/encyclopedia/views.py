from xml.dom import ValidationErr
from xml.dom.minidom import CharacterData
from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.urls import reverse
import markdown2
from django import forms
from django.core.exceptions import ValidationError

from random import randint

from . import util

# /wiki
def index(request):    
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })

# /wiki/search
def search(request):
    q = request.GET["q"]
    if util.get_entry(q) != None:
        return HttpResponseRedirect(reverse("wiki:entry", args = [q]))
    entries = []
    for entry in util.list_entries():
        if q in entry:
            entries.append(entry)
    return render(request, "encyclopedia/index.html", {"entries": entries})

# /wiki/<str:title>
def get_entry(request, title):
    title = title.lower()
    entry = util.get_entry(title)
    html = markdown2.markdown(entry)

    return render(request, "encyclopedia/entry.html", {
        "title": title,
        "entry": html
    })


def validate_existence(title):
    if util.get_entry(title.lower()) != None:
        raise ValidationError("There is already a page with this title.")

class NewEntryForm(forms.Form):
    title = forms.CharField(label = "Title", validators = [validate_existence])
    content = forms.CharField(widget = forms.Textarea())

# /wiki/new
def new_entry(request):
    if request.method == "POST":
        form = NewEntryForm(request.POST)
        if form.is_valid():
            title = form.cleaned_data["title"] #request.POST["title"]
            title = title.lower()

            content = form.cleaned_data["content"] #request.POST["content"]
        
            util.save_entry(title, content)
            return HttpResponseRedirect(reverse("wiki:entry", args = [title]))
    else:
        form = NewEntryForm()
    return render(request, "encyclopedia/new-entry.html", {"form": form})

# /wiki/edit/<str:title>
def edit_entry(request, title):
    if request.method == "POST":
        content = request.POST["content"]
        util.save_entry(title, content)
        return HttpResponseRedirect(reverse("wiki:entry", args = [title]))
    
    form = NewEntryForm(initial={"title": title, "content": util.get_entry(title)})
    form.fields["title"].disabled = True
    return render(request, "encyclopedia/edit-entry.html", {"title": title, "form": form})

# /wiki/random
def random(request):
    entries = util.list_entries()
    random_entry_index = randint(0, len(entries) - 1)
    random_entry_title = entries[random_entry_index]

    return HttpResponseRedirect(reverse("wiki:entry", args = [random_entry_title]))