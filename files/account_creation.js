function createAccount(email, password)
{
	if (email.length == 0)
	{
		alert('invalid email format');
		return;
	}
	if (password.length == 0)
	{
		alert('invalid password format');
		return;
	}
	firebase.auth().createUserWithEmailAndPassword(email, password);
}