
exports.up = function(knex, Promise) {
    return knex.schema.createTable('item_category', table => {
      table.increments();
      table.text('name').notNullable();
      table.integer('order').notNullable().defaultTo(0);
      table.integer('community_id').notNullable().references('community.id').unsigned().onDelete('cascade');
      table.datetime('created_at').notNullable();
      table.datetime('updated_at').notNullable().defaultTo(knex.fn.now(6));
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('item_category');
  };
  