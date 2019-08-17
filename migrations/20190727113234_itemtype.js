
exports.up = function(knex) {
    return knex.schema.createTable('itemtype', table => {
        table.increments();
        table.text('itemtypename').notNullable();
        table.text('itemtypedescription');
        table.integer('itemtypeorder').notNullable().defaultTo(0);
        table.integer('itemtypemarket').notNullable().references('market.id').unsigned().onDelete('cascade');
        table.datetime('created_at').notNullable().defaultTo(knex.fn.now(6));
        table.datetime('updated_at').notNullable().defaultTo(knex.fn.now(6));
        table.unique(['itemtypename', 'itemtypemarket'])
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('itemtype');
};
