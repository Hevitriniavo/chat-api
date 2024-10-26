import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('lastname')
      table.string('firstname')
      table.string('password').notNullable()
      table.string('email').unique()
      table.string('photo').nullable()
      table.string('pseudo').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropUnique(['email'])
    })
    this.schema.dropTable(this.tableName)
  }
}
