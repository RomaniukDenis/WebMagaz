if(document.cookie.includes("token")){
    let user = localStorage.getItem('user');
    document.getElementById('reg').style.display = 'none';
    document.getElementById('profile').innerHTML = 
    `
        <a href = '/profile'> ${user} </a>
        <a href = '/logout'> Log out </a>
    `   
    document.getElementById('profile').style.backgroundColor = "white";
    document.getElementById('profile').style.position = "fixed";
    document.getElementById('profile').style.right = "5px";
    document.getElementById('profile').style.bottom = "5px";
    document.getElementById('profile').style.display = "flex";
    document.getElementById('profile').style.flexDirection = "column";
    document.getElementById('profile').style.border = "5px solid black";
}

else{
    document.getElementById('shop').style.display = 'none'; 
    document.getElementById('cartBtn').style.display = 'none'; 
}