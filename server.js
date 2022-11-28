const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/foodDB", {useNewUrlParser: true});

const userSchema = {
    email: String,
    password: String
};

const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res){
    res.render("zomato");
});

app.get("/Elogin", function(req, res){
    res.render("Elogin");
});

app.get("/signup", function(req, res){
    res.render("signup");
});

app.post("/signup", function(req, res){
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User ({
            email: req.body.mail,
            password: hash
        });
        newUser.save(function(err){
            if (err) {
                console.log(err);
            }else {
                res.render("zomato");
            }
    });
    
    });
});

app.post("/Elogin", function(req,res){
    const usermail = req.body.mail;
    const password = req.body.password;

    User.findOne({email: usermail}, function(err, foundUser){
        if (err) {
            console.log(err);
        }else {
            if (foundUser) {
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    if (result === true){
                        res.render("zomato");   
                    }
                });                
            }
        }
    });
});

 
app.get("/login", function(req, res){
    res.render("login");
})



app.listen(3000, function(){
    console.log("server is running......");
})