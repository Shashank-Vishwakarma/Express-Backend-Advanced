
export const validateImage = (mimetype) => {
    const supportedImageTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!supportedImageTypes.includes(mimetype)) {
        return { error: "Only jpeg, jpg and png are allowed" }
    }

    return { error: null }
}