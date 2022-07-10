

//Checks to make sure Password & Confirm Password field matches
function passwordValidation(){
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword");
    if(password != "" && confirmPassword.value != "" && confirmPassword.value != password){
        alert("Passwords Does Not Match");
        confirmPassword.value = ''; 
    }     
}




