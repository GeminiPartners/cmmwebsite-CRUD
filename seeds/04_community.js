exports.seed = (knex, Promise) => {
  return knex.raw('DELETE FROM community; ALTER SEQUENCE community_id_seq RESTART WITH 1')
      .then(() => {
        const communities = [{
          name: 'Fellowship X',
          description: 'A church community',
          community_type: 0
        }, {
          name: 'Neighborhood Y',
          description: 'A neighborhood community',
          community_type: 1
        }];

        return knex('community').insert(communities);
      });
};