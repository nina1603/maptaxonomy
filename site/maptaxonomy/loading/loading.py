from urllib.request import urlretrieve
import gzip
import datetime as dt
from maps.models import Experiment, Strain

def load_file(url='ftp://ftp.ncbi.nih.gov/genomes/INFLUENZA/influenza_na.dat.gz', fname='tmp'):
    urlretrieve(url, fname)

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

def populate_db(fname='tmp'):
    with gzip.open(fname, 'r') as data:
        gen = map(lambda x: x.decode('utf8').strip('\n').split('\t'), data)
        gen = filter(lambda x: x[1]=='Human', gen)
        for line in gen:
            date = process_date(line[5])
            exp = Experiment(position=line[4], date_conducted=date, genbank_id=line[0], longitude=0, latitude=0)
            exp.save()
            strain = Strain(experiment=exp, name=line[6])
            strain.save()