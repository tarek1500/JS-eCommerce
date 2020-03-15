document.addEventListener('DOMContentLoaded', e => {
	document.querySelector('.search-form').addEventListener('submit', event => {
		event.preventDefault();

		let search = event.target.querySelector('input[type=text]').value;
		window.location.href = `search.html?${search}`;
	});
});