exports.seed = (knex, Promise) => {
  return knex.raw('DELETE FROM user_community; ALTER SEQUENCE user_community_id_seq RESTART WITH 1')
      .then(() => {
        const user_communities = [{
          user_id: 1,
          community_id: 1,
          role: 2,
          created_at: new Date()
        }, {
          user_id: 1,
          community_id: 2,
          role: 1,
          created_at: new Date()
        }, {
          user_id: 2,
          community_id: 2,
          role: 2,
          created_at: new Date()
        }, {
          user_id: 2,
          community_id: 1,
          role: 0,
          created_at: new Date()
        }];

        return knex('user_community').insert(user_communities);
      });
};