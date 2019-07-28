exports.seed = (knex, Promise) => {
  return knex.raw('DELETE FROM user_market; ALTER SEQUENCE user_market_id_seq RESTART WITH 1')
      .then(() => {
        const user_markets = [{
          user_id: 1,
          market_id: 1,
          created_at: new Date()
        }, {
          user_id: 2,
          market_id: 2,
          created_at: new Date()
        }];

        return knex('user_market').insert(user_markets);
      });
};