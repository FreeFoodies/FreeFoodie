const $loginForm = document.querySelector("#login")
$loginForm.onsubmit = e => {
	e.preventDefault()

	// Get form values
	const {username, password} = Object.fromEntries(new FormData(e.target).entries())
	
	userLogin(username, password)
}

function userLogin(email, password){
	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
		alert('login failed');
	});
}