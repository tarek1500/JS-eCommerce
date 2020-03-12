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



function sendData()
{
    const data = {
        name: name.value,
        email: email.value,
        subject: subject.value,
        message: message.value
    }

    
    const xhr = new XMLHttpRequest();

    xhr.open('POST', 'https://afternoon-falls-30227.herokuapp.com/api/v1/contact_us');

    xhr.responseType = 'json';
  
      if (data) {
        xhr.setRequestHeader('Content-Type', 'application/json');
      }


      xhr.onload = () => {
            if (xhr.status >= 400) {
                console.log(xhr.response);

                if(xhr.response.error.name){
                    nameError.textContent = xhr.response.error.name;
                }else{
                    nameError.textContent = ''
                }

                if(xhr.response.error.email){
                    emailError.textContent = xhr.response.error.email;
                }else{
                    emailError.textContent = ''
                }

                if(subject.textContent == ''){
                    subjectError.textContent = "Subject is Required";
                }else{
                    subjectError.textContent = ''
                }
            
                if(message.textContent == ''){
                    messageError.textContent = "Message is Required";
                }else{
                    messageError.textContent = ''
                }
            
            } else {
                res.textContent = xhr.response.message
                console.log(xhr.response);   
            }
            };
        
            xhr.onerror = () => {
            console.log('Erooooor');
        };

      xhr.send(JSON.stringify(data));
}

submit.addEventListener('click', sendData);
