import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const mailCheck = async (email) => {
    let url = `https://mailcheck.p.rapidapi.com/?email=${email}`;
    let headers = {
        "x-rapidapi-key": process.env.RAPID_API_KEY,
        "x-rapidapi-host": "mailcheck.p.rapidapi.com"
    };

    let apiRes = await axios.get(url,{headers});
    return ({disposable:apiRes?.data?.disposable,status:apiRes?.status});
}

export default mailCheck