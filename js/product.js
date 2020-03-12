var stored_qty;
var quantity;
var calculated_quantity;
var myArr;
var statusError;
var error_msg ;
var queryString;
queryString = decodeURIComponent(window.location.search); //parsing
queryString = queryString.substring(1);
var url = 'https://afternoon-falls-30227.herokuapp.com/api/v1/products/' + queryString;

if(!queryString){
    
    error_msg = `data not found`;
	document.getElementById("error").innerHTML=error_msg;
    document.getElementById("section").style.display = "none";
    
}
else{
//get quantity from database
//prefixes of implementation that we want to test
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
 
//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
 
if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.");
}
var db;
var request = window.indexedDB.open("cart", 1);
request.onerror = function(event) {
	console.log("error: ");
};
request.onsuccess = function(event) {
	db = request.result;
	console.log("success: "+ db);
};

function read() {
    var transaction = db.transaction(["Cart_Orders"],"readonly");
    var objectStore = transaction.objectStore("Cart_Orders");
    var index = objectStore.index("prod_idx");
    var request = index.get(queryString);
    request.onerror = function(event) {
       console.log("Unable to retrieve daa from database!");
    };
    request.onsuccess = function(event) {
		console.log(request);
        if(request.result) {
            console.log("PRODUCT_ID:",request.result.prod_id);
			console.log("Quantity",request.result.quantity);
			stored_qty = request.result.quantity;
			console.log("stored_qty",stored_qty);
			calculated_quantity = quantity - stored_qty;
			console.log("Quantity",quantity);
			console.log("calculated_quantity",calculated_quantity);
			document.getElementById("Quantity").innerHTML = calculated_quantity;
        } else {
            console.log("no quantity be found in your database!"); 
			
			document.getElementById("Quantity").innerHTML = quantity;
        }
    };
}

var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  statusError = this.status;
  if (this.readyState == 4 && this.status == 200) {
    var myArr = JSON.parse(this.responseText);
    myFunction(myArr);
      	read();
  }else if(this.status == 404){
	error_msg = `data not found` 
   
	document.getElementById("error").innerHTML =error_msg;
  
    document.getElementById("section").style.display = "none";
  }
};
xmlhttp.open("GET", url, true);
xmlhttp.onerror = function () {

};
xmlhttp.send(); 


function myFunction(arr) {
	    console.log(arr);
 
		var obj = arr.data;
        var category = obj.Category;
		document.getElementById("Category").innerHTML = category;
		 
	     var SupplierName =obj.SupplierName;
		 document.getElementById("SupplierName").innerHTML = SupplierName;
		 
		  var WeightMeasure =obj.WeightMeasure;
		
		 
		  var WeightUnit =obj.WeightUnit;
		  var Widths=WeightMeasure+" "+WeightUnit;
		 
		document.getElementById("WeightMeasure").innerHTML=Widths;
		 var Description =obj.Description;
		 document.getElementById("description").innerHTML = Description;
		  var Name=obj.Name;
		document.getElementById("name").innerHTML = Name;
		  
		
		  var Status =obj.Status; 
		 document.getElementById("Status").innerHTML = Status;
		   quantity =obj.Quantity;
		 
		   var CurrencyCode =obj.CurrencyCode; 
		 
		   var Price =obj.Price;
		   var Prices=Price+ " "+CurrencyCode;
		    document.getElementById("prices").innerHTML=Prices;
		 
		   var Width =obj.Width;
		
		   var Depth =obj.Depth;
		
		   var Height =obj.Height;
		   var vol=Width*Depth*Height;
		    var DimUnit =obj.DimUnit
		 var volumeunit= vol+" "+DimUnit;
		   
		document.getElementById("Volume").innerHTML = volumeunit;
		var ProductPicUrl =obj.ProductPicUrl; 
		 document.getElementById("product-img").src = ProductPicUrl;
		
		  document.getElementById("error").style.display = "none";
		
		
  }

}









	
	
	
	
	