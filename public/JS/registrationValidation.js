//Checks to make sure Password & Confirm Password field matches
function passwordValidation(){
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword");
    if(password != "" && confirmPassword.value != "" && confirmPassword.value != password){
        alert("Passwords Does Not Match");
        confirmPassword.value = ''; 
    }     
}

//Checks if username fits the correct format
function userNameValidation(){
    var username = document.getElementById("username");
    const userNameRegex = '^(?!\d+$)(?:[a-zA-Z0-9][a-zA-Z0-9 @&$]*)?$'
    let isMatch = true
    if(username.value != "") isMatch = username.match(userNameRegex)
    if(!isMatch){
        alert('Please Choose Another UserName That Matches The Format!');
        username.value = '';
    }
    
}



