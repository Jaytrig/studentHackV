var playerTracking;
var map;
var players = [];
var playerMarkers =[];
var userId = 'gini';
$(function(){

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
	    	if(userId !== obj.publisher){
		    	var newCenter = [obj.message.lng, obj.message.lat];
		    	players[obj.publisher] = newCenter;
		    	if(playerMarkers[obj.publisher] == undefined){
		    		  var el = document.createElement('div');
					  el.className = 'marker';
					  el.style.background = 'red';
					  el.style.width = '5px';
					  el.style.height = '5px';
					  el.style.zIndex = '20';


					  var playerMarker = new mapboxgl.Marker(el)
					                            .setLngLat([newCenter[0], newCenter[1]])
					                            .addTo(map);
					  playerMarkers[obj.publisher] = playerMarker;
		    	}else{
		    		//find existing marker
		    		playerMarkers[obj.publisher].setLngLat([newCenter[0], newCenter[1]]);

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
