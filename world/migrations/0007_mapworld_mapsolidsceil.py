# Generated by Django 2.1.4 on 2018-12-25 17:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('world', '0006_mapworld_mapsolids'),
    ]

    operations = [
        migrations.AddField(
            model_name='mapworld',
            name='mapSolidsCeil',
            field=models.TextField(blank=True, null=True),
        ),
    ]
