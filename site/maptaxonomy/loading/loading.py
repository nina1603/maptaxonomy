from urllib.request import urlretrieve
import gzip
import datetime as dt
from maps.models import Experiment, Strain
import geocoder
import re

def load_file(url='ftp://ftp.ncbi.nih.gov/genomes/INFLUENZA/influenza_na.dat.gz', fname='tmp'):
    urlretrieve(url, fname)


def extract_descr(row):
    for column in row:
        if column.lower().find('virus') != -1:
            return column
    return None


def extract_info(descr):
    if descr is None:
        return None
    info = re.findall('\(.*\)', descr)
    if info:
        return info[0]
    else:
        return None


def process_date(date):
    count = date.count('/')
    try:
        if count == 2:
            return dt.datetime.strptime(date, '%Y/%m/d')
        elif count == 1:
            return dt.datetime.strptime(date, '%Y/%m')
        else:
            return dt.datetime.strptime(date, '%Y')
    except:
        return dt.date(1, 1, 1)


def extract_coords(position, coords):
    if position is not None:
        if position in coords:
            print('Using saved coords...')
            lat, lng = coords[position]
        else:
            print('Using Google Maps api...')
            try:
                lat, lng = geocoder.google(position).latlng
                coords.update({position: (lat, lng)})
            except:
                lat, lng = 0, 0
    else:
        lat, lng = 0, 0
    return lat, lng


def populate_db(fname='tmp'):
    coords = {}
    with gzip.open(fname, 'r') as data:
        gen = map(lambda x: x.decode('utf8').strip('\n').split('\t'), data)
        gen = filter(lambda x: x[1]=='Human', gen)
        for line in gen:
            date = process_date(line[5])
            info = extract_info(extract_descr(line))
            position = info.split('/')[1] if info is not None else None
            lat, lng = extract_coords(position, coords)
            exp = Experiment(position=str(position), date_conducted=date, genbank_id=line[0], longitude=lat, latitude=lng)
            exp.save()
            strain = Strain(experiment=exp, name=line[7])
            strain.save()
