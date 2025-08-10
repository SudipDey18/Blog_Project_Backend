import emailVerificationModel from "../models/emailVerificationModel.js";
import userModel from "../models/userModel.js";
import { getOtp } from "../config/idGenerator.js";
import mailCheck from "../config/verifyDisposableMail.js";

const { getVerificatrionDetails, insertVerificationCode, updateVerification } = emailVerificationModel;
const { isUserExists } = userModel;


const requestOtp = async (req, res) => {
    let email = req.query.email;

    let isUserExistsRes = await isUserExists(email);

    if (req.params.for !== "signup" && req.params.for !== "forgotpass") {
        return res.status(401).json({ pageMessage: "Invalid url" });
    }

    if (isUserExistsRes.Data > 0 && req.params.for === "signup") {
        return res.status(401).json({ pageMessage: "Your provided email is already in use" });
    } else if (isUserExistsRes.Data < 1 && req.params.for === "forgotpass") {
        return res.status(401).json({ pageMessage: "User not exist with this email"});
    }

    let mailCheckRes = await mailCheck(email);

    if (mailCheckRes.status == 200 && mailCheckRes?.disposable) {
        return res.status(401).json({ pageMessage: "Disposable mails are not allowed" });
    } else if (mailCheckRes?.status != 200) {
        return res.status(500).json({ pageMessage: "Internal Server Error" });
    }

    try {
        let fetchData = await getVerificatrionDetails(email);
        let data = await fetchData?.data;
        // console.log(data);

        if (data?.error) {
            return res.status(500).json({ pageMessage: "Internal Server Error" });
        }
        if (data?.Email === email) {
            let openTime = new Date(new Date(data.Time).getTime() + 24 * 60 * 60 * 1000);
            let timeDiff = openTime - new Date();
            if (timeDiff < 0) {
                let otp = getOtp();
                // Email send and wait for res
                let response = await updateVerification({ otp, email, requests: 1, for: req.params.for });
                if (response?.error) return res.status(500).json({ pageMessage: "Internal Server Error" });
                return res.status(200).json({ pageMessage: "OTP Send Sucessfully" });
            } else if (data.Requests < 3) {
                let otp;
                otp = (new Date(data.Time).getTime() - Date.now()) / 1000 > 10 ? getOtp() : data.Otp;
                // Email send and wait for res
                let response = await updateVerification({ otp, email, requests: data.Requests + 1, for: req.params.for });
                if (response?.error) return res.status(500).json({ pageMessage: "Internal Server Error" });
                return res.status(200).json({ pageMessage: "OTP Send Sucessfully" });
            } else {
                let hours = Math.floor(timeDiff / (1000 * 60 * 60));
                let mins = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                return res.status(401).json({ pageMessage: `OTP request limit crossed. Try after ${hours}h ${mins}m` });
            }
        } else {
            let otp = getOtp();
            // Email send and wait for res
            let response = await insertVerificationCode({ email, otp, for: req.params.for });
            if (response?.error) {
                return res.status(500).json({ pageMessage: "Internal Server Error" });
            }
            return res.status(200).json({ pageMessage: "OTP send sucessfully" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ pageMessage: "Internal Server Error" });
    }
    // res.send("ok");
}

export default { requestOtp }