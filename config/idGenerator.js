import { UniqueStringId, UniqueCharOTP, UniqueNumberId, UniqueOTP } from 'unique-string-generator';

export const getBlogId = () => {
    let id = (UniqueStringId() + UniqueCharOTP())
    // console.log(id);
    return id;
}

export const getUserId = () => {
    let id = UniqueNumberId();
    return id;
}

export const getOtp = () => {
    let otp = UniqueOTP(4);
    return otp;
}