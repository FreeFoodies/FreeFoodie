function userLogin(email, password)
{
	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
		alert('login failed');
	});
}