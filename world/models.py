from django.db import models
from jsonfield import JSONField
#from jsoneditor.fields.django_json_field import JSONField

# Create your models here.
class TestModel(models.Model):
    the_json = JSONField()

class MapWorld(models.Model):
    mapName = models.CharField(max_length=255)
    mapData = models.TextField(null=True, blank=True)