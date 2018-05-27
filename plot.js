var xhr = new XMLHttpRequest();
xhr.open('GET', "http://127.0.0.1:5000/names", true);
xhr.send();
 
xhr.addEventListener("readystatechange", processRequestName, false);

function processRequestName(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
        // time to partay!!!
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

var xhr2 = new XMLHttpRequest();
xhr2.addEventListener("readystatechange", processRequestData, false);
var v;
function getData(value){

	v=value;
	xhr2.open('GET', "http://127.0.0.1:5000/sample/"+value, true);
	// alert("http://127.0.0.1:5000/sample/"+value)
	xhr2.send();

}

function processRequestData(e) {
    if (xhr2.readyState == 4 && xhr2.status == 200) {
       var response = JSON.parse(xhr2.responseText);
       var values=response[0][v]
       var id=response[0]["otu_id"]
       //alert(id)
	}

	var data = [{
	  values: values,
	  labels: id,
	  type: 'pie'
	}];

	var layout = {
	  height: 500,
	  width: 500
	};

	Plotly.newPlot('plot', data, layout);
}

