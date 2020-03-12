document.addEventListener('DOMContentLoaded', e => {
	sendRequest('Accessories', 1);

	let productsStatsUrl = 'https://afternoon-falls-30227.herokuapp.com/api/v1/products-stats/';
	fetch(productsStatsUrl).then(response => response.json()).then(response => {
		if (response.status) {
			let list = document.querySelector('#category-list');
			let categories = response.data.Groups.Category;

			for (const key in categories) {
				if (categories.hasOwnProperty(key)) {
					let li = document.createElement('li');
					let a = document.createElement('a');

					a.setAttribute('href', '#');
					a.setAttribute('data-name', key);
					a.setAttribute('data-page', 1);
					a.innerText = key;
					a.addEventListener('click', categoryClicked);
					li.appendChild(a);
					list.appendChild(li);
				}
			}
		}
	});

	function categoryClicked (e) {
		e.preventDefault();

		let name = e.target.dataset.name;
		let page = +e.target.dataset.page;
		sendRequest(name, page);

		$('html,body').animate({
			scrollTop: $('.goto-here').offset().top + 300
		}, 500, 'easeInOutExpo');
	}

	function sendRequest (name, page) {
		let productsUrl = `https://afternoon-falls-30227.herokuapp.com/api/v1/products?category=${name}&page=${page}`;
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
							`<div class="col-sm-6 col-md-6 col-lg-4 fadeInUp ftco-animated">
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
											<a href="#" class="add-to-cart text-center py-2 mr-1" data-id="${product.ProductId}" data-max="${product.Quantity}">
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
					a.setAttribute('data-name', name);
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
							a.setAttribute('data-name', name);
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
					a.setAttribute('data-name', name);
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

let MaxQuantity={}
$('body').delegate('.add-to-cart','click',addToCart)

function addToCart(event)
{
    event.preventDefault()
    const product_id= this.getAttribute('data-id')
    const APImax=this.getAttribute('data-max')
    console.log(product_id);
    if(db instanceof IDBDatabase)
    {        
        if(APImax-MaxQuantity[product_id]==0)
        {
            this.innerText="out of stock"
        }
        else{
        const tx = db.transaction(CART_STORE_NAME , 'readwrite')
        const cartStore = tx.objectStore(CART_STORE_NAME)
        let addrequest= cartStore.add({

                    prod_id : product_id , 
                    quantity : 1
        })
        addrequest.onsuccess=e=>{

            console.log("added succesfully");
            this.innerText= 'added succesfully'
            updateCartTotalNumber()
            
        }
        
        addrequest.onerror = e=>{
            console.log(e.target.error);
            console.log("already exist");
            this.innerText='already exist'
            
            
        }
        
    }
}

}

const DBName = 'cart'
const DBVersion = 1
let db;
const CART_STORE_NAME ='Cart_Orders' 
const ORDERS_STORE_NAME = 'Orders_History'
if ('indexedDB' in window)
    openDB()
function openDB()
{
    const req = indexedDB.open(DBName,DBVersion)
    req.onupgradeneeded=(e=>{
        console.log('onupgradeneeded')
        db=event.target.result
        if(DBVersion < 2)
        {
            db.createObjectStore(CART_STORE_NAME,{keyPath:'id',autoIncrement : true})
            db.createObjectStore(ORDERS_STORE_NAME ,{keyPath:'id',autoIncrement:true})
            tx=req.transaction.objectStore(CART_STORE_NAME)
            prod_index=tx.createIndex('prod_idx','prod_id',{unique : true})
        }
       
    })

    req.onsuccess=(e=>{

        console.log("onsuccess");
        db = event.target.result
        getDBQuantity()
        updateCartTotalNumber()
        
    })
}


function getDBQuantity()
{
    const tx = db.transaction(ORDERS_STORE_NAME,'readonly')
    const store = tx.objectStore(ORDERS_STORE_NAME)
    const req = store.getAll()
    req.onsuccess = e=>{
       let orders = event.target.result
        orders=orders.map(order => order.products)
        orders.forEach(productsOrder=>{
           productsOrder.forEach(product =>{
            if(MaxQuantity.hasOwnProperty(`${product.id}`)){
                MaxQuantity[product.id]+=+product.quantity
            }
            else{
             Object.defineProperty(MaxQuantity,`${product.id}`,{writable:true,value:+product.quantity})
            }
         })
        })
    }
}

function updateCartTotalNumber()
{
    if(db instanceof IDBDatabase)
    {
        // const totalNumber = document.querySelector('.icon-shopping_cart')
        const totalNumber = document.querySelector('#totalNumber')
        const tx= db.transaction(CART_STORE_NAME,'readwrite')
        const store=tx.objectStore(CART_STORE_NAME)
        const getALLReq = store.getAll()
        getALLReq.onsuccess = e=>{
            // console.log(event.target.result.length);
            totalNumber .textContent=`[${event.target.result.length}]`
            if(event.target.result.length == 0)
            {
                showNoProductsWarning()
            }
        }
        
    }
}