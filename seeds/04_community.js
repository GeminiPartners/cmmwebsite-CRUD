exports.seed = (knex, Promise) => {
  return knex.raw('DELETE FROM community; ALTER SEQUENCE community_id_seq RESTART WITH 1')
      .then(() => {
        const communities = [{
          name: 'General Market',
          description: 'A cool marketplace',
          community_type: 0,
          created_at: new Date()
        }, {
          name: 'Tools Market',
          description: 'A tool-focused marketplace',
          community_type: 1,
          created_at: new Date()
        }];

        return knex('community').insert(communities);
      });
};