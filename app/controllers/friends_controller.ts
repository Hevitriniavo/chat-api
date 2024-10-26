import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class FriendsController {
  async attachFriend({ params, response }: HttpContext) {
    const { userId, friendId } = params
    const user = await User.findOrFail(userId)
    await user.related('users').attach([friendId])
    const friend = await User.findOrFail(friendId)
    await friend.related('users').attach([userId])
    return response.ok({ message: 'Friend added successfully' })
  }

  async detachFriend({ params, response }: HttpContext) {
    const { userId, friendId } = params
    const user = await User.findOrFail(userId)
    await user.related('users').detach([friendId])

    const friend = await User.findOrFail(friendId)
    await friend.related('users').detach([userId])

    return response.ok({ message: 'Friend removed successfully' })
  }

  async getFriends({ params, response }: HttpContext) {
    const userId = params.userId

    const user = await User.find(userId)

    if (!user) {
      return response.notFound({ message: 'User not found' })
    }

    const friends = await user.related('users').query()
    return response.ok({ data: friends })
  }
}
