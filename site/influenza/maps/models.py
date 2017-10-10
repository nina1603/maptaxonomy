# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

class Virus(models.Model):
    ncbi_entry = models.URLField()
    date_extracted = models.DateTimeField()
    name = models.CharField(max_length=500, default='Virus')
    
    def __str__(self):
        return self.name
    
    
class Location(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    position = models.CharField(max_length=500, null=True)
    commentary = models.CharField(max_length=500)
    date_found = models.DateTimeField()
    virus = models.ForeignKey('Virus', on_delete=models.CASCADE)
    
    def __str__(self):
        return self.position

