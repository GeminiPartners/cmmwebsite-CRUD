Shared = require('../shared')
exports.seed = (knex, Promise) => {
  const id1 = Shared.UUID();
  const id2 = Shared.UUID();
  const id3 = Shared.UUID();
  const id4 = Shared.UUID();
  const id5 = Shared.UUID();
  const id6 = Shared.UUID();
  const id7 = Shared.UUID();
  
  return knex.raw('DELETE FROM numberfieldinstance')
      .then(() => {
        const numberfieldinstances = [{
          id: id1,
          numberfield_id: 2,
          numberfieldvalue: 135,
          numberfielditem_id: 1,
          created_at: new Date()
        }, {
          id: id2,
          numberfield_id: 3,
          numberfieldvalue: 1,
          numberfielditem_id: 1,
          created_at: new Date()
        }, {
          id: id3,
          numberfield_id: 2,
          numberfieldvalue: 200,
          numberfielditem_id: 2,
          created_at: new Date()
        }, {
          id: id4,
          numberfield_id: 3,
          numberfieldvalue: 1,
          numberfielditem_id: 2,
          created_at: new Date()
        }, {
          id: id5,
          numberfield_id: 5,
          numberfieldvalue: 120,
          numberfielditem_id: 3,
          created_at: new Date()
        }, {
          id: id6,
          numberfield_id: 6,
          numberfieldvalue: 1.25,
          numberfielditem_id: 3,
          created_at: new Date()
        }, {
          id: id7,
          numberfield_id: 7,
          numberfieldvalue: 40,
          numberfielditem_id: 3,
          created_at: new Date()
        }];

        return knex('numberfieldinstance').insert(numberfieldinstances);
      });
};