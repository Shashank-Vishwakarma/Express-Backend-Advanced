import vine from "@vinejs/vine";

export const registerSchemaValidation = vine.object({
    name: vine.string(),
    email: vine.string().email(),
    password: vine.string().minLength(6)
});

export const loginSchemaValidation = vine.object({
    email: vine.string().email(),
    password: vine.string()
});
