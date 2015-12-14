# -*- coding: utf-8 -*-
from django.db import models
from datetime import datetime

"""
Una incidencia es un evento extraordinario que se da en la carretera, así como obras
algun evento deportivo, proyecto, etc.
"""
class Incidencia(models.Model):
	tipo = models.CharField('Tipo', max_length=40)
	nivel = models.CharField('Nivel', max_length=15)
	descripcion = models.CharField('Descripción', max_length=255)
	latitud = models.FloatField('Latitud', default=0, blank=True)
	longitud = models.FloatField('Longitud', default=0, blank=True)
	carretera = models.CharField('Carretera', max_length=50)
	kilometro = models.IntegerField('Kilómetro', default=0)
	sentido = models.CharField('Sentido', max_length=100, blank=True)
	matricula = models.CharField('Matricula', max_length=20, blank=True)
	timestamp = models.DateTimeField('Fecha')
	
	def __str__(self):
		return "(" + self.timestamp.strftime('%d/%m/%y') + " " + \
			str(self.timestamp.hour) + ":" + str(self.timestamp.minute) + ") " + \
			self.tipo
"""	
Reporte sobre un tramo en la carretera con algun tipo de defecto
"""
class ParteCarretera(models.Model):
	kilometro = models.IntegerField('Kilómetro', default=0)
	carretera = models.CharField('Carretera', max_length=50)
	sentido = models.CharField('Sentido', max_length=100, blank=True)
	descripcion = models.CharField('Descripción', max_length=255)
	timestamp = models.DateTimeField('Fecha', auto_now_add=True)
	
	def __str__(self):
		return self.carretera + " (Km.: " + str(self.kilometro) + ") en " + str(self.timestamp) 

"""
Informe completo de un accidente entre vehiculos
""" 
class ParteAccidente(models.Model):
	timestamp = models.DateTimeField('Fecha')
	localizacion = models.CharField('Localización', max_length=100)
	victimas = models.BooleanField('Víctimas', default=False)
	danosMateriales = models.CharField('Daños materiales', max_length=100, blank=True)
	testigos = models.CharField('Testigos', max_length=200, blank=True)
	
	def __str__(self):
		return "(" + self.timestamp.strftime('%d/%m/%y') + " " + \
			str(self.timestamp.hour) + ":" + str(self.timestamp.minute) + ") " + self.localizacion

"""		
Parte de un vehiculo. Este modelo forma parte de un parte de accidentes.
"""
class ParteAccidenteVehiculo(models.Model):
	parte = models.ForeignKey(ParteAccidente)
	dni = models.CharField('dni', max_length=9)
	matricula = models.CharField('matricula', max_length=20)
	matriculaRemolque = models.CharField('Matricula remolque', max_length=20, blank=True)
	aseguradora = models.CharField('Aseguradora', max_length=30)
	num_poliza = models.CharField('# de poliza', max_length=30)
	num_carta_verde = models.CharField('# de carta verde', max_length=30, blank=True)
	circunstancias = models.CharField('Circunstancias', max_length=500)
	puntos_choque = models.CharField('Puntos de choque', max_length=200)
	danos = models.CharField('Daños', max_length=200)
	observaciones = models.CharField('Observaciones', max_length=200, blank=True)
	
	def __str__(self):
		return self.dni + "-" + self.matricula