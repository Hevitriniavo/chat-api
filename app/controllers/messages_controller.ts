import type { HttpContext } from '@adonisjs/core/http'
import Message from '#models/message'
import User from '#models/user'
import transmit from '@adonisjs/transmit/services/main'

export default class MessagesController {
  async create({ request, response }: HttpContext) {
    const { receiverId, content, senderId } = request.only(['receiverId', 'content', 'senderId'])

    const receiver = await User.find(receiverId)
    if (!receiver) return response.notFound({ message: 'Receiver not found' })
    const message = await Message.create({ senderId, receiverId, content })
    const channelName = `chat:${Math.min(senderId, receiverId)}:${Math.max(senderId, receiverId)}`
    transmit.broadcast(channelName, {
      senderId,
      receiverId,
      content,
      createdAt: message.createdAt.toISO(),
    })

    return response.created({ data: message })
  }

  async show({ params, response }: HttpContext) {
    const message = await Message.query()
      .where('id', params.id)
      .preload('sender')
      .preload('receiver')
      .first()

    if (!message) {
      return response.notFound({ message: 'Message not found' })
    }

    return response.ok({ data: message })
  }

  async update({ params, request, response }: HttpContext) {
    const message = await Message.find(params.id)
    if (!message) return response.notFound({ message: 'Message not found' })

    const content = request.input('content')
    message.merge({ content })
    await message.save()

    return response.ok({ data: message })
  }

  async delete({ params, response }: HttpContext) {
    const message = await Message.find(params.id)
    if (!message) return response.notFound({ message: 'Message not found' })

    await message.delete()
    return response.ok({ message: 'Message deleted successfully' })
  }

  async index({ response }: HttpContext) {
    const messages = await Message.all()
    return response.ok({ data: messages })
  }

  async getConversation({ params, response }: HttpContext) {
    const { userId, friendId } = params

    const conversation = await Message.query()
      .where((query) => {
        query.where('senderId', userId).andWhere('receiverId', friendId)
      })
      .orWhere((query) => {
        query.where('senderId', friendId).andWhere('receiverId', userId)
      })
      .orderBy('createdAt', 'asc')

    return response.ok({
      data: conversation,
    })
  }
}
