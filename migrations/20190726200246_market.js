
exports.up = function(knex, Promise) {
    return knex.schema.createTable('market', table => {
      table.increments();
      table.text('marketname').unique().notNullable();
      table.text('marketdescription').notNullable();
      table.datetime('created_at').notNullable().defaultTo(knex.fn.now(6));
      table.datetime('updated_at').notNullable().defaultTo(knex.fn.now(6));
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('market');
  };
  