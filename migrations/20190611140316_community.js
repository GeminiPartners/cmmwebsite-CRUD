
exports.up = function(knex, Promise) {
    return knex.schema.createTable('community', table => {
      table.increments();
      table.text('name').unique().notNullable();
      table.text('description').notNullable();
      table.integer('community_type').notNullable().defaultTo(1);
      table.datetime('created_at').notNullable().defaultTo(knex.fn.now(6));
      table.datetime('updated_at').notNullable().defaultTo(knex.fn.now(6));
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('community');
  };
  