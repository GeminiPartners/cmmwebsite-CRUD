exports.seed = (knex, Promise) => {
  return knex.raw('DELETE FROM numberfieldinstance; ALTER SEQUENCE numberfieldinstance_id_seq RESTART WITH 1')
      .then(() => {
        const numberfieldinstances = [{
          numberfield_id: 2,
          numberfieldvalue: 135,
          numberfielditem_id: 1,
          created_at: new Date()
        }, {
          numberfield_id: 3,
          numberfieldvalue: 1,
          numberfielditem_id: 1,
          created_at: new Date()
        }, {
          numberfield_id: 2,
          numberfieldvalue: 200,
          numberfielditem_id: 2,
          created_at: new Date()
        }, {
          numberfield_id: 3,
          numberfieldvalue: 1,
          numberfielditem_id: 2,
          created_at: new Date()
        }, {
          numberfield_id: 5,
          numberfieldvalue: 120,
          numberfielditem_id: 3,
          created_at: new Date()
        }, {
          numberfield_id: 6,
          numberfieldvalue: 1.25,
          numberfielditem_id: 3,
          created_at: new Date()
        }, {
          numberfield_id: 7,
          numberfieldvalue: 40,
          numberfielditem_id: 3,
          created_at: new Date()
        }];

        return knex('numberfieldinstance').insert(numberfieldinstances);
      });
};