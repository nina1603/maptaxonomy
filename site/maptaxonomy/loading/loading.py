from urllib.request import urlretrieve
import gzip

def load_file(url, fname):
    urllib.request.urlretrieve(url, fname)


def populate_db(fname):
    with gzip.open(fname, 'r') as data:
        gen = map(lambda x: x.decode('utf8').strip('\n').split('\t'), data)
        gen = filter(lambda x: x[1]=='Human', gen)
        for line in gen:
            pass