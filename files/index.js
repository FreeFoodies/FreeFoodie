// Buttons that toggle [hidden] state
for(const $button of document.querySelectorAll('[data-toggle]')){
	$button.onclick = e => {
		const $modal = document.querySelector($button.dataset.toggle)
		$modal.hidden = !$modal.hidden
	}
}

// Init Google Maps functionality
function whenGoogleMapsAPIReady() {
	const map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 39.8283, lng: -98.5795},
		zoom: 5
	})

	const $addFoodLocationButton = document.querySelector('#add-food-location-button')
	$addFoodLocationButton.onclick = () => {
		map.setOptions({draggableCursor: 'crosshair'});
		map.addListener('click', function(e) {
			openSideModel(e.latLng.lat(),e.latLng.lng());
		});
	}

	// map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push($addFoodLocationButton);

	db.collection("Pins")
		.onSnapshot(function(querySnapshot) {
		querySnapshot.forEach(function(doc) {
			console.log(doc.data().latitude);
			console.log(doc.data().longitude);
			var infowindow = new google.maps.InfoWindow({
				content: '<h3>doc.id</h3>' + '<button name="directionButton";data-lat=doc.data().latitude.toString();data-lng=doc.data().longitude.toString()>Directions</button>'
			});

			const marker = new google.maps.Marker({
				position: {lat: doc.data().latitude, lng: doc.data().longitude},
				map: map,
				title: doc.id
			});
			marker.addListener('click', function() {
				infowindow.open(map, marker);
			});
		});
	});

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(({coords}) => {
			map.setCenter({
				lat: coords.latitude,
				lng: coords.longitude
			});
			map.setZoom(13);
			var currentInfo = new google.maps.InfoWindow({
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
			handleLocationError(true, currentInfo, map.getCenter());
		});
	} else {
		// Browser doesn't support Geolocation
		handleLocationError(false, currentInfo, map.getCenter());
	}
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	window.alert("Your browser doesn't support location access from google map!");
}


/*function addPin(latitude, longitude){
	let db = firebase.firestore();
	let longitude = document.getElementById("long").value;
  	let latitude = document.getElementById("lat").value;
  	db.collection("Pins").doc("test").set({
		latitude: e.latLng.lat(),
		longitude: e.latLng.lng(),
		description:,
		instructions:,
		icon:,
		phone:
	})
	.then(function() {
		console.log("Document successfully written!");
	})
	.catch(function(error) {
		console.error("Error writing document: ", error);
	});
}*/

function openSideModel(){
	
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


// Log In

const $loginForm = document.querySelector("#login")
$loginForm.onsubmit = e => {
	e.preventDefault()

	// Get form values
	const {username, password} = Object.fromEntries(new FormData(e.target).entries())
	
	firebase.auth().signInWithEmailAndPassword(username, password)
		.catch(e => console.error(e));
}

$(document).on('click', 'button', function(){
	if ($(this).attr('name')=='directionButton'){
		alert($(this).attr('data-lat')+''+$(this).attr('data-lng'));
	}
});