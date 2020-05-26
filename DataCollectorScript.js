global.fetch = require("node-fetch");

async function getProducts(){
    var i;
    var final_data = [];
    for (i = 1; i < 2; i++) {
        let response = await fetch("https://api.bestbuy.com/v1/products(marketplace=false&(categoryPath.id=abcat0501000))?apiKey=TWVhgdNpaxCG1GSk4IReKegI&show=name,images&pageSize=100&page=" + i + "&format=json");
        //let response = await fetch("https://api.bestbuy.com/v1/products(sku=*)?apiKey=TWVhgdNpaxCG1GSk4IReKegI&sort=salePrice.asc&show=name,images&pageSize=100&page=" + i + "&format=json");
        let data  = await response.json();
        if(i == 1){
            final_data = data["products"];
        }
        else{
            final_data = final_data.concat(data["products"]);
        }
    }
    return final_data;
}

getProducts().then(function(data){
    //console.log(data);
    var i;
    var j;
    var productCSV = [];
    var productName;
    for (i = 0; i < data.length; i++) {
      //productName = "" + data[i]["name"].split(" ").join("") + "";
      productName = "" + data[i]["name"] + "";
      productName = productName.replace(/\//g, "");
      var imageURL = "";
      for (j = 0; j < data[i]["images"].length; j++){
        if(j == 0){
          imageURL = data[i]["images"][j]["href"];
        }
        else{
          imageURL = imageURL + "," + data[i]["images"][j]["href"];
        }
        //if(!data[i]["images"][j]["href"].includes("gif")){

        //}
      }
      productCSV[i] = {name: productName, links: imageURL}
    }
    const createCsvWriter = require('csv-writer').createObjectCsvWriter;
    const csvWriter = createCsvWriter({
      path: 'out.csv',
      header: [
        {id: 'name', title: 'Label Name'},
        {id: 'links', title: 'Links'},
      ]
    });


    csvWriter
      .writeRecords(productCSV)
      .then(()=> console.log('The CSV file was written successfully'));
})
