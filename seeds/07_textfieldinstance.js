exports.seed = (knex, Promise) => {
  return knex.raw('DELETE FROM textfieldinstance; ALTER SEQUENCE textfieldinstance_id_seq RESTART WITH 1')
      .then(() => {
        const textfieldinstances = [{
          textfield_id: 1,
          textfieldvalue: "The Amazing Spider-Man",
          textfielditem_id: 1,
          created_at: new Date()
        }, {
          textfield_id: 1,
          textfieldvalue: "The Incredible Hulk",
          textfielditem_id: 2,
          created_at: new Date()
        }];

        return knex('textfieldinstance').insert(textfieldinstances);
      });
};