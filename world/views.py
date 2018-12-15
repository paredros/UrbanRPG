from django.http import JsonResponse
from django.shortcuts import render
from .models import *

# Create your views here.
def Mapeditor(request):
    data = MapWorld.objects.filter(pk=1)[0]
    print(data.mapData)
    return render(request, 'editor/mapeditor.html', {'mapa':data.mapData})

def multiply(value, arg):
    return value*arg

def SaveMap(request):
    if request.method == 'POST':
        mapa = request.POST.get('mapa')
        print(mapa)
        response_data = {}

        #post = Post(text=post_text, author=request.user)
        #post.save()
        MapWorld.objects.filter(pk=1).update(mapData=mapa)

        response_data['result'] = 'Paso!'
        #response_data['postpk'] = post.pk
        #response_data['text'] = post.text
        #response_data['created'] = post.created.strftime('%B %d, %Y %I:%M %p')
        #response_data['author'] = post.author.username

        return JsonResponse(response_data)
    else:
        return JsonResponse({'no hay nada que ver aca'})