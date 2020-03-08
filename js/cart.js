const productsContainer = document.querySelector('#productsContainer')
const DBName = 'cart'
const DBVersion = '1'
let db ;
const CART_STORE_NAME ='Cart_Orders' 
const ORDERS_STORE_NAME = 'Orders_History'
const cartTotal = document.querySelector('#cartTotal')
const checkoutBtn = document.querySelector('#checkout') 

window.onload= e=>{
    if ('indexedDB' in window)
    openDB()
    
}

function openDB()
{
    const req= indexedDB.open(DBName,DBVersion)
    req.onupgradeneeded=e=>{
        console.log('onupgradeneeded');
        db=event.target.result
        if(DBVersion < 2)
        {
            db.createObjectStore(CART_STORE_NAME,{keyPath:'id',autoIncrement : true})
            db.createObjectStore(ORDERS_STORE_NAME ,{keyPath:'id',autoIncrement:true})
            // tx=req.transaction.objectStore(ORDERS_STORE_NAME)
            // order_index= tx.createIndex('prod_idx','prod_id',{unique:true})
            tx=req.transaction.objectStore(CART_STORE_NAME)
            prod_index=tx.createIndex('prod_idx','prod_id',{unique : true})
        }

    }
    req.onsuccess=e=>{
        console.log('onsuccess');
        
        db = event.target.result
        getDataFromDB().then((products)=>{
            products.forEach( product =>{
                getFromApi(product.prod_id).then(response =>{
                let cart_product = `
                    <tr class="text-center">
                        <td class="product-remove"><a href="#" class ='ion-ios-close' data-id="${response.data.ProductId}" ></a></td>
                        <td class="image-prod"><div class="img" style="background-image:url(${response.data.ProductPicUrl});"></div></td>
                        <td class="product-name">
                            <h3>${response.data.Name}</h3>
                            <p>${response.data.Description}</p>
                        </td>
                        <td class="price">$${response.data.Price}</td>
                        <td class="quantity">
                            <div class="input-group mb-3">
                                <input type="number" name="quantity" class="quantity form-control input-number" value="${product.quantity}" min="1" max="100">
                            </div>
                        </td>
                        <td class="total">$${product.quantity * response.data.Price}</td>
                    </tr>`
            
                    productsContainer.innerHTML+=cart_product;
                    updateCartTotal()
                    updateCartTotalNumber()
                })//end then for getFromApi function
        
             })//end forEach

        })//end then for getDataFromDB 
       

    }//end req.onsucess
    req.onerror=e=>{
        console.log('onerror');
    }
}

function getFromApi(id)
{
    console.log(id);
    
    let url = `https://afternoon-falls-30227.herokuapp.com/api/v1/products/${id}`
    return $.ajax({
        url: url,
        });

    //error with javaScript
    // return new Promise((resolve , reject)=>{
    //     httpReq=new XMLHttpRequest()
    //     let url = `https://afternoon-falls-30227.herokuapp.com/api/v1/products/${id}`
    //     httpReq.open('GET',url)
    //     httpReq.send()
    //     httpReq.onload= e=>{
    //         resolve(JSON.parse(httpReq.response))
    //     }

    // })
        
}



  function getDataFromDB()
{
    return new Promise((resolve,reject) =>{
        const tx= db.transaction(CART_STORE_NAME)
        const store = tx.objectStore(CART_STORE_NAME)
        store.getAll().onsuccess= e=>{
            const products = event.target.result;
            resolve(products)
        }
    })
 
}

$('body').delegate('.product-remove','click',removeFormCart)
$('body').delegate('input.quantity','input' , changeQuantity)
function removeFormCart(event)
{
    event.preventDefault()
    const prod_id= event.target.getAttribute('data-id')
    const tx=db.transaction(CART_STORE_NAME,"readwrite")
    const store = tx.objectStore(CART_STORE_NAME)
    const id_index= store.index('prod_idx') 
    let request = id_index.get(prod_id)
    request.onsuccess=e=>{
       
        const DB_ID= request.result.id
        delReq=store.delete(DB_ID)
        delReq.onsuccess=e=>{
            
            event.target.parentElement.parentElement.remove() 
            updateCartTotal()
            updateCartTotalNumber()
            
        } 
        
    }

    
}

function changeQuantity(e)
{
    const productRow =  e.target.parentElement.parentElement.parentElement
    const quantity= +e.target.value
    let price = productRow.querySelector('.price').textContent
    price=price.substring(1,price.length)
    const total = productRow.querySelector('.total')
    total.textContent = '$'+price * quantity
    updateCartTotal()
    
}

function updateCartTotal()
{
    const totals= document.querySelectorAll('.total')
    let cartTotalValue=0;
    totals.forEach(ele => {
        ele = ele.textContent.substring(1,ele.textContent.length)
        cartTotalValue+=+ele

    });
    cartTotal.textContent = `$${cartTotalValue}`
    
    
}


checkoutBtn.addEventListener('click',e=>{
    e.preventDefault()
    if(db instanceof IDBDatabase)
    {
        const productsRows = document.querySelectorAll('tbody tr')
        let orderArray=[]
        productsRows.forEach(productsRow=>{
            const product_ID= productsRow.cells[0].querySelector('a').getAttribute('data-id')
            const quantity = productsRow.cells[4].querySelector('input').value
            orderArray.push({
                id : product_ID,
                quantity : quantity
            })

        })

        console.log(orderArray);
        
        const tx= db.transaction(ORDERS_STORE_NAME,'readwrite')
        const store = tx.objectStore(ORDERS_STORE_NAME)
        let addReq= store.add({
            products : orderArray,
            date : new Date().toLocaleString(),
            total : cartTotal.textContent

        })
        addReq.onsuccess=e=>{
            console.log("order saved");
            
        }
        
        
    }
})

function updateCartTotalNumber()
{
    if(db instanceof IDBDatabase)
    {
        // const totalNumber = document.querySelector('.icon-shopping_cart')
        const totalNumber = document.querySelector('#totalNumber')
        console.log(totalNumber);
        
        const tx= db.transaction(CART_STORE_NAME,'readwrite')
        const store=tx.objectStore(CART_STORE_NAME)
        const getALLReq = store.getAll()
        getALLReq.onsuccess = e=>{
            // console.log(event.target.result.length);
            totalNumber .textContent=`[${event.target.result.length}]`
        }
        
    }
}

