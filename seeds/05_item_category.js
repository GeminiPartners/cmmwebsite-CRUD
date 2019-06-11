exports.seed = (knex, Promise) => {
  return knex.raw('DELETE FROM item_category; ALTER SEQUENCE item_category_id_seq RESTART WITH 1')
      .then(() => {
        const item_categories = [{
          name: 'Tools',
          order: 1,
          community_id: 1,
          created_at: new Date()
        }, {
          name: 'Power Tools',
          order: 2,
          community_id: 1,
          created_at: new Date()
        }, {
          name: 'Recreation',
          order: 3,
          community_id: 1,
          created_at: new Date()
        }, {
          name: 'Everything',
          order: 0,
          community_id: 2,
          created_at: new Date()
        }];

        return knex('item_category').insert(item_categories);
      });
};