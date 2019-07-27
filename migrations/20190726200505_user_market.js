
exports.up = function(knex, Promise) {
    return knex.schema.createTable('user_market', table => {
      table.increments();
      table.integer('user_id').references('user.id').unsigned().onDelete('cascade');
      table.integer('market_id').references('market.id').unsigned().onDelete('cascade');
      table.integer('role').notNullable().defaultTo(0);
      table.datetime('created_at').notNullable().defaultTo(knex.fn.now(6));
      table.datetime('updated_at').notNullable().defaultTo(knex.fn.now(6));
      table.unique(['user_id', 'market_id'])
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('user_market');
  };