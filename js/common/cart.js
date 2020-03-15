const DBName = 'cart';
const DBVersion = '1';
let db;
const CART_STORE_NAME = 'Cart_Orders';
const ORDERS_STORE_NAME = 'Orders_History';
let MaxQuantity = {};

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
		updateCartTotalNumber();
	}
}

function getDBQuantity () {
	const tx = db.transaction(ORDERS_STORE_NAME, 'readonly');
	const store = tx.objectStore(ORDERS_STORE_NAME);
	const req = store.getAll();

	req.onsuccess = e => {
		let orders = event.target.result;
		orders = orders.map(order => order.products);

		orders.forEach(productsOrder => {
			productsOrder.forEach(product => {
				if (MaxQuantity.hasOwnProperty(`${product.id}`))
					MaxQuantity[product.id] += +product.quantity;
				else
					Object.defineProperty(MaxQuantity, `${product.id}`, { writable: true, value: +product.quantity });
			});
		});
	};
}

function updateCartTotalNumber () {
	if (db instanceof IDBDatabase) {
		const totalNumber = document.querySelector('#totalNumber');
		const tx = db.transaction(CART_STORE_NAME, 'readwrite');
		const store = tx.objectStore(CART_STORE_NAME);
		const getALLReq = store.getAll();

		getALLReq.onsuccess = e => {
			totalNumber.textContent = `[${event.target.result.length}]`;
		};
	}
}