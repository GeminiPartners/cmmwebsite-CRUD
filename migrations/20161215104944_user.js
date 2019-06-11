
exports.up = function(knex, Promise) {
  return knex.schema.createTable('user', table => {
    table.increments();
    table.text('email').unique().notNullable();
    table.text('username').notNullable();
    table.text('password').notNullable();
    table.datetime('created_at').notNullable();
    table.datetime('updated_at').notNullable().defaultTo(knex.fn.now(6));
    table.boolean('is_active').notNullable().defaultTo(true);
    table.text('location');
    table.text('instructions_default');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('user');
};
