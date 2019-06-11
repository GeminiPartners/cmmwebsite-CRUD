
exports.up = function(knex, Promise) {
    return knex.schema.createTable('user_community', table => {
      table.increments();
      table.integer('user_id').references('user.id').unsigned().onDelete('cascade');
      table.integer('community_id').references('community.id').unsigned().onDelete('cascade');
      table.integer('role').notNullable().defaultTo(0);
      table.datetime('created_at').notNullable();
      table.datetime('updated_at').notNullable().defaultTo(knex.fn.now(6));
      table.unique(['user_id', 'community_id'])
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('user_community');
  };