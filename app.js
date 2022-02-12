const express = require('express');
const crypto = require("crypto");
const cookieParser = require('cookie-parser');
const con = require('./config');
const app = express();
app.use(express.urlencoded({extended: true}));
app.listen(process.ENV.PORT || 3000);
app.use(cookieParser());

app.use(express.static(__dirname + '/public'));

app.get('/user',(req,res)=>{
    con.query('SELECT * FROM user', (e,result) => {
        if(e) res.send('DB ERROR');
        else res.send(JSON.stringify(result));
    });
});

app.get('/product',(req,res)=>{ 
    if(req.cookies.token){
        let token = req.cookies.token;
        con.query(`SELECT * FROM user WHERE token = "${token}"`, (e, result)=>{
            if(e) res.send(e)
            else if(result.length > 0){
                con.query('SELECT * FROM product', (e,result) => {
                    if(e) res.send('DB ERROR');
                    else res.send(JSON.stringify(result));
                });
            

        }
        else{
            res.status(401);
            res.send("Log in please!");
        }
    })

    }


});

app.get("/cart", (req, res)=>{
    console.log(req.query.id);
    let token = req.cookies.token;
    con.query(`SELECT * FROM user WHERE token = '${token}'`, (e, result)=>{
        if(e){
            res.send(e);
        }
        else{
            user_id = result[0].id;
            con.query(`SELECT * FROM cart WHERE user_id = ${user_id}`, (e, result)=>{
                if(e){
                    res.send(e);
                }
                else{
                    cart_id = result[0].id;
                    con.query(`INSERT INTO cart_product (cart_id, product_id) VALUES(${cart_id}, ${req.query.id})`,(e, result)=>{
                        if(e){
                            res.send(e);
                        }
                        else{
                            console.log(result);
                            res.redirect("index.html");
                        }
                    })
                }
            });
                

        }
    });


})

app.get('/cart/products', (req,res)=>{ 
    let token = req.cookies.token; 
    con.query(`SELECT * FROM user WHERE token = '${token}'`, (e, result)=>{ 
        if(e) res.status(500).send(e); 
        else { 
            let userId = result[0].id; 
            con.query(`SELECT * FROM cart WHERE user_id = ${userId}`, (e, result)=>{ 
                if(e) res.status(500).send(e); 
                else { 
                    let cartId = result[0].id; 
                    con.query(`SELECT * FROM cart_product WHERE cart_id = ${cartId}`, (e,cp)=>{ 
                        if(e) res.status(500).send(e); 
                        con.query(`SELECT * FROM product`, (e,products)=>{ 
                            let a = []; 
                            let sum = 0;
                            cp.forEach((p)=>{ 
                                let productId = p.product_id; 
                                let product = products.find((pp)=>pp.id == productId); 
                                let cartProduct = { 
                                    id: p.id, 
                                    product: product 
                                } 
                                sum += product.price;
                                a.push(cartProduct); 
                            }) 
                            
                        }) 
                    }) 
                } 
            }); 
        } 
    }); 
})
    
app.get("/delete-cart", (req, res)=>{
    let id = req.query.id;
    con.query(`DELETE FROM cart_product WHERE id = ${id}`, (e)=>{
        if(e){
            res.send(e)
        }
        else {
            res.redirect('/');
        }
    })
})

app.post('/user',(req,res) => {
    let user = req.body;
    con.query(`INSERT INTO 
    user(name,password,card,balance)
    VALUES('${user.login}','${user.password}','${user.card}',0)`,
    (e,result) => {
        if(e) res.send(e);
        else res.send('SUCCESS');
    })
});

app.post('/product',(req,res) => {
    let product = req.body;
    con.query(`INSERT INTO 
    product(name,description,img,price)
    VALUES('${product.name}','${product.description}','${product.img}',${product.price})`,
    (e,result) => {       
        if(e) res.send(e);
        else res.send('SUCCESS');
    })
});

app.post('/login' , (req , res)=>{
    let user = req.body;
con.query(`SELECT * FROM user WHERE name = '${user.name}'`,
    (error, result) => {
        if (error)
            res.status(500).send('DataBase ErroR ' + error);
        else
        if(result.length > 0){
            if (result[0].password == user.password) {
                auth(result[0].id, res);
            }
            else res.status(401).send("Wrong Pass");
        }
        else res.status(401).send("Wrong Login");
})
});

function auth(id, res){
    let token = generateToken();
    con.query(`UPDATE user SET token = "${token}" WHERE id = ${id}`, (err, result)=>{
        if(err){
            res.status(500).send(err);
        }
        else{
            res.status(200).send(token);
        }
    });
}
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('index.html')
})

function generateToken(){
    return crypto.randomBytes(64).toString("hex");                         
}
app.get("/order", (req, res) =>{

});  