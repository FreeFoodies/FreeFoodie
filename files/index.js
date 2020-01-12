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


const $leftMenu = document.querySelector('#left-menu')


const $rightMenu = document.querySelector('#right-menu')
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
		$rightMenu.hidden = false
	
		const {latitude, longitude} = data
		$foodLocationDetailsForm.elements.namedItem('latitude').value = latitude
		$foodLocationDetailsForm.elements.namedItem('longitude').value = longitude
	}else{
		$rightMenu.hidden = true
	}
}


// Init Google Maps functionality
function whenGoogleMapsAPIReady(){
	const map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 39.8283, lng: -98.5795},
		zoom: 5
	})


	const directionsRenderer = new google.maps.DirectionsRenderer();
	const directionsService = new google.maps.DirectionsService();
	directionsRenderer.setMap(map);
	directionsRenderer.setPanel(document.querySelector('#directions'));
	
	window.getDirections = async ({latitude, longitude}) => {
		directionsService.route({
			origin: await getCurrentLocation(),
			destination: new google.maps.LatLng({ lat: parseFloat(latitude), lng: parseFloat(longitude) }),
			travelMode: 'DRIVING'
		}, (response, status) => {
			if (status === 'OK') {
				$leftMenu.hidden = false
				directionsRenderer.setDirections(response);
			} else {
				window.alert('Couldn\'t get directions: ' + status);
			}
		});
	}


	const $addFoodLocationButton = document.querySelector('#add-food-location-button')
	$addFoodLocationButton.onclick = () => {
		map.setOptions({draggableCursor: 'crosshair'});
		map.addListener('click', e => {
			const latitude = e.latLng.lat()
			const longitude = e.latLng.lng()
			updateFoodLocationDetails({latitude, longitude});
		}, 'once');
	}


	db.collection('Pins').onSnapshot(querySnapshot => {
		for(const doc of querySnapshot.docs){
			const id = doc.id
			const foodLocation = doc.data()
			console.log(foodLocation)

			const marker = new google.maps.Marker({
				position: {
					lat: parseFloat(foodLocation.latitude),
					lng: parseFloat(foodLocation.longitude)
				},
				label: foodLocation.icon,
				map,
			})

			const infoWindow = new google.maps.InfoWindow({
				content: `
					<h2>${foodLocation.description}</h2>
					<p>${foodLocation.instructions}</p>
					<p>${foodLocation.phone}</p>
					<button class="get-directions-button" onclick="getDirections({latitude: ${parseFloat(foodLocation.latitude)}, longitude: ${parseFloat(foodLocation.longitude)}})">Get Directions</button>
				`
			})

			let isOpenByClick = false
			marker.addListener('click', () => {
				if(isOpenByClick)
					infoWindow.close()
				else
					infoWindow.open(map, marker)
				isOpenByClick = !isOpenByClick
			})
			marker.addListener('mouseover', () => {
				infoWindow.open(map, marker)
			})
			marker.addListener('mouseleave', () => {
				if(!isOpenByClick)
					infoWindow.close()
			})
		}
	})
	

	// Location
	getCurrentLocation().then(location => {
		map.setCenter(location);
		map.setZoom(13);
		let currentInfo = new google.maps.InfoWindow({
			content: "You are here"
		});
		let image = {
			url: './images/current_loc.png',
			scaledSize: new google.maps.Size(50, 50),// scaled size maintaing aspect ratio
			origin: new google.maps.Point(0, 0), // origin
			anchor: new google.maps.Point(50, 50) // anchor
		};
		let currentLoc = new google.maps.Marker({
			position: location,
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
		currentLoc.addListener('mouseleave', () => {
			currentInfo.close()
		})
	}).catch(e => {
		window.alert(e)
	})
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



const getCurrentLocation = () => new Promise((resolve, reject) => {
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(({coords}) => {
			resolve({
				lat: coords.latitude,
				lng: coords.longitude
			})
		})
	}else{
		reject("We couldn't get your current location.")
	}
})


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