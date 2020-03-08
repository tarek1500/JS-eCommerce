const productsContainer = document.querySelector('#productsContainer')
const DBName = 'cart'
const DBVersion = '1'
let db ;
const CART_STORE_NAME ='Cart_Orders' 

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
                        <td class="total">$4.90</td>
                    </tr>`
            
                    productsContainer.innerHTML+=cart_product;
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
        } 
        
    }
    
}