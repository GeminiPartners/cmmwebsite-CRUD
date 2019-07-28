exports.up = function(knex, Promise) {
    return knex.schema.createTable('item', table => {
        table.increments();
        table.text('itemname').notNullable();
        table.text('itemdescription');
        table.integer('itemtype_id').notNullable().references('itemtype.id').unsigned().onDelete('cascade');
        table.integer('owner_id').notNullable().references('user.id').unsigned().onDelete('cascade');
        table.decimal('price');
        table.datetime('created_at').notNullable().defaultTo(knex.fn.now(6));
        table.datetime('updated_at').notNullable().defaultTo(knex.fn.now(6));
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('item');
};