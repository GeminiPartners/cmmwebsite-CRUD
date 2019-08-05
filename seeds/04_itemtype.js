exports.seed = (knex, Promise) => {
  return knex.raw('DELETE FROM itemtype; ALTER SEQUENCE itemtype_id_seq RESTART WITH 1')
      .then(() => {
        const itemtypes = [{
          itemtypename: 'Comics',
          itemtypedescription: 'Single issue comic books',
          itemtypeorder:0,
          itemtypemarket:1,
          created_at: new Date()
        }, {
          itemtypename: 'Eyepieces',
          itemtypedescription: 'Eyepiece lenses for telescopes',
          itemtypeorder:0,
          itemtypemarket:2,
          created_at: new Date()
        }];

        return knex('itemtype').insert(itemtypes);
      });
};