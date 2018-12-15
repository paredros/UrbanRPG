from django.shortcuts import render

# Create your views here.
def worldnavigation(request):
    return render(request, 'cliente/navtest.html')