import userModel from "../models/userModel.js";
import managePassword from "../config/managePassword.js";
import authentication from "../config/authentication.js";

const {createUser,findUser,isUserExists} = userModel;
const {encryptPass,verifyPass} = managePassword;
const {generateToken, verifyToken} = authentication;

const isLogin = async (req,res) => {
    // console.log(req.params.jwtToken);
    const token = req.params.jwtToken
    
    if(!token){
        return res.send({isLogin: false});
    }
    const data = await verifyToken(token);
    if (data.Message) {
        // console.log(data.User);
        return res.send({
            isLogin: true,
            User: data.User
        });
        
    }else{
        return res.send({isLogin: false});
    }
}

// Signup
const SignUp = async (req,res) => {
    let data = await isUserExists(req.body.Email);
    
    if ( data.Data >0 ) {
        return res.status(409).json({Message : "The username or email you provided is already in use."});
    }
    data = await encryptPass(req.body.Password);
    if (data.error) {
        return res.status(500).json({Message: "An unexpected error occurred on the server." });
    }
    const newPass = data.Password;
    const message = await createUser(req.body,newPass);
    if (message.Error) {
        return res.status(500).json({Message: "An unexpected error occurred on the server." });
    }
    return res.status(201).json(message);
}

// Login
const Login = async(req,res) =>{
    let data = await findUser(req.body.Email);
    if (data.Error){
        return res.status(data.code).json({Message: data.Error});
    }
    // console.log(data.User);
    const user = data.User;
    
    data = await verifyPass(req.body.Password,user.Password);
    if (data.Error) {
        return res.status(404).json({Message: "Something went Wrong. Please try again later"});
    }
    if (data.isCorrect) {
        // Generate Token
        const tokenData = generateToken(user);
        if (tokenData.Error) {
            return res.status(404).json({Message: "Something went Wrong. Please try again later"});
        }
        // console.log(Token);
        return res.status(200).json({
            Message: "Login Sucessfully",
            jwtToken: tokenData.Token
        });
    } else {
        return res.status(403).json({Message: "Invalid Email or Password"});
    }
}




const setCookie = (req,res)=>{
    const tok = "req.cookies.Token"
    res.cookie('Logo',tok);
    res.send('Cookie saved');
}

export default {isLogin,SignUp,Login, setCookie};