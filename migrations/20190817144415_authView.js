
exports.up = function(knex) {
    
        const viewDefinition =  knex('market')
        .join('user_market', {'market.id': 'user_market.market_id'})
        .leftOuterJoin('itemtype', {'user_market.market_id': 'itemtype.itemtypemarket'})
        .select('itemtype.id AS itemtype_id', 'itemtype.itemtypename', 'user_market.market_id', 'user_market.user_id', 'user_market.role')
        ;
        return knex.schema.raw('CREATE OR REPLACE VIEW ?? AS (\n' + viewDefinition + '\n)', ['marketItemtypeAuth']);
      
  
};

exports.down = function(knex) {
        return knex.schema.raw('DROP VIEW IF EXISTS ??', ['marketItemtypeAuth'])
};
