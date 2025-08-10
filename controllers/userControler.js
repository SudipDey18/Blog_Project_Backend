import userModel from "../models/userModel.js";
import emailVerificationModel from "../models/emailVerificationModel.js";
import managePassword from "../config/managePassword.js";
import authentication from "../config/authentication.js";

const { createUser, findUser, updatePassword } = userModel;
const { encryptPass, verifyPass } = managePassword;
const { generateToken, verifyToken } = authentication;
const { getVerificatrionDetails } = emailVerificationModel;


const isLogin = async (req, res) => {
    // console.log(req.params.jwtToken);
    const token = req.params.jwtToken

    if (!token) {
        return res.send({ isLogin: false });
    }
    const data = await verifyToken(token);

    if (data.Message) {
        return res.send({
            isLogin: true,
            User: data.User
        });

    } else {
        return res.send({ isLogin: false });
    }
}

// Signup
const signUp = async (req, res) => {

    let verificatrionDetails = (await getVerificatrionDetails(req.body.Email)).data;
    if (verificatrionDetails?.error) {
        return res.status(500).json({ Message: "Internal Server Error" });
    }

    if (verificatrionDetails.Otp == req.body.Otp) {
        (new Date(verificatrionDetails.Time).getTime() - Date.now()) / 1000 > 10 ? res.status(401).json({ pageMessage: "OTP Expired" }) : null
        let data = await encryptPass(req.body.Password);
        if (data?.error) {
            return res.status(500).json({ Message: "An unexpected error occurred on the server." });
        }
        const newPass = data.Password;
        const message = await createUser(req.body, newPass);
        if (message.Error) {
            return res.status(500).json({ Message: "An unexpected error occurred on the server." });
        }
        return res.status(201).json(message);
    } else {
        return res.status(401).json({ pageMessage: "Wrong OTP" });
    }

}

// Login
const login = async (req, res) => {
    let data = await findUser(req.body.Email);
    if (data.Error) {
        return res.status(data.code).json({ Message: data.Error });
    }
    // console.log(data.User);
    const user = data.User;

    data = await verifyPass(req.body.Password, user.Password);
    if (data.Error) {
        return res.status(404).json({ Message: "Something went Wrong. Please try again later" });
    }
    if (data.isCorrect) {
        // Generate Token
        const tokenData = generateToken(user);
        if (tokenData.Error) {
            return res.status(404).json({ Message: "Something went Wrong. Please try again later" });
        }
        // console.log(Token);
        return res.status(200).json({
            Message: "Login Sucessfully",
            jwtToken: tokenData.Token
        });
    } else {
        return res.status(401).json({ pageMessage: "Invalid Email or Password" });
    }
}

const forgotPass = async (req, res) => {
    console.log(req.body);
    
    let verificatrionDetails = (await getVerificatrionDetails(req.body.Email)).data;
    if (verificatrionDetails?.error) {
        return res.status(500).json({ Message: "Internal Server Error" });
    }
    if (verificatrionDetails.Otp == req.body.Otp) {
        (new Date(verificatrionDetails.Time).getTime() - Date.now()) / 1000 > 10 ? res.status(401).json({ pageMessage: "OTP Expired" }) : null
        let data = await encryptPass(req.body.Password);
        if (data?.error) {
            return res.status(500).json({ Message: "An unexpected error occurred on the server." });
        }
        const newPass = data.Password;
            const message = await updatePassword(req.body.Email, newPass);
            message.error && res.status(500).json({ Message: "An unexpected error occurred on the server." });
            return res.status(201).json({Message: message.Message});
    } else {
        return res.status(401).json({ pageMessage: "Wrong OTP" });
    }
}


export default { isLogin, signUp, login, forgotPass };
