# -*- coding: utf-8 -*-
from django.conf.urls import url
from . import views

urlpatterns = [
	url(r'^reporte/$', views.reporte, name='reporte'),
	url(r'^accidente/$', views.accidente, name='accidente'),
	url(r'^index/$', views.index, name='index'),
	url(r'^tiempo/$', views.tiempo),
	url(r'^avisos/$', views.avisos),
	url(r'^mandarreporte$', views.mandarReporte),
	url(r'^mandaraccidente$', views.mandarAccidente),
	url(r'^obtenertemperatura$', views.obtenerTemperatura),
	url(r'^getaviso$', views.getAviso),
	url(r'^$', views.index, name='index'),
]