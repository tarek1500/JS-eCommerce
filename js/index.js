document.addEventListener('DOMContentLoaded', e => {
	let productsUrl = `https://afternoon-falls-30227.herokuapp.com/api/v1/products?page=6&limit=2`;
	fetch(productsUrl).then(response => response.json()).then(response => {
		if (response.status) {
			let products = response.data;

			for (let i = 0; i < products.length; i++) {
				const product = products[i];
				const elements = document.querySelectorAll(`.slider-item-${i + 1}`);

				for (const key in elements) {
					if (elements.hasOwnProperty(key)) {
						let element = elements[key];
						element.querySelector('.one-third').style.backgroundImage = 'url(' + product.ProductPicUrl + ')';
						element.querySelector('.horizontal > h1').innerText = product.Name;
						element.querySelector('.horizontal > p:first-of-type').innerText = product.Description;
						element.querySelector('.horizontal > p:last-of-type > a').setAttribute('href', `product.html?${product.ProductId}`);
					}
				}
			}
		}
	});

	productsUrl = `https://afternoon-falls-30227.herokuapp.com/api/v1/products?page=17&limit=4`;
	fetch(productsUrl).then(response => response.json()).then(response => {
		if (response.status) {
			let list = document.querySelector('#product-list');
			list.innerHTML = '';
			let products = response.data;

			for (const key in products) {
				if (products.hasOwnProperty(key)) {
					let product = products[key];
					let productUrl = `product.html?${product.ProductId}`
					let item =
						`<div class="col-sm col-md-6 col-lg fadeInUp ftco-animated">
							<div class="product">
								<a href="${productUrl}" class="img-prod">
									<img class="img-fluid" src="${product.ProductPicUrl}" alt="${product.Name}">
									<div class="overlay"></div>
								</a>
								<div class="text py-3 px-3">
									<h3><a href="${productUrl}">${product.Name}</a></h3>
									<div class="d-flex">
										<div class="pricing">
											<p class="price"><span>${product.Price} ${product.CurrencyCode}</span></p>
										</div>
									</div>
									<p class="bottom-area d-flex px-3">
										<a href="product.html?${product.ProductId}" class="buy-now text-center py-2">Shop now<span><i class="ion-ios-cart ml-1"></i></span></a>
									</p>
								</div>
							</div>
						</div>`;
					list.innerHTML += item;
				}
			}
		}
	});

	productsUrl = `https://afternoon-falls-30227.herokuapp.com/api/v1/products?category=Accessories&page=9&limit=2`;
	fetch(productsUrl).then(response => response.json()).then(response => {
		if (response.status) {
			let list = document.querySelector('#collection-list');
			let products = response.data;
			let items =
				`<div class="row">
					<div class="col-md-8 d-flex align-items-stretch">
						<div class="img" style="background-image: url(${products[0].ProductPicUrl});"></div>
					</div>
					<div class="col-md-4 py-md-5 fadeInUp ftco-animated">
						<div class="text py-3 py-md-5">
							<h2 class="mb-4">New Accessories Collection 2020</h2>
							<p>${products[0].Description}</p>
							<p><a href="product.html?${products[0].ProductId}" class="btn btn-white px-4 py-3">Shop now</a></p>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-md-5 order-md-last d-flex align-items-stretch">
						<div class="img img-2" style="background-image: url(${products[1].ProductPicUrl});"></div>
					</div>
					<div class="col-md-7 py-3 py-md-5 fadeInUp ftco-animated">
						<div class="text text-2 py-md-5">
							<h2 class="mb-4">New Laptops Collection 2020</h2>
							<p>${products[1].Description}</p>
							<p><a href="product.html?${products[1].ProductId}" class="btn btn-white px-4 py-3">Shop now</a></p>
						</div>
					</div>
				</div>`;
			list.innerHTML = items;
		}
	});
});