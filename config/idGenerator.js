import { UniqueStringId,UniqueCharOTP} from 'unique-string-generator';

const genId = () => {
    let id = (UniqueStringId() + UniqueCharOTP())
    console.log(id);
    return id;
}

export default {genId}