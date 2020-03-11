const productsContainer = document.querySelector('#products')
let MaxQuantity={}
const httpReq = new XMLHttpRequest()
const url = 'https://afternoon-falls-30227.herokuapp.com/api/v1/products/'
httpReq.open('GET', url)
httpReq.send()
httpReq.onload = viewResponse

function viewResponse() {
    const productsList = JSON.parse(httpReq.response)
    let product = `
                <div class="col-sm-6 col-md-6 col-lg-4 " >
                    <div class="product">
                        <a href="#" class="img-prod"><img class="img-fluid" src="${productsList['data'][0]['ProductPicUrl']}" alt="Colorlib Template">
                            <div class="overlay"></div>
                        </a>
                        <div class="text py-3 px-3">
                            <h3><a href="#">${productsList['data'][0]['Name']}</a></h3>
                            <div class="d-flex">
                                <div class="pricing">
                                    <p class="price"><span>$${productsList['data'][0]['Price']}</span></p>
                                    
                                </div>
                            </div>
                            <p class="bottom-area d-flex px-3">
                                <a href="#" class="add-to-cart text-center py-2 mr-1"  data-id="${productsList['data'][0]['ProductId']}" data-max="${productsList['data'][0]['Quantity']}"><span>Add to cart <i class="ion-ios-add ml-1"></i></span></a>
                            </p>
                        </div>
                    </div>
                </div>`


    productsContainer.innerHTML+=product


     product = `
                <div class="col-sm-6 col-md-6 col-lg-4 " >
                    <div class="product">
                        <a href="#" class="img-prod"><img class="img-fluid" src="${productsList['data'][4]['ProductPicUrl']}" alt="Colorlib Template">
                            <div class="overlay"></div>
                        </a>
                        <div class="text py-3 px-3">
                            <h3><a href="#">${productsList['data'][4]['Name']}</a></h3>
                            <div class="d-flex">
                                <div class="pricing">
                                    <p class="price"><span>$${productsList['data'][4]['Price']}</span></p>
                                    
                                </div>
                            </div>
                            <p class="bottom-area d-flex px-3">
                                <a href="#" class="add-to-cart text-center py-2 mr-1"  data-id="${productsList['data'][4]['ProductId']}" data-max="${productsList['data'][4]['Quantity']}"><span>Add to cart <i class="ion-ios-add ml-1"></i></span></a>
                            </p>
                        </div>
                    </div>
                </div>`
                productsContainer.innerHTML+=product



    
    
  
    
}
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