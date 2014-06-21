# -*- coding: utf-8 -*-
'''
Created on 14-05-2014

@author: equipo de desarrollo
'''
from tools.serial import get_pattern, clearMatch
from tools.pdftolist import pdf2string
from tools.stringamatriz import str2matrix
import json
import sys


path, words = (sys.argv[1], sys.argv[2])
words = words.split()
ncol=60 #numero de columnas de la hoja

words = words + [w[::-1] for w in words]
sheets = pdf2string(path=path)

match = [[[{'word':word, 'page':page, 'jump':rank + 1, 'position':get_pattern(text=sheet, rank=rank, word=word)}
      for page, sheet in enumerate(sheets)] for word in words ] for rank in range(10)]

match = sum(match, [])

match = clearMatch(match)

sheets = [str2matrix(text=sheet, ncol=ncol) for sheet in sheets]
nhojas = [len(s) for s in sheets]
bible = {'sheets':sheets, 'match':match, 'nhojas':nhojas, 'ncol':ncol}
print json.dumps(bible)   
# print match
