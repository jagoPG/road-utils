# -*- coding: utf-8 -*-
from django.contrib import admin
from django import forms

# Register your models here.
from .models import Incidencia
from .models import ParteCarretera
from .models import ParteAccidenteVehiculo
from .models import ParteAccidente

class IncidenciaAdmin(admin.ModelAdmin):
	list_display = ('tipo', 'nivel', 'descripcion', 'timestamp', 'carretera', 'kilometro', 'sentido', 'latitud', 'longitud', 'matricula')
	
	def was_published_recently(self):
		return self.timestamp >= timezone.now() - datetime.timedelta(days=1)
		
class ParteCarreteraAdmin(admin.ModelAdmin):
	list_display = ('timestamp', 'carretera', 'kilometro', 'sentido', 'descripcion')

	def has_add_permission(self, request):
		return False

class ParteAccidenteVehiculoInline(admin.StackedInline):
	model = ParteAccidenteVehiculo
	extra = 2
	fieldsets = [
		('Datos del vehículo', 	{'fields': ['dni', 'matricula', 'matriculaRemolque']}),
		('Aseguradora',			{'fields': ['aseguradora', 'num_poliza', 'num_carta_verde']}),
		('Circunstancias',		{'fields': ['circunstancias', 'puntos_choque', 'danos', 'observaciones']}),
	]

class ParteAccidenteAdmin(admin.ModelAdmin):
	inlines = [ ParteAccidenteVehiculoInline ]
	fieldsets = [
		('Datos generales', 	{'fields': ['timestamp', 'localizacion', 'victimas', 'danosMateriales', 'testigos']}),	
	]
	
	
#	def has_add_permission(self, request):
#		return False

admin.site.register(Incidencia, IncidenciaAdmin)
admin.site.register(ParteCarretera, ParteCarreteraAdmin)
admin.site.register(ParteAccidente, ParteAccidenteAdmin)