//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
//LEVEL 5
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const { Passport } = require('passport');

const app = express();



app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

//LEVEL 5
app.use(session({
    secret: "Meu pequeno segredo.",
    resave: false,
    saveUninitialized: false
}));

//LEVEL 5
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB")
//LEVEL 5
// mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

//LEVEL 5
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

//LEVEL 5
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/", function(req, res){
    res.render("home");
});

//LEVEL 5
app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

//LEVEL 5
app.get("/secrets", function(req, res){
    if (req.isAuthenticated()){
        res.render("secrets");
    } else {
        res.redirect("/login");
    }
});

//LEVEL 5
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

//LEVEL 5
app.post("/register", function(req, res){
   User.register({username: req.body.username}, req.body.password, function(err, user){
       if (err) {
           console.log(err);
           res.redirect("/register");
       } else {
           passport.authenticate("local")(req, res, function(){
               res.redirect("/secrets");
           });
       }
   });
    
});

//LEVEL 5
app.post("/login", function(req, res){
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function(err){
        if (err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function(){
            res.redirect("/secrets");
            });
         }
        });     
});



app.listen(3000, function(){
    console.log("Servidor iniciou na porta 3000");
});