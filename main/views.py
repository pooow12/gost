from django.shortcuts import render
from .models import homer
# Create your views here.
def index(request):
    homess = homer.objects.all()
    return render(request,'main/index.html',{'homess':homess})