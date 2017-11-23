from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from .loading import load_file, populate_db

def index(request):
    if request.user.is_superuser:
        load_file()
        populate_db()
        return HttpResponse("Loaded")
    else:
        return 'Not allowed'