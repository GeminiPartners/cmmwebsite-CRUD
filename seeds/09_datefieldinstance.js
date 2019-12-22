Shared = require('../shared')
exports.seed = (knex, Promise) => {
  const id1 = Shared.UUID()
  const id2 = Shared.UUID()
  console.log('id2: ', id2)
  return knex.raw('DELETE FROM datefieldinstance')
      .then(() => {
        const datefieldinstances = [{
          id: id1,
          datefield_id: 4,
          datefieldvalue: new Date(1972-01-31),
          datefielditem_id: 1,
          created_at: new Date()
        }, {
          id: id2,
          datefield_id: 4,
          datefieldvalue: new Date(1982-01-31),
          datefielditem_id: 2,
          created_at: new Date()
        }];

        return knex('datefieldinstance').insert(datefieldinstances);
      });
};