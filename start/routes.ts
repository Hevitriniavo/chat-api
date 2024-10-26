import router from '@adonisjs/core/services/router'
import transmit from '@adonisjs/transmit/services/main'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')
const UsersController = () => import('#controllers/users_controller')
const FriendsController = () => import('#controllers/friends_controller')
const MessagesController = () => import('#controllers/messages_controller')

transmit.registerRoutes()

const authRoutes = () => {
  router.post('/register', [AuthController, 'register'])
  router.post('/login', [AuthController, 'login'])
  router.delete('/logout', [AuthController, 'logout'])
}

const userRoutes = () => {
  router.get('/me', [UsersController, 'me'])
  router.get('/users', [UsersController, 'all'])
  router.delete('/users/:id', [UsersController, 'delete'])
}

const friendsRoutes = () => {
  router.post('/users/:userId/friends/:friendId', [FriendsController, 'attachFriend'])
  router.delete('/users/:userId/friends/:friendId', [FriendsController, 'detachFriend'])
  router.get('/users/:userId/friends', [FriendsController, 'getFriends'])
}

const messageRoutes = () => {
  router.post('/messages', [MessagesController, 'create'])
  router.get('/messages', [MessagesController, 'index'])
  router.get('/messages/:id', [MessagesController, 'show'])
  router.put('/messages/:id', [MessagesController, 'update'])
  router.get('/users/:userId/friends/:friendId/conversation', [
    MessagesController,
    'getConversation',
  ])
  router.delete('/messages/:id', [MessagesController, 'delete'])
}

router.group(authRoutes).prefix('/auth')

router
  .group(() => {
    userRoutes()
    friendsRoutes()
    messageRoutes()
  })
  .use(middleware.auth({ guards: ['api'] }))
