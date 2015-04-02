
function initialize() {

$('#map-canvas').css('height', '100%').css('height', '-=42px');
$('#scelta').css('height', '100%').css('height', '-=42px');
$('#scelta_posizione').css('height', '100%').css('height', '-=42px');

	//Crea mappa
	  var myLatlng = new google.maps.LatLng(38.114353, 13.355992);
	  var mapOptions = {
	/*	  mapTypeControl: true,
		  mapTypeControlOptions: {
			position: google.maps.ControlPosition.RIGHT_CENTER
		   },
		  panControl: true,
		  panControlOptions: {
			position: google.maps.ControlPosition.LEFT_CENTER
		   },
		  zoomControl: true,
		  zoomControlOptions: {
			style: google.maps.ZoomControlStyle.SMALL,
			position: google.maps.ControlPosition.LEFT_CENTER
		},*/
		zoom: 14,
		center: myLatlng
		
	  }
	  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	  
	  
	//Crea marker centrale
	  markerHere = new google.maps.Marker({
		  position: myLatlng,
		  map: map,
		  title: 'AppPalermo!',
		  draggable:true,
		  icon: image
	  });
	google.maps.event.addListener(markerHere, 'dragend', function() { drag_marker_stop(); });  
	  
	//AUTOCOMPLETE START


	  // Create the search box and link it to the UI element.
	  var input = /** @type {HTMLInputElement} */(
		  document.getElementById('pac-input'));
	  //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

	  var searchBox = new google.maps.places.SearchBox(
		/** @type {HTMLInputElement} */(input));

	  // Listen for the event fired when the user selects an item from the
	  // pick list. Retrieve the matching places for that item.
	  google.maps.event.addListener(searchBox, 'places_changed', function() {
		$( "#scelta_posizione" ).hide();
		var places = searchBox.getPlaces();
		place = places[0]
		markerHere.setPosition(place.geometry.location);
		map.setCenter(place.geometry.location);
	  });
	 
	  
	  // Bias the SearchBox results towards places that are within the bounds of the
	  // current map's viewport.
	  google.maps.event.addListener(map, 'bounds_changed', function() {
		var bounds = map.getBounds();
		searchBox.setBounds(bounds);
	  });
	  //AUTOCOMPLETE END
		
		
	//Carica Json in variabile	

	$.getJSON("data/turismo01.json", function(data) {
		$.each(data, function(k,obj){
			$.each(obj, function(j, objj){
			//alert(objj.Latitude + " - " + objj.Longitude );
				dict_turismo01[objj.ID] = {"lat" : objj.Latitude, "lng": objj.Longitude};			
			});
		});
	});	
		
	//leggi_xml();
		
	$.getJSON("data/turismo03.json", function(data) {
		$.each(data, function(k,obj){
			$.each(obj, function(j, objj){
			//alert(objj.Latitude + " - " + objj.Longitude );
				dict_turismo03[objj.ID] = {"lat" : objj.Latitude, "lng": objj.Longitude};			
			});
		});
	});	
		
	//leggi_xml03();	
}

function scelta(id_scelta){
	markerHere.setDraggable(true);
	var id = id_scelta; //$(id_scelta).attr( "id" );
	if(id == "panav_btn"){
		$( "#scelta" ).show();
		$( "#scelta_posizione" ).hide();
	}
	else if(id=="dovedormire"){
		$( "#scelta" ).hide();
		clear_markers();
		//alert('dove2');
		if(back_to[back_to.length-1]!="dovedormire"){
			back_to.push("dovedormire");
			$("#temp").html(back_to.join("\\"));
		}
		leggi_xml();	
	}
	else if(id=="cosavedere"){
		$( "#scelta" ).hide();
		clear_markers();
		if(back_to[back_to.length-1]!="cosavedere"){
			back_to.push("cosavedere");
			$("#temp").html(back_to.join("\\"));
		}
		leggi_xml03();	
	}
	else if(id == "notiziebtn"){
		$( "#scelta" ).hide();
		twitter();
	}
	else if(id == "posizione"){
		$( "#scelta" ).hide();
		$( "#scelta_posizione" ).show();
	}
	else if(id == "help"){
		$( "#scelta" ).hide();
		if(back_to[back_to.length-1]!="help"){
			back_to.push("help");
			$("#temp").html(back_to.join("\\"));
		}
		help();
	}
	
}

/*
function showOverlays(){

	for (var i=0; i<selectedGruppo.length; i++){
		var servizi = dict_servizi[selectedGruppo[i]];
		//alert(selectedGruppo[i]);
		//ciclabili
		if (selectedGruppo[i] == "ciclabili"){
			
			
			for (var j=0; j<servizi.length; j++){
				
				
				var obj = servizi[j];
				
				if(obj.geometry.type == "LineString"){
					obj.geometry.coordinates = [obj.geometry.coordinates];
					obj.geometry.type = "MultiLineString";
				}				
				
				var multilinestring = obj.geometry.coordinates;
				
				for(var l=0; l<multilinestring.length; l++){
				
					var linestring = multilinestring[l];
					var pistaCiclabile = [];
					for(var p=0; p<linestring.length; p++){
						
						var point = linestring[p];
						var lon = point[0];
						var lat = point[1];
						var latLng = new google.maps.LatLng(lat, lon);
						//if(pistaCiclabile[pistaCiclabile.length] != latLng){
							pistaCiclabile.push(latLng);
						//}		
					}
					var polyline = new google.maps.Polyline({
						path: pistaCiclabile,
						geodesic: true,
						strokeColor: '#FF0000',
						strokeOpacity: 1.0,
						strokeWeight: 2,
						map: map
					});

					markers.push(polyline);
					pistaCiclabile = [];						

				}

				//alert(obj.id);
			}
		} else {
		
			for (var j=0; j<servizi.length; j++){
					var obj = servizi[j];					
					var nome = obj.properties.nome;	
					var lon = obj.geometry.coordinates[0];
					var lat = obj.geometry.coordinates[1];
					//alert(lat + "-" + lon);
					var latLng = new google.maps.LatLng(lat, lon);
					
					
					var infosupp; 
					
					for(key in obj.properties){
					
	switch(key){
	case 'tipo':
		infosupp = obj.properties.tipo;
		break;
	case 'desc':
		infosupp = obj.properties.desc;
		break;
	default:
		infosupp = "";
	}				
	
					}
					
					
					var marker = new google.maps.Marker({
						position: latLng,
						map: map,
						title: nome,
						infosupp: infosupp,
						icon: icons[selectedGruppo[i]]
					});
								
					google.maps.event.addListener(marker, 'click', function() {
						marker_selected = this;					
						mostra_dettagli(this);
					});
					
					markers.push(marker);
			}
		}
	}	
}
*/

/*
function AddToSelectedGruppo(gruppo){

	var selectedcolor = "rgb(255, 194, 102)";
	var color = $(gruppo).css( "background-color" );
	var id = $(gruppo).attr( "id" );
	
	
    if(color != selectedcolor){
		$(gruppo).css( "background-color", "rgb(255, 194, 102)" );
		selectedGruppo.push(id); //inserisce in array
	} else {
		var a = selectedGruppo.indexOf(id); 
		selectedGruppo.splice(a,1); // rimuove da array 
		$(gruppo).css( "background-color", "" ); 
	}
	clear_markers();
	showOverlays();
	
}
*/

function clear_markers(){
		for (var i = 0; i < elem_percorso.length; i++) {
			elem_percorso[i].setMap(null);
		}
		elem_percorso = [];

		for(var i=0; i<markers.length; i++){ 
			markers[i].setMap(null);	
		}
		markers = [];
}

function pulisci(){
	selectedGruppo = [];
	$("#servizi button").css( "background-color", "" ); 
	//AddToSelectedGruppo();
	clear_markers();
}


/*
function posizione(){
	$( "#menuscelta" ).hide();
	$( "#posizione" ).show();
}
*/

function drag_marker_stop(){
	posHere = markerHere.position;
	map.setCenter(posHere);
	if(back_to[back_to.length-1]=="percorso"){
		percorso();
	}

}

function geolocation(){
	$( "#scelta_posizione" ).hide();

  // Try HTML5 geolocation
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);

     markerHere.setPosition(pos);
      map.setCenter(pos);
	if(back_to[back_to.length-1]!="posizione"){
		back_to.push("posizione");
		$("#temp").html(back_to.join("\\"));
	}
    }, function() {
	//alert('no geo');
      handleNoGeolocation(true);
    }, { enableHighAccuracy: true });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }
}

function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

 initialize();
/*
  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
*/
}

/*
function noposition(){
	$( "#scelta" ).show();
	$( "#scelta_posizione" ).hide();
	//chiudi();
}
*/

function twitter(){
	$("#content_info").remove();
	$( ".container_info" ).show();
	$( ".info" ).show();
	var p = "<div id=\"content_info\">";
	p += "<a class=\"twitter-timeline\" height=\"" + $('#content_info').height() + "\" href=\"https://twitter.com/ComunePalermo\"  data-widget-id=\"453898198050820096\">Tweets di @ComunePalermo</a>";
	p += "<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+\"://platform.twitter.com/widgets.js\";fjs.parentNode.insertBefore(js,fjs);}}(document,\"script\",\"twitter-wjs\");</script>";
	p += "</div>";
	$( ".info" ).append( p );
	
}


function help(){
	$("#content_info").remove();
	$( ".container_info" ).show();
	$( ".info" ).show();
	var p = "<div id=\"content_info\">";
	p += "<h1>DOVE DORMIRE</h1><p>Scegliendo questa voce del menu vedrai indicati sulla mappa i posti in cui è possibile dormire a Palermo (Hotel, B&B, Residence, ecc..).Selezionando un singolo marker appariranno le informazioni di dettaglio dello stesso (numero di telefono, indirizzo, descrizione, classificazione, ecc..).Sarà inoltre possibile calcolare il percorso, a piedi o in auto, per raggiungere il luogo selezionato (vedi \"MIA POSIZIONE\"). Potrai inoltre condividire le coordinate del luogo scelto sui social network (Facebook e Google+).</p><h1>COSA VEDERE</h1><p>Scegliendo questa voce del menu vedrai indicati sulla mappa i luoghi di interesse di Palermo (chiese, biblioteche, monumenti, ecc..).Selezionando un singolo marker appariranno le informazioni di dettaglio dello stesso (numero di telefono, indirizzo, descrizione, sito web, ecc..).Sarà inoltre possibile calcolare il percorso, a piedi o in auto, per raggiungere il luogo selezionato (vedi \"MIA POSIZIONE\"). Potrai inoltre condividire le coordinate del luogo scelto sui social network (Facebook e Google+).</p><h1>NOTIZIE</h1><p>In questa sezione potrai leggere e commentare i twitts ufficiali del Comune di Palermo aggiornati in tempo reale.</p> <h1>MIA POSIZIONE</h1> <p>Di default la tua posizione è definita nel centro di Palermo.In questa sezione potrai scegliere se far riconoscere dall'app la tuo reale posizione (tramite GPS) o sceglierne una manualmente scrivendo l'indirizzo nel campo apposito.In questo modo potrai calcolare i percorsi per raggiungere un hotel o un monumento esattamente dal luogo in cui ti trovi.</p>";	
	p += "</div>";
	$( ".info" ).append( p );
	
}




function mostra_dettagli(){
	if(back_to[back_to.length-1]!="mostra_dettagli"){
		back_to.push("mostra_dettagli");
		$("#temp").html(back_to.join("\\"));
	}
	$("#content_info").remove();
	$( ".container_info" ).show();
	$( ".info" ).show();
	//$('.info').empty()
	var p = "<div id=\"content_info\">";
	
	p += marker_selected.contentString;
	
	//p += "<h3>Calcola percorso fino a qui:</h3>";
	
	//p += "<div id=\"infofoot\">";
	
	p += "<p style=\"background:#FFD4EA; border-top:1px solid #fff; \"><lable class=\"tipo\">Calcola percorso fino a qui:</lable><br/><a href=\"javascript:modo=\'piedi\';percorso();\"><img src=\"img/Vettoriali/uomo_cammina50.png\"  /></a>";
	p += "<a href=\"javascript:modo=\'auto\';percorso();\"><img src=\"img/Vettoriali/car50.png\"  /></a></p>";
	
	//p += "<div id=\"share\">";
	//p += "<div class=\"g-plusone\" data-href=\"http://opengisitalia.it/panav/\" data-size=\"medium\" data-annotation=\"none\"></div>";
	//p += "<br>";
	//p += "<div class=\"fb-like\" data-href=\"http://opengisitalia.it/panav/\" data-layout=\"button\" data-action=\"like\" data-show-faces=\"false\" data-share=\"flase\"></div><br>";
	//p += "<a href=\"javascript:share_facebook()\"><img class=\"imgshare\" style=\"margin-bottom:20px\" src=\"img/Vettoriali/share50.png\"></a>";

	//p += "</div>";

	p += "</div>";

	//var orig = map.getCenter();
	//var dest = marker_selected.getPosition();
	//var url = "percorso.html?lat1=" + orig.lat() + "&lon1=" + orig.lng() + "&lat2=" + dest.lat() + "&lon2=" + dest.lng() + "&mode=";
	


	$( ".info" ).append( p );


	//FB.XFBML.parse($('#share').get(0));

	//gapi.plusone.go("share");

}

function share_facebook(){
	var title = marker_selected.title;
	var icon = marker_selected.icon; //'http://opengisitalia.it/panav/' + marker_selected.icon;
	var pos = marker_selected.getPosition();
	
	var gmaps = "http://maps.google.com/maps?z=15&t=m&q=loc:" + pos.lat() + "+" + pos.lng();
	FB.ui({
		method: 'feed',
		name: title,
		link: 'http://opengisitalia.it/panav/',
		picture: icon,
		caption: 'Palermo',
		actions: [
			{ name: 'See in Gmaps', link: gmaps }
	    ]
	}, function(response){});
}


function leggi_xml(){

	if (window.XMLHttpRequest)
	  {// code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttp=new XMLHttpRequest();

	  }
	else
	  {// code for IE6, IE5
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	  }
	xmlhttp.open("GET","data/VIS_DATASET_TURISMO01.xml",false);
	xmlhttp.send();
	xmlDoc = xmlhttp.responseXML;
	var x = xmlDoc.getElementsByTagName("DATA_RECORD");

	for (var i=0;i<x.length;i++){

		var ID = x[i].getElementsByTagName("ID")[0].childNodes[0].nodeValue;
		//alert(ID);
		if(ID in dict_turismo01){
			dict_turismo01[ID].DENOMINAZIONE =  x[i].getElementsByTagName("DENOMINAZIONE")[0].childNodes[0].nodeValue;
			dict_turismo01[ID].INDIRIZZO = x[i].getElementsByTagName("INDIRIZZO")[0].childNodes[0].nodeValue;
			dict_turismo01[ID].CAP = x[i].getElementsByTagName("CAP")[0].childNodes[0].nodeValue;
			dict_turismo01[ID].CITTA = x[i].getElementsByTagName("CITTA")[0].childNodes[0].nodeValue;
			dict_turismo01[ID].MOBILE = x[i].getElementsByTagName("MOBILE")[0].childNodes[0].nodeValue;
			dict_turismo01[ID].TELEFONO = x[i].getElementsByTagName("TELEFONO")[0].childNodes[0].nodeValue;
			dict_turismo01[ID].FAX = x[i].getElementsByTagName("FAX")[0].childNodes[0].nodeValue;
			dict_turismo01[ID].EMAIL = x[i].getElementsByTagName("EMAIL")[0].childNodes[0].nodeValue;
			dict_turismo01[ID].WEB = x[i].getElementsByTagName("WEB")[0].childNodes[0].nodeValue;
			dict_turismo01[ID].ANNOTAZIONI = x[i].getElementsByTagName("ANNOTAZIONI")[0].childNodes[0].nodeValue;
			dict_turismo01[ID].INFO = x[i].getElementsByTagName("INFO")[0].childNodes[0].nodeValue;
			dict_turismo01[ID].DES = x[i].getElementsByTagName("DESCRIZIONE")[0].childNodes[0].nodeValue;
			dict_turismo01[ID].STAR = x[i].getElementsByTagName("STAR")[0].childNodes[0].nodeValue;
			dict_turismo01[ID].STAR_NUMERO = x[i].getElementsByTagName("STAR_NUMERO")[0].childNodes[0].nodeValue;
			
			//alert(dict_turismo01[ID].lat);
			var contentString =/*  "<div class=\"title\"><h1>" + dict_turismo01[ID].DENOMINAZIONE + " " + dict_turismo01[ID].STAR +"</h1></div>" + */
							 	/* "<img src=\"img/Vettoriali/dovedormire.gif\" alt=\"\" style=\"max-width:100%; \" \">" +  */
							 	"<p id=\"h1\">" + dict_turismo01[ID].DENOMINAZIONE + " " + dict_turismo01[ID].STAR + " <a href=\"javascript:share_facebook()\"><img class=\"imgshare\" src=\"img/Vettoriali/share50.png\" style=\"width:30px; height:30px;\"></a></p>" + 
							 	"<div class=\"infomarker\">" + 
								//"<p style=\"text-align:right\"></p>" +
								"<p><lable class=\"tipo\">INDIRIZZO</lable><br/>" + dict_turismo01[ID].INDIRIZZO + " - " + dict_turismo01[ID].CAP + " " + dict_turismo01[ID].CITTA + "</p>" +
								"<p><lable class=\"tipo\">MOBILE</lable><br/>" + dict_turismo01[ID].MOBILE + "</p>" +
								"<p><lable class=\"tipo\">TELEFONO</lable><br/>" + dict_turismo01[ID].TELEFONO + "</p>" +
								"<p><lable class=\"tipo\">FAX</lable><br/>" + dict_turismo01[ID].FAX + "</p>" +
								"<p><lable class=\"tipo\">EMAIL</lable><br/><a href=\"mailto:" + dict_turismo01[ID].EMAIL + "\">" + dict_turismo01[ID].EMAIL + "</a></p>" +
								"<p><lable class=\"tipo\">WEB</lable><br/><a href=\"" + dict_turismo01[ID].WEB + "\">" + dict_turismo01[ID].WEB + "</a></p>" +
								"<p><lable class=\"tipo\">ANNOTAZIONI</lable><br/>" + dict_turismo01[ID].ANNOTAZIONI + "</p>" +
								"<p><lable class=\"tipo\">INFO</lable><br/>" + dict_turismo01[ID].INFO + "</p>" +
								"<p><lable class=\"tipo\">DESCRIZIONE</lable><br/>" + dict_turismo01[ID].DES + "</p>" +
								"<p><lable class=\"tipo\">STELLE</lable><br/>" + dict_turismo01[ID].STAR_NUMERO + "</p>" +
								"</div> <div style=\"clear:both\"></div> ";
								
			var posM = new google.maps.LatLng(dict_turismo01[ID].lat, dict_turismo01[ID].lng);	
			
			drawmarker(posM, dict_turismo01[ID].DENOMINAZIONE, contentString);									
		}
	}
}

function leggi_xml03(){

	if (window.XMLHttpRequest)
	  {// code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttp=new XMLHttpRequest();

	  }
	else
	  {// code for IE6, IE5
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	  }
	xmlhttp.open("GET","data/VIS_DATASET_TURISMO03.xml",false);
	xmlhttp.send();
	xmlDoc = xmlhttp.responseXML;
	var x = xmlDoc.getElementsByTagName("DATA_RECORD");

	for (var i=0;i<x.length;i++){

		var ID = x[i].getElementsByTagName("ID")[0].childNodes[0].nodeValue;
		//alert(ID);
		if(ID in dict_turismo03){
			dict_turismo03[ID].DENOMINAZIONE =  x[i].getElementsByTagName("DENOMINAZIONE")[0].childNodes[0].nodeValue;
			dict_turismo03[ID].INDIRIZZO = x[i].getElementsByTagName("INDIRIZZO")[0].childNodes[0].nodeValue;
			dict_turismo03[ID].CAP = x[i].getElementsByTagName("CAP")[0].childNodes[0].nodeValue;
			dict_turismo03[ID].CITTA = x[i].getElementsByTagName("CITTA")[0].childNodes[0].nodeValue;
			dict_turismo03[ID].APERTURA_NOTE = x[i].getElementsByTagName("APERTURA_NOTE")[0].childNodes[0].nodeValue;
			dict_turismo03[ID].PREZZI_NOTE = x[i].getElementsByTagName("PREZZI_NOTE")[0].childNodes[0].nodeValue;
			dict_turismo03[ID].SERVIZI_NOTE = x[i].getElementsByTagName("SERVIZI_NOTE")[0].childNodes[0].nodeValue;
			dict_turismo03[ID].VISITE_NOTE = x[i].getElementsByTagName("VISITE_NOTE")[0].childNodes[0].nodeValue;
			dict_turismo03[ID].ANNOTAZIONI = x[i].getElementsByTagName("ANNOTAZIONI")[0].childNodes[0].nodeValue;
			dict_turismo03[ID].CENNI_STORICI = x[i].getElementsByTagName("CENNI_STORICI")[0].childNodes[0].nodeValue;
			dict_turismo03[ID].MOBILE = x[i].getElementsByTagName("MOBILE")[0].childNodes[0].nodeValue;
			dict_turismo03[ID].TELEFONO = x[i].getElementsByTagName("TELEFONO")[0].childNodes[0].nodeValue;
			dict_turismo03[ID].FAX = x[i].getElementsByTagName("FAX")[0].childNodes[0].nodeValue;
			dict_turismo03[ID].EMAIL = x[i].getElementsByTagName("EMAIL")[0].childNodes[0].nodeValue;
			dict_turismo03[ID].WEB = x[i].getElementsByTagName("WEB")[0].childNodes[0].nodeValue;
			dict_turismo03[ID].DESCRIZIONE = x[i].getElementsByTagName("DESCRIZIONE")[0].childNodes[0].nodeValue;
			dict_turismo03[ID].GESTORE_DENOMINAZIONE = x[i].getElementsByTagName("GESTORE_DENOMINAZIONE")[0].childNodes[0].nodeValue;
			dict_turismo03[ID].GESTORE_INDIRIZZO = x[i].getElementsByTagName("GESTORE_INDIRIZZO")[0].childNodes[0].nodeValue;
			dict_turismo03[ID].GESTORE_CAP = x[i].getElementsByTagName("GESTORE_CAP")[0].childNodes[0].nodeValue;
			dict_turismo03[ID].GESTORE_LOCALITA = x[i].getElementsByTagName("GESTORE_LOCALITA")[0].childNodes[0].nodeValue;
			dict_turismo03[ID].GESTORE_MOBILE = x[i].getElementsByTagName("GESTORE_MOBILE")[0].childNodes[0].nodeValue;
			dict_turismo03[ID].GESTORE_TELEFONO = x[i].getElementsByTagName("GESTORE_TELEFONO")[0].childNodes[0].nodeValue;
			dict_turismo03[ID].GESTORE_FAX = x[i].getElementsByTagName("GESTORE_FAX")[0].childNodes[0].nodeValue;
			dict_turismo03[ID].GESTORE_EMAIL = x[i].getElementsByTagName("GESTORE_EMAIL")[0].childNodes[0].nodeValue;
			dict_turismo03[ID].GESTORE_WEB = x[i].getElementsByTagName("GESTORE_TELEFONO")[0].childNodes[0].nodeValue;
			
			//alert(dict_turismo01[ID].lat);
			var contentString =/*  "<div class=\"title\"><h1>" + dict_turismo01[ID].DENOMINAZIONE + " " + dict_turismo01[ID].STAR +"</h1></div>" + */
							 	/* "<img src=\"img/Vettoriali/dovedormire.gif\" alt=\"\" style=\"max-width:100%; \" \">" +  */
							 	"<p id=\"h1\">" + dict_turismo03[ID].DENOMINAZIONE + " <a href=\"javascript:share_facebook()\"><img class=\"imgshare\" src=\"img/Vettoriali/share50.png\" style=\"width:30px; height:30px;\"></a></p>" +
								"<div class=\"infomarker\">" + 
								//"<p style=\"text-align:right\"><a href=\"javascript:share_facebook()\"><img class=\"imgshare\" src=\"img/Vettoriali/share50.png\"></a></lable></p>" +
								"<p><lable class=\"tipo\">INDIRIZZO</lable><br/>" + dict_turismo03[ID].INDIRIZZO + " - " + dict_turismo03[ID].CAP + " " + dict_turismo03[ID].CITTA + "</p>" +
								"<p><lable class=\"tipo\">MOBILE</lable><br/>" + dict_turismo03[ID].MOBILE + "</p>" +
								"<p><lable class=\"tipo\">TELEFONO</lable><br/>" + dict_turismo03[ID].TELEFONO + "</p>" +
								"<p><lable class=\"tipo\">FAX</lable><br/>" + dict_turismo03[ID].FAX + "</p>" +
								"<p><lable class=\"tipo\">EMAIL</lable><br/><a href=\"mailto:" + dict_turismo03[ID].EMAIL + "\">" + dict_turismo03[ID].EMAIL + "</a></p>" +
								"<p><lable class=\"tipo\">WEB</lable><br/><a href=\"" + dict_turismo03[ID].WEB + "\">" + dict_turismo03[ID].WEB + "</a></p>" +
								"<p><lable class=\"tipo\">ANNOTAZIONI</lable><br/>" + dict_turismo03[ID].ANNOTAZIONI + "</p>" +
								"<p><lable class=\"tipo\">INFO</lable><br/>" + dict_turismo03[ID].CENNI_STORICI + "</p>" +
								"<p><lable class=\"tipo\">DESCRIZIONE</lable><br/>" + dict_turismo03[ID].DESCRIZIONE + "</p>" +
								"<p><lable class=\"tipo\">GESTORE_DENOMINAZIONE</lable><br/>" + dict_turismo03[ID].GESTORE_DENOMINAZIONE + "</p>" +
								"</div> <div style=\"clear:both\"></div> ";
								
			var posM = new google.maps.LatLng(dict_turismo03[ID].lat, dict_turismo03[ID].lng);	
			
			drawmarker(posM, dict_turismo03[ID].DENOMINAZIONE, contentString);									
		}

	}

	
}

function drawmarker(posM, DENOMINAZIONE, contentString) {
	//alert(posM +" - "+ DENOMINAZIONE);
	/*var infowindow = new google.maps.InfoWindow({
		  content: contentString
	  });
	*/
	var marker = new google.maps.Marker({
				position: posM,
				map: map,
				title: DENOMINAZIONE
				});
	marker.contentString = contentString;
	google.maps.event.addListener(marker, 'click', function() {
		marker_selected = this;
		mostra_dettagli();
	  });
	
	markers.push(marker);
}		

/*
function stampa(ID, posM){
	p = "<p>\"ID:\" \"" + ID + "\"; \"coords:\" \"" + posM + "\"; </p>";
	$( "#test" ).append( p );
}
*/
/*
function codifica(address){
	//GOOGLE GEOCODE		
	geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			posM = results[0].geometry.location;
		}
		else {
			 
			alert('Geocode was not successful for the following reason: ' + status);
		}
	});	
	return posM;
}
*/
/*
function renderGeocode(response) {
    var html = '';
    var i = 0;
    var j = 0;
	
	html = "<p>Location: ";
	var location = response.results[0].locations[0];
	html += location.adminArea5 + ", " + location.adminArea4 + ", " + location.adminArea3 + ", " + location.adminArea1 + "(" + location.latLng.lat + ", " + location.latLng.lng + ")";
  	html += "</p>";
    
    document.getElementById('narrative').innerHTML = html;
}
*/

function notizie(){
	$("#content_info").remove();

	if (window.XMLHttpRequest)
	  {// code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttp=new XMLHttpRequest();

	  }
	else
	  {// code for IE6, IE5
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	  }
	xmlhttp.open("GET","feed.xml",false);
	//xmlhttp.open("GET","http://www.comune.ra.it/eventi/feed.xml",false);
	xmlhttp.send();
	xmlDoc = xmlhttp.responseXML;
	var x = xmlDoc.getElementsByTagName("notiziaDiCopertina");

	//document.getElementById("eventi").innerHTML = x[i].xmlDoc.getElementsByTagName("link")[0].childNodes[0].nodeValue;
	var div = "<div id=\"content_info\" style=\"padding:0px; margin:0px;\">";
	$( ".info" ).append( div );

	for (i=0;i<x.length;i++)
	{ 
	var link = x[i].getElementsByTagName("link")[0].childNodes[0].nodeValue;
	var titolo = x[i].getElementsByTagName("titolo")[0].childNodes[0].nodeValue;
	var dataPubblicazione = x[i].getElementsByTagName("dataPubblicazione")[0].childNodes[0].nodeValue;
	var testoHtml = x[i].getElementsByTagName("testoHtml")[0].childNodes[0].nodeValue;
	var immagine = x[i].getElementsByTagName("immagine")[0].childNodes[0].nodeValue;

	$( "#content_info" ).append( "<div id=\"eventinews\" style=\"border-bottom:1px solid #DADADA;\"><strong>" + dataPubblicazione + "</strong></br>" + titolo + "</br>" + testoHtml + "<a href=\"" + link + "\">Web</a></div>" );
	}

	$( "#content_info" ).append( "</div>" );

	$( ".container_info" ).show();
	$( ".info" ).show();
}




function percorso(){
	if(back_to[back_to.length-1]!="percorso"){
		back_to.push("percorso");
		$("#temp").html(back_to.join("\\"));
	}
	clear_markers();
	markerHere.setDraggable(false);
	
	//$("#content_info").remove();

	//var div = "<div id=\"content_info\" style=\"position:absolute; z-index:10;top:0px; width:100%; height:100%; padding:0;margin:0;\"><div id=\"mappercorso\"></div></div>";
	//$( ".info" ).append( div );

	if(modo == "piedi"){
		var modo = "WALKING";
	}else{
		var modo = "DRIVING";
	}

	//directionsDisplay = new google.maps.DirectionsRenderer();

	var request = {
		  origin: markerHere.getPosition(),
		  destination: marker_selected.getPosition(),
		  travelMode: google.maps.TravelMode[modo]

	};
	
	directionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
		  //directionsDisplay.setDirections(response);
		  showSteps(response);
		}
	});
	
	//directionsDisplay.setMap(map);
	
	$( ".container_info" ).hide();
	$( "#panav_btn" ).remove();
	//var c = "<input type=\"button\" id=\"panav_btn\" class=\"submenu_title\" style=\"position:absolute; margin:0; padding:0; background: rgba(255, 153, 204, 0.9) url('img/Vettoriali/indietro.png') left no-repeat\" onclick=\"chiudi()\" />";
	var c = "<button type=\"button\" id=\"panav_btn\" onclick=\"chiudi()\" class=\"submenu_title\"> <img src=\"img/Vettoriali/indietro.png\" style=\"border:none;margin:0; padding:0;\"  />	</button>";
	$( "#panav" ).append( c );
	
	//var div = "<div id=\"InfoPercorso\" style=\"z-index:6; top:40px;\"></div>";
	//$( "#content_info" ).append( div );

	//directionsDisplay.setPanel(document.getElementById('InfoPercorso'));
	//var img = "<a href=\"javascript:displayInfoPercorso()\"><img src=\"img/Vettoriali/info.png\"  style=\"position:absolute; top:50px; right:10px \"/></a>";
	//$( "#mappercorso" ).append( img );

}

function showSteps(directionResult) {

	for (var i = 0; i < elem_percorso.length; i++) {
		elem_percorso[i].setMap(null);
	}
	elem_percorso = [];
//alert(directionResult.routes.length);
  var myRoute = directionResult.routes[0].legs[0];

  for (var i = 0; i < myRoute.steps.length; i++) {

	var polyline = new google.maps.Polyline({
		path: myRoute.steps[i].path,
		geodesic: true,
		strokeColor: '#FF99CC',
		strokeOpacity: 0.8,
		strokeWeight: 6,
		map: map
	});
	elem_percorso.push(polyline);
  }
  	marker_selected.setMap(map);
	elem_percorso.push(marker_selected);
}

/*
function directionspanel(){
	$("#content_info").remove();
}
*/
/*
function displayInfoPercorso(){
	$( "#close" ).hide();
	//var p ="<p id=\"close2\"><a href=\"javascript:close2()\">◄◄ INDIETRO</a></p>";
	var p = "<button type=\"submit\" id=\"close2\" onclick=\"chiudi()\"><img src=\"img/Vettoriali/indietro.png\" alt=\"\" title=\"\" width=\"40px\" height=\"40px\" /></button>";
	$( "#content_info" ).append( p );
	$("#InfoPercorso").show();
	$("#mappercorso").hide();
	//alert('info');
}
*/

function chiudi(){

	$( "#panav_btn" ).remove();
	/*var close = "<input type=\"button\" id =\"panav_btn\" class=\"submenu_title\" style=\"margin:0; padding:0; background: rgba(255, 153, 204, 0.9) url('img/Vettoriali/menu.png') left no-repeat\" onclick=\"scelta('panav_btn')\" />";*/
	var close = "<button type=\"button\" id=\"panav_btn\" onclick=\"scelta('panav_btn')\" class=\"submenu_title\"> <img src=\"img/Vettoriali/menu.png\" style=\"border:none;margin:0; padding:0;\"  />	</button>";
	$( "#panav" ).append( close );
	$( ".container_info" ).hide();
	$( ".info" ).hide();
	//alert('chiudi');
	back_to.pop();
	$("#temp").html(back_to.join("\\"));
	//$( ".container_info" ).show();
	//alert(back_to[back_to.length-1]);
	switch(back_to[back_to.length-1]){
	case 'dovedormire':
		//alert("scelta('dovedormire')");
		scelta('dovedormire');
		break;
	case 'cosavedere':
		scelta('cosavedere');
		break;
	case 'mostra_dettagli':
		mostra_dettagli();
		break;
	case 'percorso':
		percorso();
		break;
	case 'posizione':
		geolocation();
		break;
	case 'home':
		scelta('panav_btn');
		break;
	//default: // home
		//infosupp = "";
	}	
}

/*
function stampa_xml_03(){

	if (window.XMLHttpRequest)
	  {// code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttp=new XMLHttpRequest();

	  }
	else
	  {// code for IE6, IE5
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	  }
	xmlhttp.open("GET","data/VIS_DATASET_TURISMO03.xml",false);
	xmlhttp.send();
	xmlDoc = xmlhttp.responseXML;
	var x = xmlDoc.getElementsByTagName("DATA_RECORD");
	
	var table = "<div class=\"container_info\"><table id=\"tab\"></table></div>";
	$( ".info" ).append( table );
	$( ".container_info" ).show();
	$( ".info" ).show();
	
	for (var i=0;i<x.length;i++){

		var ID = x[i].getElementsByTagName("ID")[0].childNodes[0].nodeValue;
		var INDIRIZZO = x[i].getElementsByTagName("INDIRIZZO")[0].childNodes[0].nodeValue;
		
		var tr = "<tr><td>" + ID + "</td>" + "<td>" + INDIRIZZO + "</td></tr>";
		$( "#tab" ).append( tr );
		}		
}
*/
/*
function map_direction(){
	// Recupero i valori passati con GET
	// Per farlo creo una variabile cui assegno come valore
	// il risultato della funzione vista in precedenza
	var get = parseGetVars();

	// estraggo dall'array contenente i valori della querystring
	// il valore del parametro "sito"
	//var sito = get['sito'];

	// stampo a video
	//document.write(sito);
	
	var orig = new google.maps.LatLng(get['lat1'], get['lon1']);
	var dest = new google.maps.LatLng(get['lat2'], get['lon2']);
	var modo = get['mode'];
	percorso(orig, dest, modo);
	
}
*/
/*
function parseGetVars(){
	// creo una array
	var args = new Array();
	// individuo la query (cioè tutto quello che sta a destra del ?)
	// per farlo uso il metodo substring della proprietà search
	// dell'oggetto location
	var query = window.location.search.substring(1);
	// se c'è una querystring procedo alla sua analisi
	if (query){
		// divido la querystring in blocchi sulla base del carattere &
		// (il carattere & è usato per concatenare i diversi parametri della URL)
		var strList = query.split('&');
		// faccio un ciclo per leggere i blocchi individuati nella querystring
		for(str in strList){
			// divido ogni blocco mediante il simbolo uguale
			// (uguale è usato per l'assegnazione del valore)
			var parts = strList[str].split('=');
			// inserisco nella array args l'accoppiata nome = valore di ciascun
			// parametro presente nella querystring
			args[unescape(parts[0])] = unescape(parts[1]);
		}
	}
	return args;
}
*/
