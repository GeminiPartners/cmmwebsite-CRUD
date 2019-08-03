exports.seed = (knex, Promise) => {
  return knex.raw('DELETE FROM itemtypefield; ALTER SEQUENCE itemtypefield_id_seq RESTART WITH 1')
      .then(() => {
        const itemtypefields = [{
          fieldname: 'Title',
          fielddescription: 'The title of the comic',
          fielditemtype_id: 1,
          fielddatatype:0,
          fieldorder: 0,
          created_at: new Date()
        }, {
          fieldname: 'Issue',
          fielddescription: 'Number of the comic',
          fielditemtype_id: 1,
          fielddatatype:1,
          fieldorder: 1,
          created_at: new Date()
        }, {
          fieldname: 'Volume',
          fielddescription: 'Number of the comic',
          fielditemtype_id: 1,
          fielddatatype:1,
          fieldorder: 2,
          created_at: new Date()
        }, {
          fieldname: 'Cover Date',
          fielddescription: 'Date put on the cover by the publisher for December 1990, use 12/1/1990',
          fielditemtype_id: 1,
          fielddatatype:2,
          fieldorder: 3,
          created_at: new Date()
        }, {
          fieldname: 'Focal length (mm)',
          fielddescription: 'Used along with the telescope focal length to determine magnification',
          fielditemtype_id: 2,
          fielddatatype:2,
          fieldorder: 0,
          created_at: new Date()
        }, {
          fieldname: 'Size (inches)',
          fielddescription: 'Usually either 1.25 or 2; older ones have 0.965',
          fielditemtype_id: 2,
          fielddatatype:2,
          fieldorder: 1,
          created_at: new Date()
        }, {
          fieldname: 'Apparent field of view (degrees)',
          fielddescription: 'The width of sky, in angular terms, that is presented to your eye ',
          fielditemtype_id: 2,
          fielddatatype:2,
          fieldorder: 2,
          created_at: new Date()
        }];

        return knex('itemtypefield').insert(itemtypefields);
      });
};