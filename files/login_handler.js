const $loginForm = document.querySelector("#login")
$loginForm.onsubmit = e => {
	console.log(e)
	e.preventDefault()
}

function userLogin(email, password){
	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
		alert('login failed');
	});
}