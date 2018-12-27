from django.contrib import admin
from .models import *
#from json_field import JSONField
from jsoneditor.forms import JSONEditor

# Register your models here.


class TestModelAdmin(admin.ModelAdmin):
    formfield_overrides = {
        JSONField:{ 'widget':JSONEditor },
    }

admin.site.register(TestModel,TestModelAdmin)

admin.site.register(MapWorld)
admin.site.register(Walkables)
admin.site.register(Solids)
admin.site.register(Interactivos)