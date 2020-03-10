document.addEventListener('DOMContentLoaded', e => {
	let filter = window.location.search;
	filter = filter.substring(1);
	sendRequest(filter, 1);

	function categoryClicked (e) {
		e.preventDefault();

		let filter = e.target.dataset.filter;
		let page = +e.target.dataset.page;
		sendRequest(filter, page);
	}

	function sendRequest (filter, page) {
		let productsUrl = `https://afternoon-falls-30227.herokuapp.com/api/v1/products?q=${filter}&page=${page}`;
		fetch(productsUrl).then(response => response.json()).then(response => {
			if (response.status) {
				let list = document.querySelector('#item-list');
				list.innerHTML = '';
				let pagination = document.querySelector('#pagination');
				pagination.innerHTML = '';
				let products = response.data;
				let pages = response.total_pages;

				for (const key in products) {
					if (products.hasOwnProperty(key)) {
						let product = products[key];
						let productUrl = `product.html?${product.ProductId}`
						let item =
							`<div class="col-sm-6 col-md-4 col-lg-3 fadeInUp ftco-animated">
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
											<a href="#" class="add-to-cart text-center py-2 mr-1">
												<span>Add to cart <i class="ion-ios-add ml-1"></i></span>
											</a>
										</p>
									</div>
								</div>
							</div>`;
						list.innerHTML += item;
					}
				}

				if (pages > 0) {
					let li = document.createElement('li');
					let a = document.createElement('a');

					a.setAttribute('href', '#');
					a.setAttribute('data-filter', filter);
					a.setAttribute('data-page', (page - 1) < 1 ? 1 : (page - 1));
					a.innerText = '<';
					a.addEventListener('click', categoryClicked)
					li.appendChild(a);
					pagination.appendChild(li);

					for (let i = 0; i < pages; i++) {
						li = document.createElement('li');

						if (i == page - 1) {
							li.classList.add('active');
							span = document.createElement('span');

							span.innerText = (i + 1);
							li.appendChild(span);
						}
						else {
							a = document.createElement('a');

							a.setAttribute('href', '#');
							a.setAttribute('data-filter', filter);
							a.setAttribute('data-page', i + 1);
							a.innerText = (i + 1);
							a.addEventListener('click', categoryClicked)
							li.appendChild(a);
						}

						pagination.appendChild(li);
					}

					li = document.createElement('li');
					a = document.createElement('a');

					a.setAttribute('href', '#');
					a.setAttribute('data-filter', filter);
					a.setAttribute('data-page', (page + 1) > pages ? pages : (page + 1));
					a.innerText = '>';
					a.addEventListener('click', categoryClicked)
					li.appendChild(a);
					pagination.appendChild(li);
				}
			}
		});
	}
});