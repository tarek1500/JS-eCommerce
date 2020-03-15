const productsContainer = document.querySelector('#productsContainer');
const cartTotal = document.querySelector('#cartTotal');
const checkoutBtn = document.querySelector('#checkout');

window.onload = e => {
	if ('indexedDB' in window)
		openDB();
};

function openDB () {
	const req = indexedDB.open(DBName, DBVersion);

	req.onupgradeneeded = e => {
		db = event.target.result;
		if (DBVersion < 2) {
			db.createObjectStore(CART_STORE_NAME, { keyPath: 'id', autoIncrement: true });
			db.createObjectStore(ORDERS_STORE_NAME, { keyPath: 'id', autoIncrement: true });
			tx = req.transaction.objectStore(CART_STORE_NAME);
			prod_index = tx.createIndex('prod_idx', 'prod_id', { unique: true });
		}
	}
	req.onsuccess = e => {
		db = event.target.result;
		getDBQuantity();
		getDataFromDB().then((products) => {
			if (products.length > 0)
				productsContainer.innerHTML = '';

			products.forEach(product => {
				getFromApi(product.prod_id).then(response => {
					const productQuantity = MaxQuantity[response.data.ProductId] ? response.data.Quantity - MaxQuantity[response.data.ProductId] : response.data.Quantity;
					let cart_product = `
						<tr class="text-center">
							<td class="product-remove"><a href="#" class ='ion-ios-close' data-id="${response.data.ProductId}" ></a></td>
							<td class="image-prod"><div class="img" style="background-image:url(${response.data.ProductPicUrl});"></div></td>
							<td class="product-name">
								<h3>${response.data.Name}</h3>
								<p>${response.data.Description}</p>
							</td>
							<td class="price">${response.data.Price} ${response.data.CurrencyCode}</td>
							<td class="quantity">
								<div class="input-group mb-3">
									<input type="number" name="quantity" class="quantity form-control input-number" value="${product.quantity}" min="1" max="${productQuantity}">
								</div>
							</td>
							<td class="total">${product.quantity * response.data.Price} ${response.data.CurrencyCode}</td>
						</tr>`;
					productsContainer.innerHTML += cart_product;
					updateCartTotal();
					updateCartTotalNumber();
				});
			});
		});
	};
	req.onerror = e => { };
}

function getFromApi(id) {
	let url = `https://afternoon-falls-30227.herokuapp.com/api/v1/products/${id}`;

	return $.ajax({
		url: url
	});
}

function getDataFromDB () {
	return new Promise((resolve, reject) => {
		const tx = db.transaction(CART_STORE_NAME);
		const store = tx.objectStore(CART_STORE_NAME);

		store.getAll().onsuccess = e => {
			const products = event.target.result;
			resolve(products);
		};
	});
}

$('body').delegate('.product-remove', 'click', removeFormCart);
$('body').delegate('input.quantity', 'input', changeQuantity);

function removeFormCart (event) {
	event.preventDefault();
	const prod_id = event.target.getAttribute('data-id');
	const tx = db.transaction(CART_STORE_NAME, 'readwrite');
	const store = tx.objectStore(CART_STORE_NAME);
	const id_index = store.index('prod_idx');
	let request = id_index.get(prod_id);

	request.onsuccess = e => {
		const DB_ID = request.result.id;
		delReq = store.delete(DB_ID);

		delReq.onsuccess = e => {
			event.target.parentElement.parentElement.remove();
			updateCartTotal();
			updateCartTotalNumber();
		};
	};
}

function changeQuantity (e) {
	const productRow = e.target.parentElement.parentElement.parentElement;
	const quantity = +e.target.value;
	let price = productRow.querySelector('.price').textContent;
	price = price.substring(0, price.length - 4);
	const total = productRow.querySelector('.total');
	total.textContent = price * quantity + ' EUR';
	updateCartTotal();

	const product_ID = productRow.cells[0].querySelector('a').getAttribute('data-id');
	const tx = db.transaction(CART_STORE_NAME, 'readwrite');
	const store = tx.objectStore(CART_STORE_NAME);
	const id_index = store.index('prod_idx');
	const Request = id_index.get(product_ID);
	Request.onsuccess = e => {
		let prod_obj = event.target.result;
		prod_obj.quantity = quantity;
		store.put(prod_obj);
	};
}

function updateCartTotal () {
	const totals = document.querySelectorAll('.total');
	let cartTotalValue = 0;

	totals.forEach(ele => {
		ele = ele.textContent.substring(0, ele.textContent.length - 4);
		cartTotalValue += +ele;
	});
	cartTotal.textContent = `${cartTotalValue} EUR`;

}

checkoutBtn.addEventListener('click', e => {
	e.preventDefault();
	
	if (db instanceof IDBDatabase) {
		const productsRows = document.querySelectorAll('tbody tr');
		if (productsRows.length >= 1) {
			let orderArray = [];

			if (!productsRows[0].innerHTML.includes('No Products to Show')) {
				productsRows.forEach(productsRow => {
					const product_ID = productsRow.cells[0].querySelector('a').getAttribute('data-id');
					const quantity = productsRow.cells[4].querySelector('input').value;

					orderArray.push({
						id: product_ID,
						quantity: quantity
					});
				});

				const tx = db.transaction(ORDERS_STORE_NAME, 'readwrite');
				const store = tx.objectStore(ORDERS_STORE_NAME);
				let addReq = store.add({
					products: orderArray,
					date: new Date().toLocaleString(),
					total: cartTotal.textContent
				});

				addReq.onsuccess = e => { };

				const rows = document.querySelectorAll('.product-remove a');
				rows.forEach(row => {
					row.click();
				});

				const successAlert = document.querySelector('.alert');
				successAlert.classList.remove('d-none');

				setTimeout(() => {
					successAlert.classList.add('d-none');
				}, 10000);
			}
		}
	}
});

function showNoProductsWarning () {
	const element =
		`<tr class="text-center">
			<td class="product-remove"></td>
			<td class="image-prod"><div class="img"></div></td>
			<td class="product-name" style ="width: 55%;">
				<h3></h3>
				<p>No Products to Show <br><a href="./shop.html">add some</a></p>
			</td>
			<td class="price"></td>
			<td class="quantity">
				<div class="input-group mb-3"></div>
			</td>
			<td class="total"></td>
		</tr>`;
	productsContainer.innerHTML = element
}