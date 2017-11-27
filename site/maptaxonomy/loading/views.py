from django.shortcuts import render
from maps.models import Experiment
# Create your views here.
from django.http import HttpResponse
from .loading import load_file, populate_db
from .serializers import ExperimentSerializer
from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend

def index(request):
    if request.user.is_superuser:
        load_file()
        populate_db()
        return HttpResponse("Loaded")
    else:
        return HttpResponse("Not allowed")


class ExperimentViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Experiment.objects.all().order_by('-date_conducted')
    serializer_class = ExperimentSerializer
    filter_backends = (DjangoFilterBackend,)
    filter_fields = ('date_conducted', 'latitude', 'longitude', 'position', 'genbank_id')