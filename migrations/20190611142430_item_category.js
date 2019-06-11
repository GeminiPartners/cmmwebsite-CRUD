
exports.up = function(knex, Promise) {
    return knex.schema.createTable('item_category', table => {
      table.increments();
      table.text('name').notNullable();
      table.integer('order').notNullable().defaultTo(0);
      table.integer('community_id').references('community.id').unsigned().onDelete('cascade');
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('item_category');
  };
  