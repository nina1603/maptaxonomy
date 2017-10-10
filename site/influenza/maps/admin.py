# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

from .models import Virus, Location

admin.site.register(Virus)
admin.site.register(Location)
