import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

const sendOtpMail = async (data) => {
    let htmlContent;
    let subject;
    if (data.for === "signup") {
        htmlContent = `<html><head></head><body style=\"margin:0;padding:0;background-color:#121212;font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;color:#ffffff;\"><div style=\"max-width:600px;margin:40px auto;background:#1e1e1e;border-radius:10px;padding:40px 30px;box-shadow:0 0 20px rgba(255,255,255,0.05);\"><div style=\"text-align:center;margin-bottom:30px;\"><h1 style=\"color:#ffffff;font-size:24px;margin:0;\">🔐 Verify Your Email</h1></div><div style=\"font-size:16px;line-height:1.5;color:#cccccc;\"><p>Hello,</p><p>Your One-Time Password (OTP) to proceed is shown below. Please enter this code on the signup page to continue.</p></div><div style=\"background-color:#2d2d2d;padding:20px;border-radius:8px;text-align:center;font-size:32px;letter-spacing:8px;font-weight:bold;margin:30px 0;color:#00e5ff;\">${data.otp}</div><div style=\"font-size:16px;line-height:1.5;color:#cccccc;\"><p>This OTP is valid for 10 minutes. Do not share it with anyone.</p><p>If you didn't request this, you can safely ignore this email.</p></div><div style=\"text-align:center;font-size:12px;color:#888888;margin-top:40px;\"><p>&copy; 2025 sudip.fun . All rights reserved.</p></div></div></body></html>`;
        subject = "Email varification code";
    } else {
        htmlContent = `<html><head></head><body style="margin:0;padding:0;background-color:#121212;font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;color:#ffffff;"><div style="max-width:600px;margin:40px auto;background:#1e1e1e;border-radius:10px;padding:40px 30px;box-shadow:0 0 20px rgba(255,255,255,0.05);"><div style="text-align:center;margin-bottom:30px;"><h1 style="color:#ffffff;font-size:24px;margin:0;">🔑 Reset Your Password</h1></div><div style="font-size:16px;line-height:1.5;color:#cccccc;"><p>Hello,</p><p>Your One-Time Password (OTP) to reset your account password is shown below. Please enter this code on the forgot password page to proceed.</p></div><div style="background-color:#2d2d2d;padding:20px;border-radius:8px;text-align:center;font-size:32px;letter-spacing:8px;font-weight:bold;margin:30px 0;color:#ffb300;">${data.otp}</div><div style="font-size:16px;line-height:1.5;color:#cccccc;"><p>This OTP is valid for 10 minutes. Do not share it with anyone.</p><p>If you didn’t request this, you can safely ignore this email.</p></div><div style="text-align:center;font-size:12px;color:#888888;margin-top:40px;"><p>&copy; 2025 Your sudip.fun . All rights reserved.</p></div></div></body></html>`;
        subject = "Forgot password code";
    }

    const url = "https://api.brevo.com/v3/smtp/email";
    const bodyData = {
        "sender": {
            "name": "blog.sudip.fun",
            "email": "blog@sudip.fun"
        },
        "to": [
            {
                "email": data.email,
            }
        ],
        "subject": subject,
        "htmlContent": htmlContent
    }

    const headers = {
        'accept': 'application/json',
        'api-key': process.env.EMAIL_API_KEY,
        'Content-Type': 'application/json'
    };

    let apiRes = await axios.post(url, bodyData, { headers });
    return apiRes.status;
}

const welcomeMail = async (data) => {
    let date = new Date().toLocaleDateString();
    const url = "https://api.brevo.com/v3/smtp/email";
    const bodyData = {
        "sender": {
            "name": "blog.sudip.fun",
            "email": "blog@sudip.fun"
        },
        "to": [
            {
                "email": data.Email,
            }
        ],
        "subject": "Welcome to blog.sudip.fun",
        "htmlContent": `<html><head></head><body style="margin:0;padding:0;background-color:#121212;font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;color:#ffffff;"><div style="max-width:600px;margin:40px auto;background:#1e1e1e;border-radius:10px;padding:40px 30px;box-shadow:0 0 20px rgba(255,255,255,0.1);"><h1 style="color:#4cafef;text-align:center;">Welcome to blog.sudip.fun!</h1><p style="font-size:16px;line-height:1.6;color:#cccccc;">Hello <strong>${data.Name}</strong>,</p><p style="font-size:16px;line-height:1.6;color:#cccccc;">We’re excited to have you on board! Here are your account details:</p><ul style="font-size:16px;line-height:1.6;color:#cccccc;list-style:none;padding:0;"><li><strong>Email:</strong> ${data.Email}</li><li><strong>Account Created:</strong> ${date}</li></ul><p style="font-size:14px;line-height:1.6;color:#aaaaaa;">Feel free to explore, share your blog posts, and connect with readers worldwide.</p><hr style="border:none;height:1px;background:#333;margin:20px 0;"><p style="font-size:12px;line-height:1.6;color:#777;text-align:center;">&copy; 2025 Blog.Sudip.Fun. All rights reserved.</p></div></body></html>`
    }

    const headers = {
        'accept': 'application/json',
        'api-key': process.env.EMAIL_API_KEY,
        'Content-Type': 'application/json'
    };

    let apiRes = await axios.post(url, bodyData, { headers });
    return apiRes.status;
}

export default { sendOtpMail , welcomeMail};