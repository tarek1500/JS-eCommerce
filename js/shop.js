const productsContainer = document.querySelector('#products')
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
                                <a href="#" class="add-to-cart text-center py-2 mr-1"  data-id="${productsList['data'][0]['ProductId']}"><span>Add to cart <i class="ion-ios-add ml-1"></i></span></a>
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
                                <a href="#" class="add-to-cart text-center py-2 mr-1"  data-id="${productsList['data'][4]['ProductId']}"><span>Add to cart <i class="ion-ios-add ml-1"></i></span></a>
                            </p>
                        </div>
                    </div>
                </div>`
                productsContainer.innerHTML+=product



    
    
  
    
}
// $('body').delegate('#addToCart','click',addToCart)
$('body').delegate('.add-to-cart','click',addToCart)


function addToCart(event)
{
    event.preventDefault()
    // const product_id=this.parentElement.parentElement.querySelector('#productId').innerText
    const product_id= this.getAttribute('data-id')
    let quantity=1001;
    console.log(product_id);
    
    // console.log(this.parentElement.parentElement.querySelector('#productId').innerText);
    if(db instanceof IDBDatabase)
    {
        
        const tx = db.transaction(CART_STORE_NAME , 'readwrite')
        // console.log(tx);
        // console.log(CART_STORE_NAME);
        
        const cartStore = tx.objectStore(CART_STORE_NAME)
        // console.log(cartStore);
        
    //    console.log(getRequest);
       
        // const prod_idx=cartStore.index('prod_idx')
        // let result=prod_idx.get(product_id)

        // result.onsuccess=e=>{
            
        //     this.quantity=e.target.result.quantity
        // //    console.log(e.target.result.prod_id)
        //      console.log(this.quantity);
        //      
        

        // }
        

        // console.log(quantity)
      
        let addrequest= cartStore.add({

                    prod_id : product_id , 
                    quantity : 1
        })
        addrequest.onsuccess=e=>{

            console.log("added succesfully");
            
        }
        
        addrequest.onerror = e=>{
            console.log(e.target.error);
            console.log("already exist");
            
            
        }
        
    }

}

const DBName = 'cart'
const DBVersion = 1
let db;
const CART_STORE_NAME ='Cart_Orders' 
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
            tx=req.transaction.objectStore(CART_STORE_NAME)
            prod_index=tx.createIndex('prod_idx','prod_id',{unique : true})
        }
       
    })

    req.onsuccess=(e=>{

        console.log("onsuccess");
        db = event.target.result
        
    })
}


