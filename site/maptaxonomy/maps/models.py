# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models


class Experiment(models.Model):
    date_conducted = models.DateTimeField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    position = models.CharField(max_length=500, null=True)
    ncbi_entry = models.URLField()
    genbank_id = models.CharField(max_length=100, null=True)
    
    def __str__(self):
        return self.position
    
    
class Author(models.Model):
    name = models.CharField(max_length=500, null=True)
    experiment = models.ForeignKey('Experiment', on_delete=models.CASCADE)
    
    def __str__(self):
        return self.name

class Strain(models.Model):
    experiment = models.ForeignKey('Experiment', on_delete=models.CASCADE)
    name = models.CharField(max_length=500)
    
    def __str__(self):
        return self.name
    

class GenomePart(models.Model):
    strain = models.ForeignKey('Strain', on_delete=models.CASCADE)
    sequence = models.CharField(max_length=10000)
    is_mobile = models.BooleanField()
    taxon = models.ForeignKey('Taxon', on_delete=models.CASCADE)
    

class Taxon(models.Model):
    name = models.CharField(max_length=500)
    commentary = models.CharField(max_length=500)
    parent = models.ForeignKey('self',null=True,blank=True)
    
    def __str__(self):
        return self.name