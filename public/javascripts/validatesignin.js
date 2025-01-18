let password;
let allowsignin = false;
let p = false;
let c = false;
let m = false;
let n = false;
let e = false;
let un = false;
function validatePassword() {
    password = document.getElementById('password').value;
    if (password.length <= 8 || password.length >= 14) {
        document.getElementById('lengthnotmatch').classList.remove('d-none');
        document.getElementById('lengthnotmatch').classList.add('d-block');
        p = false;
    }else{
        document.getElementById('lengthnotmatch').classList.remove('d-block');
        document.getElementById('lengthnotmatch').classList.add('d-none');
        p = true;
    }

    const hasUpperCase = /[A-Z]/;
    const hasLowerCase = /[a-z]/;
    const hasDigit = /\d/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

    if (!hasUpperCase.test(password)) {
        document.getElementById('oneuppercase').classList.remove('d-none');
        document.getElementById('oneuppercase').classList.add('d-block');
    }else{
        document.getElementById('oneuppercase').classList.remove('d-block');
        document.getElementById('oneuppercase').classList.add('d-none');
    }
    if (!hasLowerCase.test(password)) {
        document.getElementById('onelowercase').classList.remove('d-none');
        document.getElementById('onelowercase').classList.add('d-block');
    }else{
        document.getElementById('onelowercase').classList.remove('d-block');
        document.getElementById('onelowercase').classList.add('d-none');
    }
    if (!hasDigit.test(password)) {
        document.getElementById('onedigit').classList.remove('d-none');
        document.getElementById('onedigit').classList.add('d-block');
    }else{
        document.getElementById('onedigit').classList.remove('d-block');
        document.getElementById('onedigit').classList.add('d-none');
    }
    if (!hasSpecialChar.test(password)) {
        document.getElementById('onespchar').classList.remove('d-none');
        document.getElementById('onespchar').classList.add('d-block');
    }else{
        document.getElementById('onespchar').classList.remove('d-block');
        document.getElementById('onespchar').classList.add('d-none');
    }
}
function confirmPassword(){
    let confirmpassword = document.getElementById('confirmpassword').value;
    if(confirmpassword != password){
        document.getElementById('confirmpasswordnotmatch').classList.remove('d-none');
        document.getElementById('confirmpasswordnotmatch').classList.add('d-block');
        c = false;
    }else{
        document.getElementById('confirmpasswordnotmatch').classList.remove('d-block');
        document.getElementById('confirmpasswordnotmatch').classList.add('d-none');
        c = true;
    }
}
function validateNumber(){
    let mb = document.getElementById('mbnumber').value;
    if(mb < 999999999 || mb > 9999999999){
        document.getElementById('mobileno').classList.remove('d-none');
        document.getElementById('mobileno').classList.add('d-block');
        m = false;
    }else{
        document.getElementById('mobileno').classList.remove('d-block');
        document.getElementById('mobileno').classList.add('d-none');
        m = true;
    }
}
function validateUserName(){
    if(document.getElementById('userName').value != ""){
        un = true;
    }else{
        un = false;
    }
}
function allowSignBtn(){
    if(document.getElementById('fname').value != "" && document.getElementById('lname').value != "" && document.getElementById('email').value != ""){
        n = true;
        e = true;
    }else{
        n = false;
        e = false;
    }
    if(n && m && e && c && p && un){
        allowsignin = true;
    }else{
        allowsignin = false;
    }
    if(allowsignin){
        document.getElementById('signbtn').classList.remove('disabled');
    }else{
        document.getElementById('signbtn').classList.add('disabled');
    }
}