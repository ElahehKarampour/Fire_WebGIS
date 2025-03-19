from django.shortcuts import render,redirect
from django.contrib.auth.decorators import login_required
from .models import WMSLayers
from .forms import NewUserForm


from django.http import JsonResponse


@login_required(login_url='/accounts/login/')
def home_page(request):
     return render(request,'index.html')

from django.contrib.auth import login

def register(request):
    if request.method=='GET':
        form = NewUserForm()
        return render(request,'registration/register.html', context={'register_form':form})
    elif request.method == 'POST':
        form = NewUserForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request,user)
            return redirect('/')
        else:
            return redirect('/register')


#get wms layers
@login_required(login_url='/accounts/login/')
def getWMSLayers(request):
    wms_layers = WMSLayers.objects.filter(user=request.user)
    return JsonResponse(list(wms_layers.values()), safe = False)


@login_required(login_url='/accounts/login/')
def dashboard_view(request):
    return render(request, 'dashboard.html')

@login_required(login_url='/accounts/login/')
def guidance(request):
    return render(request, 'guidance.html')

@login_required(login_url='/accounts/login/')
def about(request):
    return render(request, 'about.html')

@login_required(login_url='/accounts/login/')
def space(request):
    return render(request, 'space.html')