let shopGrid = document.getElementById("shop_grid");

let xhr = new XMLHttpRequest();

xhr.open("GET", "/product");
xhr.responseType = "json";

xhr.onload = () => {
    shopGrid.innerHTML = null;
    if(xhr.response.status == "401"){
        shopGrid.innerHTML = xhr.response;
    }
    xhr.response.forEach((product)=>{
        shopGrid.innerHTML += 
        `
        <div class="product">
            <h2>${product.name}</h2>
            <img src="${product.img}">
            <p>${product.description}</p>
            <p>Price: ${product.price}</p>
            <a href="/cart?id=${product.id}">Buy</a>
        <div>
        `
    })
}

xhr.send();
