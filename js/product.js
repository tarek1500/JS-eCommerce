//var queryString = decodeURIComponent(window.location.search); //parsing
//queryString = queryString.substring(1);
//var url = 'https://afternoon-falls-30227.herokuapp.com/api/v1/products/HT-5000' ;
//+ queryString;
var queryString = decodeURIComponent(window.location.search); //parsing
queryString = queryString.substring(1);
var url = 'https://afternoon-falls-30227.herokuapp.com/api/v1/products/' + queryString;
    $.getJSON(url, function(data) {
     
  

        var text = `ProductID: ${data.data.ProductId}`	
        $(".txt").html(text);
		
		
		 var text1 =`${data.data.Category}` 
		 $("#Category").html(text1);
		 
		 var text2 =`${data.data.MainCategory}` 
		 $("#MainCategory").html(text2);
		 
		 var text3 =`${data.data.TaxTarifCode}` 
		 $("#TaxTarifCode").html(text3);
	 var text4 =`${data.data.SupplierName}` 
		 $("#SupplierName").html(text4);
		  var text5 =`${data.data.WeightMeasure}` 
		 $("#WeightMeasure").html(text5);
		 
		  var text6 =` ${data.data.WeightUnit}` 
		 $("#WeightUnit").html(text6);
		 var text7 =`${data.data.Description}` 
		 $("#description").html(text7);
		  var text8 =`${data.data.Name}` 
		 $("#name").html(text8);
		  
		  var text9 =`${data.data.DateOfSale}` 
		 $("#DateOfSale").html(text9);
		  var text10 =`${data.data.Status}` 
		 $("#Status").html(text10);
		 
		   var text11 =`${data.data.Quantity}` 
		 $("#Quantity").html(text11);
		   var text12 =`${data.data.UoM}` 
		 $("#UoM").html(text12);
		   var text13 =`${data.data.CurrencyCode}` 
		 $("#CurrencyCode").html(text13);
		   var text14 =` $ ${data.data.Price}` 
		 $("#prices").html(text14);
		   var text15 =`${data.data.Width}` 
		 $("#Width").html(text15);
		   var text16 =`${data.data.Depth}` 
		 $("#Depth").html(text16);
		   var text17 =`${data.data.Height}` 
		 $("#Height").html(text17);
		   var text18 =`${data.data.DimUnit}` 
		 $("#DimUnit").html(text18);
		 var text19 =`${data.data.ProductPicUrl}` 
         
		 $( "#product-img" ).attr('src', text19);

		 
    });