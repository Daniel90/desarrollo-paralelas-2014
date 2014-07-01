function changeClass(match) {

	for ( var m in match) {
		for ( var p in match[m].position) {
			for ( var l in match[m].position[p]) {
				var i = match[m].page;
				var j = match[m].position[p][l][0];
				var k = match[m].position[p][l][1];
				$('#letra_' + i + '_' + j + '_' + k).addClass('match').removeClass('non_match');

			}
		}
	}

}

function drawPhrase(w, ruta, nombre){
	frase = '<span>'+"Se busco en:"+'</span>';
	return '<div id="frase">'+frase+'<span><a href="'+ruta+'">'+nombre+'</a></span></div>';
}

function drawTable(m, ruta){
	if(m.length == 0){
		tabla = '<tr class="tr-principal"><th class="th-principal">No se encontraron resultados</th></tr>';
	}
	else{
		tabla = '<tr class="tr-principal"><th class="th-principal">Palabra</th><th class="th-principal">Página</th><th class="th-principal">Posición(x,y)</th><th class="th-principal">Salto</th></tr>';
		for(i=0; i<m.length; i++){
			tabla = tabla + '<tr class="tr-principal"><td class="td-principal">'+m[i].word+'</td>';
			var x = parseInt(m[i].page +1);
			tabla = tabla + '<td class="td-principal"><a class="celda" href="'+ruta+"#page="+x+'">'+(m[i].page+1)+'</a></td><td class="td-principal"><table class="tabla-sec">';
			for(j=0; j<m[i].position.length; j++){
				tabla = tabla + '<tr><th class="th-sec">'+(j+1)+'</th>';
				for(k=0; k<m[i].position[j].length; k++){
					tabla = tabla + '</td><td class="td-sec">('+m[i].position[j][k]+')</td>';
				}
				tabla = tabla + '</tr>';
			}
			tabla = tabla + '</table></td><td class="td-principal">'+m[i].jump+'</td></tr>';
		}
	}
	return '<table class="tabla-principal">'+tabla+'</table>';
}

var Sheet = function(sheetId, nfilas) {
	var html = '';
	var pagina = '';
	var filas = '';
	var columnas = '';
	var row = '';
	/* formula para calcular las filas de la matriz */

	for ( var i = 0; i < nfilas; i++) {
		row = row + '<div class = "fila" id = "fila_' + i + '">'
				+ fila(sheetId, i) + '</div>';
	}

	return row;

};

function book(nfilas) {
	libro = '';
	for (i = 0; i < nfilas.length; i++) {
		libro = libro + '<div class = "hoja" id = "hoja_' + i + '">'
				+ Sheet(i, nfilas[i]) + '</div>';
	}
	return '<div class = "libro owl-carousel">' + libro + '</div>';
}

var fila = function(sheetId, i) {
	var columnas = '';
	for ( var j = 0; j < 60; j++) {
		columnas += '<div class = "letra non_match" id = "letra_' + sheetId
				+ '_' + i + '_' + j + '">' + '</div>';
	}
	return columnas;
};

function addPlot(info){
	$(function () {
        $('#performance').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'Histograma'
            },
            subtitle: {
                text: 'Frecuencia de palabras'
            },
            xAxis: {
                categories: []
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Cantidad'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: info.series
        });
    });
}

function addScatter(info){
	$(function () {
	    $('#scatter').highcharts({
	        chart: {
	            type: 'scatter',
	            zoomType: 'xy'
	        },
	        title: {
	            text: 'Tiempo de busqueda en función del largo de la palabra'
	        },
	        subtitle: {
	            text: 'Fuente: Desempeño del software del código secreto de la biblia'
	        },
	        xAxis: {
	            title: {
	                enabled: true,
	                text: 'largo de la palabra'
	            },
	            startOnTick: true,
	            endOnTick: true,
	            showLastLabel: true
	        },
	        yAxis: {
	            title: {
	                text: 'tiempo (s)'
	            }
	        },
	        legend: {
	            layout: 'vertical',
	            align: 'left',
	            verticalAlign: 'top',
	            x: 100,
	            y: 70,
	            floating: true,
	            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
	            borderWidth: 1
	        },
	        plotOptions: {
	            scatter: {
	                marker: {
	                    radius: 5,
	                    states: {
	                        hover: {
	                            enabled: true,
	                            lineColor: 'rgb(100,100,100)'
	                        }
	                    }
	                },
	                states: {
	                    hover: {
	                        marker: {
	                            enabled: false
	                        }
	                    }
	                },
	                tooltip: {
	                    headerFormat: '<b>{series.name}</b><br>',
	                    pointFormat: '{point.x} , {point.y} s'
	                }
	            }
	        },
	        series: [{name: 'costo temporal',
            color: 'rgba(223, 83, 83, .5)',
            data:info.scatter}]
	    });
	});
	    

}

function addPerformance(info){
	$(function () {
	    $('#tiempo_rank').highcharts({
	        chart: {
	            type: 'scatter',
	            zoomType: 'xy'
	        },
	        title: {
	            text: 'Tiempo de busqueda en función de la cantidad de procesadores'
	        },
	        subtitle: {
	            text: 'Fuente: Desempeño del software del código secreto de la biblia'
	        },
	        xAxis: {
	            title: {
	                enabled: true,
	                text: 'espacio entre letras asociada a la cantidad de procesadores'
	            },
	            startOnTick: true,
	            endOnTick: true,
	            showLastLabel: true
	        },
	        yAxis: {
	            title: {
	                text: 'tiempo promedio (s)'
	            }
	        },
	        legend: {
	            layout: 'vertical',
	            align: 'left',
	            verticalAlign: 'top',
	            x: 100,
	            y: 70,
	            floating: true,
	            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
	            borderWidth: 1
	        },
	        plotOptions: {
	            scatter: {
	                marker: {
	                    radius: 5,
	                    states: {
	                        hover: {
	                            enabled: true,
	                            lineColor: 'rgb(100,100,100)'
	                        }
	                    }
	                },
	                states: {
	                    hover: {
	                        marker: {
	                            enabled: false
	                        }
	                    }
	                },
	                tooltip: {
	                    headerFormat: '<b>{series.name}</b><br>',
	                    pointFormat: '{point.x} , {point.y} s'
	                }
	            }
	        },
	        series: [{name: 'costo temporal',
            color: 'rgba(223, 83, 83, .5)',
            data:info.performance}]
	    });
	});
	    

}
