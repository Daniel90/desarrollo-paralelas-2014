# -*- coding: utf-8 -*-
'''
Created on 14-05-2014

@author: equipo de desarrollo
'''
from tools.serial import get_pattern
from tools.pdftolist import pdf2string
from tools.stringamatriz import str2matrix
import json
import sys

path, words = (sys.argv[1], sys.argv[2])
words = words.split()
sheets = pdf2string(path=path)
words = words + [w[::-1] for w in words]

rank = 0

match = [[{'word':word, 'page':page, 'jump':rank + 1, 'position':get_pattern(text=sheet, rank=rank, word=word)}
      for page, sheet in enumerate(sheets)] for word in words ]

match = sum(match, [])
match = [m for m in match if m['position'] != [] ]

for m in match:
    m['position'] = list(m['position'])

sheets = [str2matrix(text=sheet, ncol=60) for sheet in sheets]
nhojas = [len(s) for s in sheets]
bible = {'sheets':sheets, 'match':match, 'nhojas':nhojas}
print json.dumps(bible)   
