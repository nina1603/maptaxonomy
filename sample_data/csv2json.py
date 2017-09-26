#!/usr/bin/python

import csv
import json
import sys

csvfile = open(sys.argv[1], 'r')
jsonfile = open(sys.argv[1]+".json", 'w')

#fieldnames = ("FirstName","LastName","IDNumber","Message")
#reader = csv.DictReader( csvfile, fieldnames)
reader = csv.DictReader(csvfile)
out = json.dumps( [ row for row in reader ],indent=4 )
jsonfile.write(out)
