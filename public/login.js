let form = document.getElementById("login_form");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    let data = `name=${event.target["name"].value}&password=${event.target["password"].value}`;

    let xhr  = new XMLHttpRequest();
    xhr.open('POST', "/login");
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onload = () => {
        if(xhr.status == 200){
            alert("Loged in!")
            document.cookie = `token = ${xhr.response}`;
            localStorage.setItem('user', event.target['name'].value);
            window.location.replace("index.html");
        }
        else if(xhr.status = "401"){
            alert(xhr.response);
        }
        else if(xhr.status = "500"){
            console.log(xhr.response);
            alert("Server error!");
        }
    }
    xhr.send(data);
});