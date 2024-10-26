import type { HttpContext } from '@adonisjs/core/http'
import { createUserSchema } from '#validators/user_validator'
import { cuid } from '@adonisjs/core/helpers'
import User from '#models/user'
import Env from '#start/env'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    const validatedData = await createUserSchema.validate(request.all())

    const file = request.file('file')
    let key: string | null = null
    let fileUrl: string | null = null

    if (file) {
      key = `${cuid()}.${file.extname}`
      try {
        await file.moveToDisk(key, 's3')

        const bucketName = Env.get('S3_BUCKET')
        const region = Env.get('AWS_REGION')
        fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`
      } catch (e) {
        console.error('Error moving file to S3:', e)
        return response.status(500).send({
          error: 'File upload failed',
          details: e.message,
        })
      }
    }

    const user = await User.create({
      firstname: validatedData.firstname,
      lastname: validatedData.lastname,
      email: validatedData.email,
      password: validatedData.password,
      pseudo: validatedData.pseudo,
      photo: fileUrl,
    })

    return response.ok({
      data: user,
    })
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const user = await User.verifyCredentials(email, password)

    const token = await User.accessTokens.create(user, ['*'], {
      expiresIn: '30 days',
    })

    return response.ok({
      data: token,
    })
  }

  async logout({ auth, response }: HttpContext) {
    const user = await auth.authenticateUsing(['api'])
    const currentAccessToken = auth.user!.currentAccessToken
    await User.accessTokens.delete(user, currentAccessToken.identifier)
    return response.noContent()
  }
}
