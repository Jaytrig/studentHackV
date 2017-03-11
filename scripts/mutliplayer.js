var playerTracking;
var map;
var players = [];
var playerMarkers =[];
var playerSmallMarkers =[];
var userId;
var name;
var endMarker1;
var map2;
var smallmapMarker;
var endpointMarkerMap1;
var endpointMarkerMap2;
var point;
var secondCounter = 0;
var t;
var keyMap = {38: false, 40: false, 39: false, 37: false};
var winner = false;
var points = [
{
	name : 'Manchester',
	startPoints : [-2.23834, 53.4760],
	endPoint : [-2.243101, 53.487354]
},
{
	name : 'New York',
	startPoints : [ -73.990157, 40.732288],
	// endPoint : [-73.985100, 40.747811]
	endPoint : [ -73.990157, 40.732388]
}
	]
	function distanceTwoPoints(lat1, lon1, lat2, lon2) {
	var p = 0.017453292519943295;    // Math.PI / 180
	var c = Math.cos;
	var a = 0.5 - c((lat2 - lat1) * p)/2 +
	c(lat1 * p) * c(lat2 * p) *
	(1 - c((lon2 - lon1) * p))/2;

	return ((12742 * Math.asin(Math.sqrt(a)))*0.62137).toFixed(2); // 2 * R; R = 6371 km
}

function reload(newPoint){
	map.setCenter(points[newPoint].startPoints);
	map2.setCenter(points[newPoint].startPoints);
	keyMap = {38: false, 40: false, 39: false, 37: false};
	endMarker1.style.backgroundImage = "url('./img/little_man.png')";
	smallmapMarker.setLngLat(points[newPoint].startPoints);
	endpointMarkerMap1.setLngLat(points[newPoint].endPoint);
	endpointMarkerMap2.setLngLat(points[newPoint].endPoint);

	var d = distanceTwoPoints(points[newPoint].startPoints[1], points[newPoint].startPoints[0], points[newPoint].endPoint[1], points[newPoint].endPoint[0]);
	$('#distanceTag').text(d +' KM Left '+ points[newPoint].name);
	winner = false;
}

$(function(){
		toastr.options = {
            "positionClass": "toast-top-left"
        };
		userId = Math.ceil((Math.random() * 100000000));

		$('#join').click(function(){
			name = $('#username').val();
			if(name === '') name = 'User' + userId;
			$('#login').hide();
			map.getCanvas().focus();
			 playerTracking.publish({
                channel: 'taxigame',
                message: {"name":name,"type":"join"}
        	});
		});


		playerTracking = new PubNub({
			publishKey: 'pub-c-bdf8080e-74cc-4302-86b0-2de8ada8fdd9',
			subscribeKey: 'sub-c-8882bb02-0648-11e7-89e8-02ee2ddab7fe',
			uuid: userId
		});

		playerTracking.subscribe({
			channels: ['taxigame'],
			withPresence: true
		});

		playerTracking.addListener({
			message: function(obj){
			if(obj.message.type === 'win'){
				keyMap = {};
	    		// display win message on phone screen
	    		var winnerName = obj.message.name;
	    		var thisPoint = obj.message.point;
	    		$('#winnerText').html(winnerName + '<br>WINS!<br>NEW GAME<br>STARTS SOON!<br>');
	    		$('#notice').show();
	    		setTimeout(function(){
	    			$('#notice').hide();
	    			reload(thisPoint);
	    		}, 8000);
	    		return false;
	    	}
	    	if(obj.message.type === 'join'){
	    		toastr.success(obj.message.name + ' Has Joined!');
	    		return false;
	    	}
	    	if(userId !== parseInt(obj.publisher)){
	    		var newCenter = [obj.message.lng, obj.message.lat];
	    		players[obj.publisher] = newCenter;
	    		if(playerMarkers[obj.publisher] == undefined){
	    			var el = document.createElement('div');
	    			el.className = 'markerCar';

	    			var markerHeight = 50, markerRadius = 10, linearOffset = 25;
					var popupOffsets = {
					 'top': [0, 0],
					 'top-left': [0,0],
					 'top-right': [0,0],
					 'bottom': [0, -markerHeight],
					 'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
					 'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
					 'left': [markerRadius, (markerHeight - markerRadius) * -1],
					 'right': [-markerRadius, (markerHeight - markerRadius) * -1]
					 };
					var popup = new mapboxgl.Popup(popup);
					
	    			var playerMarker = new mapboxgl.Marker(el).Popup({offset:popupOffsets})
	    			.setLngLat([newCenter[0], newCenter[1]])
	    			.addTo(map);
	    			playerMarkers[obj.publisher] = playerMarker;

					  //Small marker
					  var el = document.createElement('div');
					  el.className = 'marker';
					  el.style.background = 'blue';
					  el.style.width = '5px';
					  el.style.height = '5px';

					  var smallPlayerMarker = new mapboxgl.Marker(el)
					  .setLngLat([newCenter[0], newCenter[1]])
					  .addTo(map2);
					  playerSmallMarkers[obj.publisher] = smallPlayerMarker;
					}else{
		    		//find existing marker
		    		playerMarkers[obj.publisher].setLngLat([newCenter[0], newCenter[1]]);
		    		playerSmallMarkers[obj.publisher].setLngLat([newCenter[0], newCenter[1]]);

		    	}
		    }
		}
	});

	playerTracking.hereNow(
	{
		channels: ["taxigame"]
	},
	function (status, response) {
		var allUsersIds = [];
		var usersArr = response.channels["taxigame"].occupants;
		for(var i =0;i<usersArr.length;i++){
	    		//update each users car/marker
	    	}
	    }
	);
});
