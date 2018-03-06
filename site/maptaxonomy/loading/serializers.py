from maps.models import Experiment
from rest_framework import serializers

class ExperimentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Experiment
        fields = ('date_conducted', 'latitude', 'longitude', 'position', 'genbank_id')
