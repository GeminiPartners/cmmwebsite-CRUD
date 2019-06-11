
exports.up = function(knex, Promise) {
    return knex.schema.createTable('item_category_item', table => {
      table.increments();
      table.integer('item_category_id').references('item_category.id').unsigned().onDelete('cascade');
      table.integer('item_id').references('item.id').unsigned().onDelete('cascade');
      table.datetime('created_at').notNullable();
      table.datetime('updated_at').notNullable().defaultTo(knex.fn.now(6));
      table.unique(['item_category_id', 'item_id'])
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('item_category_item');
  };