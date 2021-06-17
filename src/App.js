const express=require('express');
require("./db/connection");

const path=require("path");
const hbs=require("hbs");
const bcrypt=require("bcrypt");
const CustomerDetail=require("./model/schema");

const port=process.env.PORT || 8000;
const app=express();

const staticPath=path.join(__dirname,"../public");
const templatePath=path.join(__dirname,"../templates/views");
const partialPath=path.join(__dirname,"../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(express.static(staticPath));

app.set("view engine", "hbs");
app.set("views", templatePath);

hbs.registerPartials(partialPath);

app.get("/",(req,res)=>{
    res.render("index");
});

app.get("/register",(req,res)=>{
    res.render("register");
});

app.post("/register", async (req,res)=>{
    try{
        const password = req.body.password;
        const cpassword=req.body.cpassword;

        if(password===cpassword)
        {
            const registerCustomer= new CustomerDetail({
                fname: req.body.username,
                email: req.body.useremail,
                mob: req.body.usermob,
                password: req.body.password,
                cpassword: req.body.cpassword
            })

            const registerrecord= await registerCustomer.save();
            res.status(201).render("afterlogin");
        }
        else
        {
            res.send("Password not matching");
        }
    }
    catch(err){
        res.status(400).render("error");
    }
});


app.get("/login",(req,res)=>{
    res.render("login");
});

app.post("/login",async(req,res)=>{
    try{
        const email=req.body.useremail;
        const password= req.body.password;

        const user= await CustomerDetail.findOne({email:email});
        const passwordCompare= await bcrypt.compare(password,user.password);

        if(passwordCompare)
        {
            res.status(201).render("afterlogin");
        }
        else
        {
            res.send("Invalid Credentials");
        }

    }
    catch(err)
    {
        res.status(400).render("error");
    }
});

app.listen(port,()=>{
    console.log(`Listening to port no ${port}`);
});