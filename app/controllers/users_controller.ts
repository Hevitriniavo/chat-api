import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import drive from '@adonisjs/drive/services/main'

export default class UsersController {
  async me({ auth, response }: HttpContext) {
    const user = await auth.authenticateUsing(['api'])
    return response.ok({
      data: user,
    })
  }

  async all({ response }: HttpContext) {
    const users = await User.query().orderBy('id', 'asc')
    return response.ok({
      data: users,
    })
  }

  async delete({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)

    if (user.photo) {
      await drive.use('s3').delete(user.photo)
    }

    await user.delete()

    return response.ok({
      message: 'User deleted successfully',
    })
  }
}
