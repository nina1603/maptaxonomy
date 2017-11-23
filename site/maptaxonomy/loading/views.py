from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from .loading import load_file, populate_db

def index(request):
    load_file()
    populate_db()
    return HttpResponse("Loaded")