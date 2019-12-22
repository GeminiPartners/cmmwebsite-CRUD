exports.up = function(knex, Promise) {
    return knex.schema.createTable('datefieldinstance', table => {
        table.uuid('id').notNullable().primary();
        table.integer('datefield_id').notNullable().references('itemtypefield.id').unsigned().onDelete('cascade');;
        table.date('datefieldvalue').notNullable();
        table.integer('datefielditem_id').notNullable().references('item.id').unsigned().onDelete('cascade');;
        table.datetime('created_at').notNullable().defaultTo(knex.fn.now(6));
        table.datetime('updated_at').notNullable().defaultTo(knex.fn.now(6));
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('datefieldinstance');
};