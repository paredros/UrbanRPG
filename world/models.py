from django.db import models
from jsonfield import JSONField
#from jsoneditor.fields.django_json_field import JSONField

# Create your models here.
class TestModel(models.Model):
    the_json = JSONField()

class MapWorld(models.Model):
    mapName = models.CharField(max_length=255)
    mapData = models.TextField(null=True, blank=True)

class Walkables(models.Model):
    name = models.CharField(max_length=255)
    isWalkable = models.BooleanField(default=False)
    #como afecta la velocidad del que lo camina
    velocity = models.FloatField(default=1)
    colorId = models.CharField(max_length=255, blank=True)
    #effect va a ser un json, asi es realmente dinamico
    effects = models.TextField(null=True, blank=True)
    #transform va a ser un json
    #un walkable se puede transformar y cambiar de tipo al contacto
    #o al pasaro cierto tiempo
    transform = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name

SOLID_CHOICES = (
    ("FLOOR", "Floor"),
    ("WALL", "Wall"),
    ("CEIL", "Ceil")
)

class Solids(models.Model):
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=30,choices=SOLID_CHOICES,default="WALL")
    imgBase = models.ImageField(upload_to='textures/', null=True)

