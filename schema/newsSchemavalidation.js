import vine from '@vinejs/vine'

export const newsSchemaValidation = vine.object({
    title: vine.string().minLength(1).maxLength(100),
    body: vine.string().maxLength(10000)
})