import { v4 as uuidv4 } from 'uuid'

export const generateUniqueFileName = (fileName) => {
    const imageWithoutExtension = fileName.split(".")[0];
    const imageExtension = fileName.split(".")[1];
    return `${imageWithoutExtension}-${uuidv4()}.${imageExtension}`;
}