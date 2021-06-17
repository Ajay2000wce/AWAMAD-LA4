
const mongoose=require("mongoose");
const bcrypt=require("bcrypt");

const UserSchema= new mongoose.Schema({
    fname:{
        type:String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    mob:{
        type:String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    cpassword:{
        type: String,
        required: true
    }
});

UserSchema.pre("save", async function(next){
    if(this.isModified("password"))
    {
        this.password= await bcrypt.hash(this.password,4);
        this.cpassword= this.password;
    }
    next();
});
const CustomersDetail= new mongoose.model("CustomerDetail",UserSchema);
module.exports=CustomersDetail;