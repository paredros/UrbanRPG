from django.http import JsonResponse
from django.shortcuts import render
from .models import *

# Create your views here.
def Mapeditor(request):
    #data = MapWorld.objects.filter(pk=1)[0]
    list = MapWorld.objects.all().values('pk','mapName')
    walkables = Walkables.objects.all()
    solids = Solids.objects.all()
    interactivos = Interactivos.objects.all()
    print(list)
    #return render(request, 'editor/mapeditor.html', {'mapa':data.mapData, 'mapsList':list})
    return render(request, 'editor/mapeditor.html', {'mapsList':list,
                                                     'walkables':walkables,
                                                     'solids':solids,
                                                     'interactivos':interactivos
                                                     })

def multiply(value, arg):
    return value*arg

def SaveMap(request):
    if request.method == 'POST':
        mapa = request.POST.get('mapa')
        mapSolids = request.POST.get('mapasolids')
        mapInteractivos = request.POST.get('mapainteractivos')
        mapSolidsCeil = request.POST.get('mapasolidsceil')
        mapaid = request.POST.get('id')
        print(mapa)
        response_data = {}

        #post = Post(text=post_text, author=request.user)
        #post.save()
        MapWorld.objects.filter(pk=mapaid).update(mapData=mapa, mapSolids=mapSolids, mapSolidsCeil=mapSolidsCeil, mapInteractivos=mapInteractivos)

        response_data['result'] = 'Paso!'
        #response_data['postpk'] = post.pk
        #response_data['text'] = post.text
        #response_data['created'] = post.created.strftime('%B %d, %Y %I:%M %p')
        #response_data['author'] = post.author.username

        return JsonResponse(response_data)
    else:
        return JsonResponse({'no hay nada que ver aca'})

def LoadMap(request):
    if request.method == 'POST':
        mapaId = request.POST.get('id')
        data = MapWorld.objects.filter(pk=mapaId)[0]

        response_data = {}
        response_data['result'] = 'Loaded'
        response_data['pk'] = data.pk
        response_data['mapa'] = data.mapData
        response_data['mapasolids'] = data.mapSolids
        response_data['mapasolidsceil'] = data.mapSolidsCeil
        response_data['mapainteractivos'] = data.mapInteractivos
        response_data['name'] = data.mapName

        return JsonResponse(response_data)
    else:
        return JsonResponse({'no hay nada que ver aca'})

def CreateMap(request):
    if request.method == 'POST':
        mapa = request.POST.get('mapa')
        mapSolids = request.POST.get('mapasolids')
        mapSolidsCeil = request.POST.get('mapasolidsceil')
        mapInteractivos = request.POST.get('mapainteractivos')
        name = request.POST.get('name')
        data = MapWorld.objects.create(mapName=name, mapData=mapa, mapSolids=mapSolids, mapSolidsCeil=mapSolidsCeil, mapInteractivos=mapInteractivos)

        response_data = {}
        response_data['result'] = 'Created'
        response_data['pk'] = data.pk
        response_data['mapa'] = data.mapData
        response_data['mapasolids'] = data.mapSolids
        response_data['mapasolidsceil'] = data.mapSolidsCeil
        response_data['mapainteractivos'] = data.mapInteractivos
        response_data['name'] = data.mapName

        return JsonResponse(response_data)
    else:
        return JsonResponse({'no hay nada que ver aca'})