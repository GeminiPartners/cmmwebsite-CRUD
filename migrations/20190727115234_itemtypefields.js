exports.up = function(knex, Promise) {
    return knex.schema.createTable('itemtypefield', table => {
        table.increments();
        table.text('fieldname').notNullable();
        table.text('fielddescription');
        table.integer('fielditemtype_id').notNullable().references('itemtype.id').unsigned().onDelete('cascade');
        table.integer('fieldorder').notNullable().defaultTo(0);
        table.integer('fielddatatype').notNullable().defaultTo(0);
        table.datetime('created_at').notNullable().defaultTo(knex.fn.now(6));
        table.datetime('updated_at').notNullable().defaultTo(knex.fn.now(6));
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('itemtypefield');
};