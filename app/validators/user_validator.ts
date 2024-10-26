import vine from '@vinejs/vine'

export const createUserSchema = vine.compile(
  vine.object({
    email: vine.string(),
    password: vine.string().minLength(2).confirmed().maxLength(32).confirmed(),
    firstname: vine.string().minLength(1),
    lastname: vine.string().minLength(1),
    pseudo: vine.string().minLength(1),
    file: vine
      .file({
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg'],
      })
      .optional(),
  })
)

export const loginSchema = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(2).maxLength(32),
  })
)
