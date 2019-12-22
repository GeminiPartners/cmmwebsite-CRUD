Shared = require('../shared')
exports.seed = (knex, Promise) => {
  const id1 = Shared.UUID();
  const id2 = Shared.UUID();
  return knex.raw('DELETE FROM textfieldinstance')
      .then(() => {
        const textfieldinstances = [{
          id: id1,
          textfield_id: 1,
          textfieldvalue: "The Amazing Spider-Man",
          textfielditem_id: 1,
          created_at: new Date()
        }, {
          id: id2,
          textfield_id: 1,
          textfieldvalue: "The Incredible Hulk",
          textfielditem_id: 2,
          created_at: new Date()
        }];

        return knex('textfieldinstance').insert(textfieldinstances);
      });
};