exports.seed = (knex, Promise) => {
  return knex.raw('DELETE FROM market; ALTER SEQUENCE market_id_seq RESTART WITH 1')
      .then(() => {
        const markets = [{
          marketname: 'Comics',
          marketdescription: 'A comic book market',
          created_at: new Date()
        }, {
          marketname: 'Astronomy',
          marketdescription: 'A market for amateur astronomers',
          created_at: new Date()
        }];

        return knex('market').insert(markets);
      });
};