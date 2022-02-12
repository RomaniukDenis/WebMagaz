let cartGrid = document.getElementById("cart_grid");

let xhr = new XMLHttpRequest();

xhr.open("GET", "/cart/products");
xhr.responseType = "json";

xhr.onload = () => {
    cartGrid.innerHTML = null;
    xhr.response.forEach((cart_product)=>{
        cartGrid.innerHTML += 
        `
        <div class="cart_product">
            <h2>${cart_product.product.name}</h2>
            <img src="${cart_product.product.img}">
            <p>${cart_product.product.description}</p>
            <p>Price: ${cart_product.product.price}</p>
            <a id="DeleteBtn" href="delete-cart?id=${cart_product.id}">Delete from cart</a>
        <div>
        `
    })
}

xhr.send();