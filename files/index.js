// Initialize Firebase
  var firebaseConfig = {
    apiKey: "AIzaSyCbHZ9YvdrRofrnPOdsZVjNi4njEDHPxHk",
    authDomain: "free-foodie.firebaseapp.com",
    databaseURL: "https://free-foodie.firebaseio.com",
    projectId: "free-foodie",
    storageBucket: "free-foodie.appspot.com",
    messagingSenderId: "41992635191",
    appId: "1:41992635191:web:eb78d20563f3fff610d0b2"
  };
   // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

const db = firebase.firestore()


// Buttons that toggle [hidden] state
for(const $button of document.querySelectorAll('[data-toggle]')){
	$button.onclick = e => {
		const $modal = document.querySelector($button.dataset.toggle)
		$modal.hidden = !$modal.hidden
	}
}


const $sideMenu = document.querySelector('#side-menu')
const $foodLocationDetailsForm = document.querySelector('#food-location-details')
$foodLocationDetailsForm.onsubmit = e => {
	e.preventDefault()

	// Get form values
	const {latitude, longitude, description, instructions, icon, phone} = Object.fromEntries(new FormData(e.target).entries())
	addPin({latitude, longitude, description, instructions, icon, phone})
}

function updateFoodLocationDetails(data){
	if(data){
		// Open the modal
		$sideMenu.hidden = false
	
		const {latitude, longitude} = data
		$foodLocationDetailsForm.elements.namedItem('latitude').value = latitude
		$foodLocationDetailsForm.elements.namedItem('longitude').value = longitude
	}else{
		$sideMenu.hidden = true
	}
}

// Init Google Maps functionality
function whenGoogleMapsAPIReady(){
	var directionsRenderer = new google.maps.DirectionsRenderer;
    var directionsService = new google.maps.DirectionsService;
	const map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 39.8283, lng: -98.5795},
		zoom: 5
	})
	directionsRenderer.setMap(map);
   	directionsRenderer.setPanel(document.getElementById('right-panel'));

	const $addFoodLocationButton = document.querySelector('#add-food-location-button')
	$addFoodLocationButton.onclick = () => {
		map.setOptions({draggableCursor: 'crosshair'});
		map.addListener('click', e => {
			const latitude = e.latLng.lat()
			const longitude = e.latLng.lng()
			updateFoodLocationDetails({latitude, longitude});
		});
	}

	db.collection('Pins').onSnapshot(querySnapshot => {
		querySnapshot.forEach(doc => {
			const data = doc.data()

			const infoWindow = new google.maps.InfoWindow({
				content: `
					<h3>${data.description}</h3>
					<h3>${data.instructions}</h3>
					<h3>${data.icon}</h3>
					<h3>${data.phone}</h3>
					<button name="directionButton" data-lat="${data.latitude}" data-lng="${data.longitude}" 
					onclick="alert()">Directions</button>
				`
			})

			const marker = new google.maps.Marker({
				position: {lat: parseFloat(data.latitude), lng: parseFloat(data.longitude)},
				map,
			})
			marker.addListener('click', () => {
				infoWindow.open(map, marker)
			})
			marker.addListener('mouseover', () => {
				infoWindow.open(map, marker)
			})
		})
	})
	
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(({coords}) => {
			let pos = {
				lat: coords.latitude,
				lng: coords.longitude
			};
			map.setCenter(pos);
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
				map:map
			});
			setTimeout(() => { currentLoc.setAnimation(null) }, 3000)

			currentLoc.addListener('click', () => {
				currentInfo.open(map, currentLoc)
			})

			currentLoc.addListener('mouseover', () => {
				currentInfo.open(map, currentLoc)
			})

			// assuming you also want to hide the infowindow when user mouses-out
			currentLoc.addListener('mouseout', () => {
				currentInfo.close()
			})
		}, () => {
			unsupportedLocationError()
		})
	} else {
		// Browser doesn't support Geolocation
		unsupportedLocationError()
	}
	var latitude = 34.43
	var longitude = -119.827
	var latitude1 = 34.427
	var longitude1 = -119.85

	calculateAndDisplayRoute(directionsService,directionsRenderer,latitude,longitude,latitude1,longitude1)
}

function unsupportedLocationError() {
	window.alert("Your browser doesn't support location access from google map!")
}

function calculateAndDisplayRoute(directionsService, directionsRenderer, latitude, longitude, latitude1, longitude1) {
    directionsService.route({
      origin: new google.maps.LatLng({lat: latitude, lng: longitude}),
      destination: new google.maps.LatLng({lat: latitude1, lng: longitude1}),
      travelMode: 'DRIVING'
    }, function(response, status) {
      if (status === 'OK') {
        directionsRenderer.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

function addPin(pinData){
	db.collection('Pins').add(pinData)
		.then(() => {
			console.log("Document successfully written!")
		})
		.catch(error => {
			console.error("Error writing document: ", error)
		})
}



// Add a second document with a generated ID.
// db.collection("users").add({
// 	first: "Alan",
// 	middle: "Mathison",
// 	last: "Tsafd",
// 	born: 1912
// })
// 	.then(({id}) => {
// 		console.log("Document written with ID: ", id)
// 	})
// 	.catch(error => {
// 		console.error("Error adding document: ", error)
// 	})


// Log In

const $loginForm = document.querySelector("#login")
$loginForm.onsubmit = e => {
	e.preventDefault()

	// Get form values
	const {username, password} = Object.fromEntries(new FormData(e.target).entries())
	
	firebase.auth().signInWithEmailAndPassword(username, password)
		.then(result => {
			console.log(result)
			alert(result)
		})
		.catch(e => {
			console.error(e)
			alert(e)
		})
}