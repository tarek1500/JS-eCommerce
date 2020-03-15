var stored_qty;
var quantity;
var calculated_quantity;
var myArr;
var statusError;
var error_msg ;
var queryString = decodeURIComponent(window.location.search).substring(1);
var url = `https://afternoon-falls-30227.herokuapp.com/api/v1/products/${queryString}`;

if (!queryString) {
	error_msg = 'data not found';
	document.getElementById('error').innerHTML = error_msg;
	document.getElementById('section').style.display = 'none';
}
else {
	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
	window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
 
	if (!window.indexedDB)
		window.alert('Your browser doesn\'t support a stable version of IndexedDB.');

	var request = window.indexedDB.open('cart', 1);

	request.onsuccess = function (event) {
		db = request.result;
	};

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
		statusError = this.status;

		if (this.readyState == 4 && this.status == 200) {
			var myArr = JSON.parse(this.responseText);
			setData(myArr);
		}
		else if (this.status == 404) {
			error_msg = 'data not found';
			document.getElementById('error').innerHTML = error_msg;
			document.getElementById('section').style.display = 'none';
		}
	};
	xmlhttp.open('GET', url, true);
	xmlhttp.send();

	function setData (arr) {
		var obj = arr.data;
		var category = obj.Category;
		document.getElementById('Category').innerHTML = category;

		var SupplierName = obj.SupplierName;
		document.getElementById('SupplierName').innerHTML = SupplierName;

		var WeightMeasure = obj.WeightMeasure;
		var WeightUnit = obj.WeightUnit;
		var Widths = WeightMeasure + ' ' + WeightUnit;
		document.getElementById('WeightMeasure').innerHTML = Widths;

		var Description = obj.Description;
		document.getElementById('description').innerHTML = Description;

		var Name = obj.Name;
		document.getElementById('name').innerHTML = Name;

		var Status = obj.Status;
		document.getElementById('Status').innerHTML = Status;

		let quantity = document.querySelector('#Quantity');
		let calQuantity = obj.Quantity;

		if (MaxQuantity.hasOwnProperty(`${obj.ProductId}`))
			calQuantity = obj.Quantity - MaxQuantity[obj.ProductId];

		quantity.innerText = calQuantity;

		if (calQuantity == 0)
			document.getElementById('Status').innerText = "Not Avaiable";

		var CurrencyCode = obj.CurrencyCode;
		var Price = obj.Price;
		var Prices = Price + ' ' + CurrencyCode;	
		document.getElementById('prices').innerHTML = Prices;

		var Width = obj.Width;
		var Depth = obj.Depth;
		var Height = obj.Height;
		var vol = `${Width} x ${Depth} x ${Height}`;
		var DimUnit = obj.DimUnit;
		var volumeunit = `${vol} ${DimUnit}`;
		document.getElementById('Volume').innerHTML = volumeunit;

		var ProductPicUrl = obj.ProductPicUrl;
		document.getElementById('product-img').src = ProductPicUrl;

		let addToCart = document.querySelector('.add-to-cart');
		addToCart.setAttribute('data-id', obj.ProductId);
		addToCart.setAttribute('data-max', obj.Quantity);
		document.getElementById('error').style.display = 'none';
	}
}