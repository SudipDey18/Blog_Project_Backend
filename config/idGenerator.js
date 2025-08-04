import { UniqueStringId, UniqueCharOTP, UniqueNumberId } from 'unique-string-generator';

export const getBlogId = () => {
    let id = (UniqueStringId() + UniqueCharOTP())
    // console.log(id);
    return id;
}


export const getUserId = () => {
    let id = UniqueNumberId();
    return id;
} 