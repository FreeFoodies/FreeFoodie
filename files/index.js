function CenterControl(controlDiv, map) {

        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Click to recenter the map';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '38px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        controlText.innerHTML = 'Add Food Location';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener('click', function() {
          map.setOptions({draggableCursor:'crosshair'});
          map.addListener('click',function(){
          	alert("open model");
          })
        });

      }

function whenGoogleMapsAPIReady() {
	const map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 39.8283, lng: -98.5795},
		zoom: 5
	})

	// Create the DIV to hold the control and call the CenterControl()
    // constructor passing in this DIV.
    var centerControlDiv = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, map);

    centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(centerControlDiv);

    db.collection("Pins").
    	onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
        	console.log(doc.data().latitude);
        	console.log(doc.data().longitude);
			var infowindow = new google.maps.InfoWindow({
				content: "Pin info"
			});

			var marker = new google.maps.Marker({
				position: {lat: doc.data().latitude, lng: doc.data().longitude},
				map: map,
				title: 'Test Pin'
			});
				marker.addListener('click', function() {
				infowindow.open(map, marker);
			});
        });
    });
/*	map.addListener('click', function(e) {
	  db.collection("Pins").doc("test").set({
	    latitude: e.latLng.lat(),
	    longitude: e.latLng.lng()
	  })
	  .then(function() {
	      console.log("Document successfully written!");
	  })
	  .catch(function(error) {
	      console.error("Error writing document: ", error);
	  });
  });*/
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(({coords}) => {
			map.setCenter({
				lat: coords.latitude,
				lng: coords.longitude
			});
			map.setZoom(13);
			let currentInfo = new google.maps.InfoWindow({
				content: "This is your current location!"
			});
			let image = {
				url: './images/current_loc.png',
				scaledSize: new google.maps.Size(50, 50),// scaled size maintaing aspect ratio
				origin: new google.maps.Point(0, 0), // origin
				anchor: new google.maps.Point(50, 50) // anchor
			};
			let currentLoc = new google.maps.Marker({
				position: map.getCenter(),
				icon: image,
				animation: google.maps.Animation.BOUNCE,
				map
			});
			setTimeout(() => { currentLoc.setAnimation(null) }, 3000);
			currentLoc.addListener('mouseover', function () {
				currentInfo.open(map, this);
			});

			// assuming you also want to hide the infowindow when user mouses-out
			currentLoc.addListener('mouseout', () => {
				currentInfo.close();
			});
		}, () => {
			handleLocationError(true, infoWindow, map.getCenter());
		});
	} else {
		// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow, map.getCenter());
	}
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	window.alert("Your browser doesn't support location access from google map!");
}



// Firebase
// jQuery methods go here...
// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyAOI-pfdx43XfrMk9fBk0vfYH9kQzSOzP0",
	authDomain: "food-delivery-for-the-homeless.firebaseapp.com",
	databaseURL: "https://food-delivery-for-the-homeless.firebaseio.com",
	projectId: "food-delivery-for-the-homeless",
	storageBucket: "food-delivery-for-the-homeless.appspot.com",
	messagingSenderId: "1048473239710",
	appId: "1:1048473239710:web:5723f204a0e5a2fef27b8f",
	measurementId: "G-BWWYR6Y856"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

// Add a second document with a generated ID.
// db.collection("users").add({
// 	first: "Alan",
// 	middle: "Mathison",
// 	last: "Tsafd",
// 	born: 1912
// })
// 	.then(({id}) => {
// 		console.log("Document written with ID: ", id);
// 	})
// 	.catch(error => {
// 		console.error("Error adding document: ", error);
// 	});