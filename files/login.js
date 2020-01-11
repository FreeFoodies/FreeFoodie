$(document).ready(function(){

  // jQuery methods go here...
	// Your web app's Firebase configuration
	var firebaseConfig = {
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

	var db = firebase.firestore();

	// Add a second document with a generated ID.
	db.collection("users").add({
	    first: "Alan",
	    middle: "Mathison",
	    last: "Tsafd",
	    born: 1912
	})
	.then(function(docRef) {
	    console.log("Document written with ID: ", docRef.id);
	})
	.catch(function(error) {
	    console.error("Error adding document: ", error);
	});
});