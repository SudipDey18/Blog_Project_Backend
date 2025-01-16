import bcrypt from 'bcrypt';

const encryptPass = async (pass) => {
    try {
        const salt = await bcrypt.genSalt(12);
        const Pass = await bcrypt.hash(pass,salt);
        return {Password: Pass};
    } catch (err) {
        return {error : err}
    }
}

const verifyPass = async (pass,dbPass) => {
    try {
        const isCorrect = await bcrypt.compare(pass,dbPass)
        return {isCorrect}
    } catch (err) {
        return {Error : err}
    }
}

export default {encryptPass,verifyPass}