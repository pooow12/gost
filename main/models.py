from django.db import models

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=64, verbose_name='название')
class homer(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, verbose_name='категория')
    homename = models.CharField('Названия номера', max_length=40)

    def __str__(self):
        return self.homename