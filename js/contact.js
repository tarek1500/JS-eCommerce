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

function sendData (event) {
	event.preventDefault();

	const data = {
		name: name.value,
		email: email.value,
		subject: subject.value,
		message: message.value
	}

	const xhr = new XMLHttpRequest();
	xhr.open('POST', 'https://afternoon-falls-30227.herokuapp.com/api/v1/contact_us');
	xhr.responseType = 'json';

	if (data)
		xhr.setRequestHeader('Content-Type', 'application/json');

	xhr.onload = () => {
		if (xhr.status >= 300) {
			if (xhr.response.error.name)
				nameError.textContent = xhr.response.error.name;
			else
				nameError.textContent = '';

			if (xhr.response.error.email)
				emailError.textContent = xhr.response.error.email;
			else
				emailError.textContent = '';

			if (!subject.value) {
				subjectError.textContent = 'Subject is Required';
				res.textContent = '';
			}
			else
				subjectError.textContent = '';

			if (!message.value) {
				messageError.textContent = 'Message is Required';
				res.textContent = '';
			}
			else
				messageError.textContent = '';
		}
		else {
			if (!subject.value) {
				subjectError.textContent = 'Subject is Required';
				res.textContent = '';
			}

			if (!message.value) {
				messageError.textContent = 'Message is Required';
				res.textContent = '';
			}

			if (xhr.status == 200 && message.value && subject.value) {
				messageError.textContent = '';
				subjectError.textContent = '';
				res.textContent = xhr.response.message;
			}
		}
	};
	xhr.send(JSON.stringify(data));
}

submit.addEventListener('click', sendData);