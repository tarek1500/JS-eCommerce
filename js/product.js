//var queryString = decodeURIComponent(window.location.search); //parsing
//queryString = queryString.substring(1);
//var url = 'https://afternoon-falls-30227.herokuapp.com/api/v1/products/HT-5000' ;
//+ queryString;
//var queryString = decodeURIComponent(window.location.search); //parsing
//queryString = queryString.substring(1);
var queryString = 'HT-1000';
var url = 'https://afternoon-falls-30227.herokuapp.com/api/v1/products/' + queryString;

/*    $.getJSON(url, function(data) {

        var product_id = `ProductID: ${data.data.ProductId}`;
		
		
		 var category =`${data.data.Category}` 
		 $("#Category").html(category);
		 
		 var MainCategory =`${data.data.MainCategory}` 
		 $("#MainCategory").html(MainCategory);
		 
		 var TaxTarifCode =`${data.data.TaxTarifCode}` 
		 $("#TaxTarifCode").html(TaxTarifCode);
	 var SupplierName =`${data.data.SupplierName}` 
		 $("#SupplierName").html(SupplierName);
		  var WeightMeasure =`${data.data.WeightMeasure}` 
		 $("#WeightMeasure").html(WeightMeasure);
		 
		  var WeightUnit =` ${data.data.WeightUnit}` 
		 $("#WeightUnit").html(WeightUnit);
		 var Description =`${data.data.Description}` 
		 $("#description").html(Description);
		  var Name=`${data.data.Name}` 
		 $("#name").html(Name);
		  
		  var DateOfSale =`${data.data.DateOfSale}` 
		 $("#DateOfSale").html(DateOfSale);
		  var Status =`${data.data.Status}` 
		 $("#Status").html(Status);
		 
		   var Quantity =`${data.data.Quantity}` 
		 $("#Quantity").html(Quantity);
		   var UoM =`${data.data.UoM}` 
		 $("#UoM").html(UoM);
		   var CurrencyCode =`${data.data.CurrencyCode}` 
		 $("#CurrencyCode").html(CurrencyCode);
		   var Price =` $ ${data.data.Price}` 
		 $("#prices").html(Price);
		   var Width =`${data.data.Width}` 
		 $("#Width").html(Width);
		   var Depth =`${data.data.Depth}` 
		 $("#Depth").html(Depth);
		   var Height =`${data.data.Height}` 
		 $("#Height").html(Height);
		   var DimUnit =`${data.data.DimUnit}` 
		 $("#DimUnit").html(DimUnit);
		 var ProductpicUrl =`${data.data.ProductPicUrl}` 
         
		 $( "#product-img" ).attr('src', ProductpicUrl);
        $("#error").hide();

    }).error(function() { 
         var error_msg = `data not found` 
            $("#error").html(error_msg);
        $("#section").hide();
    
    
    });*/
	
	
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    var myArr = JSON.parse(this.responseText);
    myFunction(myArr);
  }else if(this.status == 404){
	var error_msg = `data not found` 
    $("#error").html(error_msg);
    $("#section").hide(); 
  }
};
xmlhttp.open("GET", url, true);
xmlhttp.onerror = function () {

};
xmlhttp.send();

function myFunction(arr) {
	console.log(arr);
	console.log("test1",arr.data);
         var category =`${arr.data.Category}` 
		 $("#Category").html(category);
		 
		 var MainCategory =`${arr.data.MainCategory}` 
		 $("#MainCategory").html(MainCategory);
		 
		 var TaxTarifCode =`${arr.data.TaxTarifCode}` 
		 $("#TaxTarifCode").html(TaxTarifCode);
	     var SupplierName =`${arr.data.SupplierName}` 
		 $("#SupplierName").html(SupplierName);
		  var WeightMeasure =`${arr.data.WeightMeasure}` 
		 $("#WeightMeasure").html(WeightMeasure);
		 
		  var WeightUnit =`${arr.data.WeightUnit}` 
		 $("#WeightUnit").html(WeightUnit);
		 var Description =`${arr.data.Description}` 
		 $("#description").html(Description);
		  var Name=`${arr.data.Name}` 
		 $("#name").html(Name);
		  
		  var DateOfSale =`${arr.data.DateOfSale}` 
		 $("#DateOfSale").html(DateOfSale);
		  var Status =`${arr.data.Status}` 
		 $("#Status").html(Status);
		 
		   var Quantity =`${arr.data.Quantity}` 
		 $("#Quantity").html(Quantity);
		   var UoM =`${arr.data.UoM}` 
		 $("#UoM").html(UoM);
		   var CurrencyCode =`${arr.data.CurrencyCode}` 
		 $("#CurrencyCode").html(CurrencyCode);
		   var Price =`${arr.data.Price}` 
		 $("#prices").html(Price);
		   var Width =`${arr.data.Width}` 
		 $("#Width").html(Width);
		   var Depth =`${arr.data.Depth}` 
		 $("#Depth").html(Depth);
		   var Height =`${arr.data.Height}` 
		$("#Height").html(Height);
		var DimUnit =`${arr.data.DimUnit}` 
		$("#DimUnit").html(DimUnit);
		 var ProductpicUrl =`${arr.data.ProductPicUrl}` 
		 $( "#product-img" ).attr('src', ProductpicUrl);
		$("#error").hide();
  }











	
	
	
	
	