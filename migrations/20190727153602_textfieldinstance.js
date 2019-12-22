exports.up = function(knex, Promise) {
    return knex.schema.createTable('textfieldinstance', table => {
        table.uuid('id').notNullable().primary();
        table.integer('textfield_id').notNullable().references('itemtypefield.id').unsigned().onDelete('cascade');;
        table.text('textfieldvalue').notNullable();
        table.integer('textfielditem_id').notNullable().references('item.id').unsigned().onDelete('cascade');;
        table.datetime('created_at').notNullable().defaultTo(knex.fn.now(6));
        table.datetime('updated_at').notNullable().defaultTo(knex.fn.now(6));
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('textfieldinstance');
};