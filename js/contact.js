
let name = document.querySelector('#name'),
email = document.querySelector('#email'),
subject = document.querySelector('#subject'),
message = document.querySelector('#message'),
submit = document.querySelector('#btn'), 
res = document.querySelector('#result'),
nameError = document.querySelector('#nameError'),
emailError = document.querySelector('#emailError'),
subjectError = document.querySelector('#subjectError'),
messageError = document.querySelector('#messageError');

submit.addEventListener('click', (ev) => {

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

var urlencoded = new URLSearchParams();
urlencoded.append("name", name.value);
urlencoded.append("email", email.value);
urlencoded.append("subject", subject.value);
urlencoded.append("message", message.value);

var requestOptions = {
method: 'POST',
headers: myHeaders,
body: urlencoded,
redirect: 'follow'
};

fetch("https://afternoon-falls-30227.herokuapp.com/api/v1/contact_us", requestOptions)
.then(response => response.text())
.then(result => {
result = JSON.parse(result)
res.textContent = result.message;
if(result.error){
    if (result.error.name){
      nameError.textContent = result.error.name;
    }
    else{
      nameError.textContent = '';
    }
    if (result.error.email){
      emailError.textContent = result.error.email;
    }
    else{
      emailError.textContent = '';
    }

    if(subject.value == ''){
      subjectError.textContent = "subject is required";
    }
    else{
      subjectError.textContent = '';
    }

    if(message.value == ''){
      messageError.textContent = "message is required";
    }  else{
      messageError.textContent = '';
    }
}

})


})