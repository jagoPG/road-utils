# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.shortcuts import get_object_or_404, render
from django.http import Http404, HttpResponseRedirect, HttpResponse
from django.views.decorators.csrf import csrf_exempt

import datetime
from django.utils import timezone
from urllib2 import urlopen
from xml.dom import minidom
import json
from geopy.distance import vincenty

from .models import ParteCarretera
from .models import ParteAccidente
from .models import ParteAccidenteVehiculo
from .models import Incidencia

import logging
logger = logging.getLogger(__name__)

import traceback
import pytz

"""
Devolver la página index
"""
def index(request):
	return render(request, 'road_utils/index.html')

"""
Devolver la página de reporte
"""
@csrf_exempt
def reporte(request):
	return render(request, 'road_utils/reporte-carretera.html')
	
"""
Devolver la página de accidente
"""
def accidente(request):
	return render(request, 'road_utils/accidente.html')

"""
Devolver la página de tiempo
"""
def tiempo(request):
	return render(request, 'road_utils/tiempo.html')

"""
Devolver la página de avisos
"""
@csrf_exempt
def avisos(request):
	return render(request, 'road_utils/avisos.html')

"""
Recibir datos de un parte de carretera y salvar los campos recibidos de la petición POST 
en la base de datos.
"""
@csrf_exempt
def mandarReporte(request):
	if request.is_ajax():
		try:
			tmp = ParteCarretera(carretera=request.POST['carretera'], kilometro=request.POST['kilometro'], \
				sentido=request.POST['sentido'], descripcion=request.POST['descripcion'])

			tmp.save()
			
			return HttpResponse(str('200'))
		except KeyError:
			logger.debug('Error. KeyError.')	
			return HttpResponse('Error')
	else:
		logger.debug('Error. Request not AJAX.')
		raise Http404
"""
Recibir los datos de un parte de accidente y salvar los campos recibidos de la petición POST
en la base de datos.
"""		
@csrf_exempt
def mandarAccidente(request):
	logger.debug('Mandar accidente.')
	if request.is_ajax():
		try:			
			logger.debug('Guardar parte general')
			parteAcc = ParteAccidente(timestamp=request.POST['timestamp'], localizacion=request.POST['localizacion'], \
				victimas=request.POST['victimas'], danosMateriales=request.POST['danosMateriales'], \
				testigos=request.POST['testigos'])
			parteAcc.save()

			veh1 = ParteAccidenteVehiculo(parte=parteAcc, dni=request.POST['dni1'], matricula=request.POST['matricula1'], \
				matriculaRemolque=request.POST['matriculaRemolque1'], aseguradora=request.POST['aseguradora1'], \
				num_poliza=request.POST['num_poliza1'], num_carta_verde=request.POST['num_carta_verde1'], \
				circunstancias=request.POST['circunstancias1'], puntos_choque=request.POST['puntos_choque1'], \
				danos=request.POST['danos1'], observaciones=request.POST['observaciones1'])
			veh1.save()
				
			veh2 = ParteAccidenteVehiculo(parte=parteAcc, dni=request.POST['dni2'], matricula=request.POST['matricula2'], \
				matriculaRemolque=request.POST['matriculaRemolque2'], aseguradora=request.POST['aseguradora2'], \
				num_poliza=request.POST['num_poliza2'], num_carta_verde=request.POST['num_carta_verde2'], \
				circunstancias=request.POST['circunstancias2'], puntos_choque=request.POST['puntos_choque2'], \
				danos=request.POST['danos2'], observaciones=request.POST['observaciones2'])
			veh2.save()
			
			return HttpResponse(str('200'))
		except KeyError:
			logger.debug('Error. KeyError.:' + traceback.format_exc())	
			return HttpResponse('Error')
	else:
		logger.debug('Error. Request not AJAX.')
		raise Http404

"""
Hacer una petición al servidor de OpenData Euskadi sobre la previsión del tiempo de hoy. Obtener
los campos que queremos servir al cliente: temperatura y predicción del tiempo. Y detectando
el idioma del navegador devolverlo en español o en euskera. 
"""
@csrf_exempt
def obtenerTemperatura(request):
	lanCode = request.LANGUAGE_CODE
	
	if request.is_ajax():
		xml = urlopen('http://opendata.euskadi.eus/contenidos/prevision_tiempo/met_forecast_zone/opendata/met_forecast_zone.xml')
		parsed = minidom.parse(xml)
		response = []
		
		areaF = parsed.getElementsByTagName('areaForecast')
		for area in areaF:
			areaName = descr = tiempo_simbolo = tiempo_descr = temp_simbolo = temp_descr = ''
			
			# obtener nombre del area
			if lanCode == 'eu':
				areaName = area.getElementsByTagName('areaName')[0].getElementsByTagName('eu')[0].firstChild.nodeValue
			else:
				areaName = area.getElementsByTagName('areaName')[0].getElementsByTagName('es')[0].firstChild.nodeValue
			
			# comprobar que es la prediccion del dia. En cuyo caso se manda la predicción del tiempo
			# y la temperatura
			predicciones = area.getElementsByTagName('periodData')
			for prediccion in predicciones:				
				if prediccion.getAttribute('periodDay') == 'today':
					# obtener predicción de tiempo
					tiempo = prediccion.getElementsByTagName('weatherIcon')[0]
					tiempo_simbolo = tiempo.getElementsByTagName('symbolImage')[0].firstChild.nodeValue
					
					if lanCode == 'eu':
						tiempo_descr = tiempo.getElementsByTagName('descriptions')[0].getElementsByTagName('eu')[0].firstChild.nodeValue
					else:
						tiempo_descr = tiempo.getElementsByTagName('descriptions')[0].getElementsByTagName('es')[0].firstChild.nodeValue
					
					# obtener predicción de temperatura
					temperatura = prediccion.getElementsByTagName('tempIcon')[0]
					temp_simbolo = temperatura.getElementsByTagName('symbolImage')[0].firstChild.nodeValue
					
					if lanCode == 'eu':
						temp_descr = temperatura.getElementsByTagName('descriptions')[0].getElementsByTagName('eu')[0].firstChild.nodeValue
					else:
						temp_descr = temperatura.getElementsByTagName('descriptions')[0].getElementsByTagName('es')[0].firstChild.nodeValue
					
					# obtener información general
					if lanCode == 'eu':
						descr = prediccion.getElementsByTagName('forecastDescription')[0].getElementsByTagName('eu')[0].firstChild.nodeValue
					else: 
						descr = prediccion.getElementsByTagName('forecastDescription')[0].getElementsByTagName('es')[0].firstChild.nodeValue
					
			response.append({'comarca': areaName, 'iconotiempo': tiempo_simbolo, 'descripciontiempo': tiempo_descr, \
				'iconotemp': temp_simbolo, 'descripciontemp': temp_descr, 'descr': descr})
				
		return HttpResponse(json.dumps(response).replace("'", '"'))
	else:
		raise Http404

"""
Petición de búsqueda de avisos en el servidor: se busca en OpenData Euskadi y el servidor avisos del día que estén próximos
al cliente. El cliente debe mandar su posición en la petición POST. La distancia minima a la que esta el objeto es 1000 metros.
"""
@csrf_exempt
def getAviso(request):
	logger.debug('Get aviso')
	if request.is_ajax():
		resp = ''
		distance = 1000
		
		# obtener la geoposición del cliente
		latitude = request.POST['latitude']
		longitude = request.POST['longitude']
		
		# obtener avisos del repositorio de Trafikoa
		xml = urlopen('http://www.trafikoa.net/servicios/IncidenciasTDT/IncidenciasTrafikoTDTGeo')
		parsed = minidom.parse(xml)
		
		avisos = parsed.getElementsByTagName('incidenciaGeolocalizada')
		for aviso in avisos:
			timestamp = aviso.getElementsByTagName('fechahora_ini')[0].firstChild.nodeValue
			
			try:
				timestamp = datetime.datetime.strptime(timestamp, '%Y-%m-%d %H:%M:%S')
			
				if timestamp >= datetime.datetime.now() - datetime.timedelta(days=1):
					carrLat = float(aviso.getElementsByTagName('latitud')[0].firstChild.nodeValue)
					carrLong = float(aviso.getElementsByTagName('longitud')[0].firstChild.nodeValue)
					# calcular si es la incidencia más cercana
					temp_dist = vincenty((latitude, longitude), (carrLat, carrLong)).meters
						
					if temp_dist <= distance:
						distance = temp_dist
						resp = { 'tipo': aviso.getElementsByTagName('tipo')[0].firstChild.nodeValue, \
							'causa': aviso.getElementsByTagName('causa')[0].firstChild.nodeValue }
				else:
					# ignorar los registros que no estén al día
					break
			except ValueError:
				# Hay registros del OpenData que no respetan el formato y causan una exception
				# por lo que son ignorados
				pass
		
		# obtener avisos de la base de datos
		entries = Incidencia.objects.exclude(timestamp__gte=datetime.datetime.now())
		for entry in entries:
			temp_dist = vincenty((latitude, longitude), (entry.latitud, entry.longitud)).meters
			
			if temp_dist <= distance:
				distance = temp_dist
				resp = { 'tipo': entry.tipo, 'causa': entry.descripcion }
		
		return HttpResponse(json.dumps(resp).replace("'", '"'))
	else:
		raise Http404