from django.db import models
from django.contrib.auth import get_user_model

class WMSLayers(models.Model):
    alias = models.CharField(max_length=100,null=False)
    name = models.CharField(max_length=100,null=False)
    url = models.URLField(null=False)
    user = models.ManyToManyField(get_user_model())
