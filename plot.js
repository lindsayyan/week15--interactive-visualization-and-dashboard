var xhr = new XMLHttpRequest();
xhr.addEventListener("readystatechange", processRequestName, false);

xhr.open('GET', "http://127.0.0.1:5000/names", true);
xhr.send();

var xhr2 = new XMLHttpRequest();
xhr2.addEventListener("readystatechange", processRequestData, false);

var xhr3 = new XMLHttpRequest();
xhr3.addEventListener("readystatechange", processRequestOtu, false);

var xhr4 = new XMLHttpRequest();
xhr4.addEventListener("readystatechange", processRequestWFreq, false);

var xhr5 = new XMLHttpRequest();
xhr5.addEventListener("readystatechange", processRequestMeta, false);


var v;
var values;
var id;
var valuesNonZero;
var idForValuesNonZero;
var hoverText = [];      	

function getData(value){

	v=value;
	xhr2.open('GET', "http://127.0.0.1:5000/sample/"+v, true);
	xhr2.send();

	xhr4.open('GET', "http://127.0.0.1:5000/wfreq/"+v, true);
	xhr4.send();

	xhr5.open('GET', "http://127.0.0.1:5000/metadata/"+v, true);
	xhr5.send();

}


function processRequestName(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
        var response = JSON.parse(xhr.responseText);
        var select = document.getElementById ("selDataset");

	    let flag = true;
	    for(var x in response){
	    	var name = response[x];
	    	if(flag){
	    		select.options.add( new Option(name,name,true, true) );
	    		flag = false;
	    		getData(name);
	    	}
	    	else{
	    		select.options.add( new Option(name,name ));
	    	}
	    }
		
    }
}


function processRequestData(e) {
    if (xhr2.readyState == 4 && xhr2.status == 200) {
       	var response = JSON.parse(xhr2.responseText.replace(/\bNaN\b/g, "null"));
       	
       	values=response[0][v].slice(0,10)
       	id=response[0]["otu_id"].slice(0,10)

       	valuesNonZero=response[0][v].filter(x => response[0][v] != 0)
       	idForValuesNonZero=response[0]["otu_id"].filter(x => response[0][v] != 0)
       	
       	xhr3.open('GET', "http://127.0.0.1:5000/otu", true);
		xhr3.send();
    	
		
		
    }
}
		

function processRequestOtu(e) {
    if (xhr3.readyState == 4 && xhr3.status == 200) {
       	var response = JSON.parse(xhr3.responseText.replace(/\bNaN\b/g, "null"));
       	
       	for(var x in id)
       		hoverText[x] = response[id[x]];


		var data = [{
		    values: values,
		    labels: id,
		    type: 'pie',
		    text: hoverText,
		    hoverinfo: 'label+percent+text',
		    textinfo:'percent'
		}];

		var layout = {
		  	height: 500,
		  	width: 500
		};

		Plotly.newPlot('plot2', data, layout);


		id=idForValuesNonZero
		values=valuesNonZero
		
       	var colors=[]
		for(var x in id){
			colors[x]='#'+id[x];
		}

 		var trace1 = {
   			x: id,
   			y: values,
   			text: hoverText,
   			mode: 'markers',
   			marker: {
     			size: values,
     			color: colors
     			
   			}
   			
 		};

 		var data = [trace1];

 		var layout = {
  			title: 'Sample Bubble Plot',
   			showlegend: false,
   			height: 600,
   			width: 2000
 		};

 		Plotly.newPlot('plotBubble', data, layout);
       	
    }
}



function processRequestWFreq(e) {
    if (xhr4.readyState == 4 && xhr4.status == 200) {
       	var response = JSON.parse(xhr4.responseText.replace(/\bNaN\b/g, "null"));
		       	
		// Enter a speed between 0 and 180
		var level = response[0];

		// Trig to calc meter point
		var degrees = 9 - level,
		     radius = .5;
		var radians = degrees * Math.PI *20/ 180;
		var x = radius * Math.cos(radians);
		var y = radius * Math.sin(radians);

		// Path: may have to change to create a better triangle
		var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
		    pathX = String(x),
		    space = ' ',
		    pathY = String(y),
		    pathEnd = ' Z';
		var path = mainPath.concat(pathX,space,pathY,pathEnd);

		var data = [
			{ 
				type: 'scatter',
			   	x: [0], 
			   	y:[0],
			    marker: {size: 28, color:'850000'},
			    showlegend: false,
			    name: 'speed',
			    text: level,
			    hoverinfo: 'text+name'
			},
		  	{ 
		  		values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 
		  				50/9, 50/9, 50/9, 50],
		  		rotation: 90,
		  		text: ['','0-1', '1-2', '2-3', '3-4',
		            '4-5', '5-6', '6-7','7-8','8-9'].reverse(),
		  		textinfo: 'text',
		  		textposition:'inside',
		  		marker: {
		  			colors:['rgba(165,0,38,.5)', 'rgba(215,48,39,.5)',
		  			'rgba(244,109,67,.5)','rgba(253,174,97,.5)',
		  			'rgba(254,224,144,.5)','rgba(224,243,248,.5)',
		  			'rgba(171,217,233,.5)', 'rgba(116,173,209,.5)',
		  			'rgba(69,117,180,.5)','rgba(255, 255, 255, 0)']
			    },
		  		//labels: ['151-180', '121-150', '91-120', '61-90', '31-60', '0-30', ''],
			    hoverinfo: 'none',
			  	hole: .5,
			  	type: 'pie',
			  	showlegend: false
			}
		];

		var layout = {
			shapes:[{
				type: 'path',
				path: path,
				fillcolor: '850000',
				line: {
					color: '850000'
				}
			}],
			title: 'Belly Button Washing Frequency',
			titlefont: {
				family: 'Arial, bold',
				size: 30,
				color: '#7f7f7f'
			},
			height: 500,
			width: 500,
			xaxis: {zeroline:false, showticklabels:false,
				showgrid: false, range: [-1, 1]},
			yaxis: {zeroline:false, showticklabels:false,
				showgrid: false, range: [-1, 1]}
		};

		Plotly.newPlot('myDiv', data, layout);
	}
}

function processRequestMeta(e) {
    if (xhr5.readyState == 4 && xhr5.status == 200) {
       	var response = JSON.parse(xhr5.responseText.replace(/\bNaN\b/g, "null"));
		
		var div = document.getElementById('mydiv');
		div.innerHTML =''
		div.innerHTML += 'AGE: '+response["AGE"]+"<br />";
		div.innerHTML += 'BBTYPE: '+response["BBTYPE"]+"<br />";
		div.innerHTML += 'ETHNICITY: '+response["ETHNICITY"]+"<br />";
		div.innerHTML += 'GENDER: '+response["GENDER"]+"<br />";
		div.innerHTML += 'LOCATION: '+response["LOCATION"]+"<br />";
		div.innerHTML += 'SAMPLEID: '+response["SAMPLEID"]+"<br />";

	}
}
