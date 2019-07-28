exports.up = function(knex, Promise) {
    return knex.schema.createTable('numberfieldinstance', table => {
        table.increments();
        table.integer('numberfield_id').notNullable().references('itemtypefield.id').unsigned().onDelete('cascade');;
        table.decimal('numberfieldvalue').notNullable();
        table.integer('numberfielditem_id').notNullable().references('item.id').unsigned().onDelete('cascade');;
        table.datetime('created_at').notNullable().defaultTo(knex.fn.now(6));
        table.datetime('updated_at').notNullable().defaultTo(knex.fn.now(6));
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('numberfieldinstance');
};