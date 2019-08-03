exports.seed = (knex, Promise) => {
  return knex.raw('DELETE FROM datefieldinstance; ALTER SEQUENCE datefieldinstance_id_seq RESTART WITH 1')
      .then(() => {
        const datefieldinstances = [{
          datefield_id: 4,
          datefieldvalue: new Date(1972-01-31),
          datefielditem_id: 1,
          created_at: new Date()
        }, {
          datefield_id: 4,
          datefieldvalue: new Date(1982-01-31),
          datefielditem_id: 2,
          created_at: new Date()
        }];

        return knex('datefieldinstance').insert(datefieldinstances);
      });
};