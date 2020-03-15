document.addEventListener('DOMContentLoaded', e => {
	$('body').delegate('.add-to-cart', 'click', addToCart);

	function addToCart (event) {
		event.preventDefault();

		const product_id = this.getAttribute('data-id');
		const APImax = this.getAttribute('data-max');

		if (db instanceof IDBDatabase) {
			if (APImax - MaxQuantity[product_id] == 0)
				this.innerText = 'out of stock';
			else {
				const tx = db.transaction(CART_STORE_NAME, 'readwrite');
				const cartStore = tx.objectStore(CART_STORE_NAME);
				let addrequest = cartStore.add({
					prod_id: product_id,
					quantity: 1
				});

				addrequest.onsuccess = e => {
					this.innerText = 'added succesfully';
					updateCartTotalNumber();
				};
				addrequest.onerror = e => {
					this.innerText = 'already exist';
				};
			}
		}
	}
});