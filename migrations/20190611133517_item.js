
exports.up = function(knex, Promise) {
    return knex.schema.createTable('item', table => {
        table.increments();
        table.text('name').notNullable();
        table.text('description').notNullable();
        table.boolean('default_instructions_suppress').notNullable().defaultTo(false);
        table.text('instructions');
        table.integer('user_id').references('user.id').unsigned().onDelete('cascade');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('item');
};
