# -*- coding: utf-8 -*-
'''
Created on 14-05-2014

@author: leonardo jofre
'''

from mpi4py import MPI
from time import time
from tools.stringamatriz import str2matrix
from tools.serial import get_pattern, clearMatch
from tools.parallelpdftolist import parallelpdf2string
from tools.diccionarios import lista_diccionario
import os
import commands
import json
import sys
import re
from math import floor, ceil

comm = MPI.COMM_WORLD
rank = comm.Get_rank()
master = 0

path = sys.argv[1]
words = lista_diccionario()
words = words + [w[::-1] for w in words]
regex = re.compile("|".join(words))
ncol = 60
size = comm.size

sheets = parallelpdf2string(comm=comm, path=path)

# se puede calcular el rango de saltos correspondiente a cada procesador, de
# esta manera no desperdiciar recursos, mediante una mejor estrategia de
# balanceo de la carga, esa es la última mejora en terminos de estrategia de 
# paralelizacion.

#buscamos la palabra mas corta de las que se tienen
max_len = min(map(len,words))

j = lambda x: int(ceil((floor((len(x) -max_len )/(max_len-1)) + 1)/size))


match = [[{'page':page, 'jump':r + 1, 'position':get_pattern(text=sheet, rank=r, regex=regex)}
           for r in range(rank * j(sheet), (rank + 1) * j(sheet))] for page, sheet in enumerate(sheets)]
match = sum(match, [])
match = comm.gather(match, root=master)

if rank == master:
    bible = clearMatch(match, sheets, ncol, words) 
    print json.dumps(bible)
    
