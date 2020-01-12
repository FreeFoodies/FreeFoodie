function whenGoogleMapsAPIReady() {
	const map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 39.8283, lng: -98.5795},
		zoom: 5
	})

	const $addFoodLocationButton = $('.add-food-location')
	$addFoodLocationButton.onclick = () => {
		map.setOptions({draggableCursor: 'crosshair'});
		map.addListener('click', () => {
			console.log('Add food location')
		})
	}

	// map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push($addFoodLocationButton);

	db.collection("Pins").onSnapshot((querySnapshot) => {
		querySnapshot.forEach(function(doc) {
			console.log(doc.data().latitude);
			console.log(doc.data().longitude);
			const infowindow = new google.maps.InfoWindow({
				content: "Pin info"
			});

			const marker = new google.maps.Marker({
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






// Log In

const $loginForm = document.querySelector("#login")
$loginForm.onsubmit = e => {
	e.preventDefault()

	// Get form values
	const {username, password} = Object.fromEntries(new FormData(e.target).entries())
	
	firebase.auth().signInWithEmailAndPassword(email, password)
		.catch(e => console.error(e));
}