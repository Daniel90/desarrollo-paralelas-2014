# -*- coding: utf-8 -*-
'''
Created on 13-05-2014

@author: leonardo jofre

Cada texto tiene n secuencias que separan los caracteres en n espacios

referencias: para poder encontrar varias veces una palabra
http://stackoverflow.com/questions/3519565/find-the-indexes-of-all-regex-matches-in-python
'''
import time
import numpy as np
import re
from function_ordered_pair import ordered_pair
from vrcoords import vr
from coordenadas import misma_recta
from tools.stringamatriz import str2matrix
from numpy import mean

def get_pattern(text, rank, regex):
    t0 = time.time()
    """toma un texto y un rank (que dice cuantos espacios se van a av"""
    # pasarlo a un array
    text = np.array(list(text))
    # buscamos la palabra casa
    
    match = set()
    for i in range(rank + 1):
        textRank = text[np.arange(i, len(text), rank + 1)]
        textRank = "".join(textRank.tolist())
        m = [((rank + 1) * m.start(0) + i, (rank + 1) * (m.end(0) - 1) + i, m.group()) for m in re.finditer(regex, textRank)]
        m = set(m)
        # hacer la correccion del rank
         
        match = match | m
    # buscamos las coincidencias de la palabra word dentro de este string
    
    
    match = list(match)
    try:
        # buscamos las posiciones especificas de cada una de las letras
        match = [(range(m[0], m[1] + 1, rank + 1), m[2]) for m in match]
    except :
        pass
    
    # convertir todos los elementos de las listas a tuplas
    match = [([ordered_pair(n) for n in m[0]], m[1]) for m in match]     
    # eliminar todos los conjuntos de tuplas que no esten sobre la misma recta
#     if match != []:
#         # si la lista no esta vacia tiene que tener elementos sobre la misma recta
#         match = [m for m in match if misma_recta(m)]
    
    t1 = time.time()
    
    try:
        tiempo_repartido = (t1 - t0) / len(match)
    except:
        tiempo_repartido = 0
        
    match = [(m[1], m[0], tiempo_repartido) for m in match]
    return match

     
def clearMatch(match, sheets, ncol, words):
    """elimina elementos repetidos y agrega informacion adicional"""
    match = sum(match, [])

    match_temp = []
    for m in match:
        
        for n in m['position']:
            u = {}
            u['position'] = n[1]
            u['jump'] = m['jump']
            u['word'] = n[0]
            u['time'] = n[2]
            u['page'] = m['page']
            match_temp.append(u)
    
    match = match_temp
    for m in match:
        m['position'] = [m['position']]
    

    for m in match:
        m['word_lengh'] = len(m['word'])


    match = [m for m in match if m['position'] != []]
    
    sheets = [str2matrix(text=sheet, ncol=ncol) for sheet in sheets]
    nhojas = [len(s) for s in sheets]
    
    # creamos un diccionario con todas las series
    series = [{'name':w, 'data':[len([m for m in match if m['word'] == w])]} for w in words]
    
    # buscamos todos los pares ordenados entre tiempo y largo de la palabra
    scatter = [(s['word_lengh'], s['time']) for s in match]
    
    # luego de calcular el desempeño, dividimos por la cantidad de palabras encontradas antes de ese salto
    performance = [(s['jump'], s['time']) for s in match]
    
    # buscamos el tiempo promedio por cada rank
    performance = [(q[0], mean([p[1] for p in performance if p[0] == q[0]]))for q in performance]
    performance = [(p[0], p[1] / len([q for q in performance if q[0] <= p[0]])) for p in performance]
    
    info = {
             'match':match,
             'nhojas':nhojas,
             'words':words,
             }
    return info
