exports.seed = (knex, Promise) => {
  return knex.raw('DELETE FROM item_category_item; ALTER SEQUENCE item_category_item_id_seq RESTART WITH 1')
      .then(() => {
        const item_category_items = [{
          item_category_id: 1,
          item_id: 1,
          created_at: new Date()
        }, {
          item_category_id: 2,
          item_id: 2,
          created_at: new Date()
        }, {
          item_category_id: 3,
          item_id: 3,
          created_at: new Date()
        }, {
          item_category_id: 4,
          item_id: 1,
          created_at: new Date()
        }, {
          item_category_id: 4,
          item_id: 2,
          created_at: new Date()
        }, {
          item_category_id: 4,
          item_id: 3,
          created_at: new Date()
        }];

        return knex('item_category_item').insert(item_category_items);
      });
};