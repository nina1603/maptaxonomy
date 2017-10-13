# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

from .models import Experiment, Author, Taxon, GenomePart, Strain

admin.site.register(Experiment)
admin.site.register(Author)
admin.site.register(Taxon)
admin.site.register(GenomePart)
admin.site.register(Strain)
