from django.contrib import admin
from .models import WMSLayers

# Register your models here.
class WMSLayersAdmin(admin.ModelAdmin):
    pass

admin.site.register(WMSLayers,WMSLayersAdmin)    