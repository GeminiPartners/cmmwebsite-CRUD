const knex = require('./connection');

module.exports = {    
  MarketItemTypeAuth: function (user_id) {
    console.log('about to return infor for user ', user_id)
    return knex('market')
    .join('user_market', {'market.id': 'user_market.market_id'})
    .leftOuterJoin('itemtype', {'user_market.market_id': 'itemtype.itemtypemarket'})
    .select('itemtype.id', 'itemtype.itemtypename', 'user_market.market_id', 'user_market.user_id', 'user_market.role')
    .where({'user_market.user_id' : user_id});
  }
}