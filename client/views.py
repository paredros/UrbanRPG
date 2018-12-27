from django.shortcuts import render
from world.models import *
from random import randint
import json

# Create your views here.
def worldnavigation(request):
    data = MapWorld.objects.first()
    walkables = Walkables.objects.all()
    solids = Solids.objects.all()
    interactivos = Interactivos.objects.all()

    mapa = json.loads(data.mapData)
    scriptsinteractivos = json.dumps(json.loads(data.scriptInteractivos))
    print(mapa[0][0])
    height=len(mapa)
    width=len(mapa[0])
    e=False
    props = {'x':0,
             'y':0,
             'width':width,
             'height':height
             }
    while e==False:
        x = randint(0, width-1)
        y = randint(0, height-1)
        if mapa[y][x] == 1:
            props["x"]=x
            props["y"] = y
            e=True

    return render(request, 'cliente/navtest.html', {'map':data.mapData,
                                                    'props':props,
                                                    'mapsolids':data.mapSolids,
                                                    'mapsolidsceil':data.mapSolidsCeil,
                                                    'mapinteractivos':data.mapInteractivos,
                                                    'scriptinteractivos':scriptsinteractivos,
                                                    'walkables': walkables,
                                                    'solids': solids,
                                                    'interactivos': interactivos
                                                    })