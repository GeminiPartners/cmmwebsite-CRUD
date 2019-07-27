
exports.up = function(knex, Promise) {
  return knex.schema.createTable('user', table => {
    table.increments();
    table.text('email').unique().notNullable();
    table.text('username').notNullable();
    table.text('password').notNullable();
    table.datetime('created_at').notNullable().defaultTo(knex.fn.now(6));
    table.datetime('updated_at').notNullable().defaultTo(knex.fn.now(6));
    table.boolean('is_active').notNullable().defaultTo(true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('user');
};
