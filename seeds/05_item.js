exports.seed = (knex, Promise) => {
  return knex.raw('DELETE FROM item; ALTER SEQUENCE item_id_seq RESTART WITH 1')
      .then(() => {
        const items = [{
          itemname: 'Amazing Spider-Man 135',
          itemdescription: 'A marvel comic',
          owner_id: 1,
          itemtype_id: 1,
          price: 25.00,
          fields: JSON.stringify([
            {id: 1, fieldname: 'Title', fielddatatype: 0, fieldorder: 1, value: 'The Amazing Spider-Man'},
            {id: 2, fieldname:'Issue', fielddatatype: 1, fieldorder: 1, value: 135},
            {id: 3, fieldname:'Volume', fielddatatype: 1, fieldorder: 2, value: 1},
            {id: 4, fieldname:'Cover Date', fielddatatype: 2, fieldorder: 3, value: '1972-01-31'}]),
          created_at: new Date()
        }, {
          itemname: 'Incredible Hulk 200',
          itemdescription: 'A comic book about the hulk',
          owner_id: 1,
          itemtype_id: 1,
          price: 32.50,
          fields: JSON.stringify([
            {id: 1, fieldname: 'Title', fielddatatype: 0, fieldorder: 1, value: 'The Incredible Hulk'},
            {id: 2, fieldname:'Issue', fielddatatype: 1, fieldorder: 1, value: 200},
            {id: 3, fieldname:'Volume', fielddatatype: 1, fieldorder: 2, value: 1},
            {id: 4, fieldname:'Cover Date', fielddatatype: 2, fieldorder: 3, value: '1982-01-31'}]),
          created_at: new Date()
        }, {
          itemname: 'Celestron X-Cel LX Series Eyepiece - 1.25-Inch 5mm 93421',
          itemdescription: 'X-Cel LX eyepieces, optimized for planetary viewing, offer a 60° field of view through a six-element fully multi-coated lens system',
          owner_id: 2,
          itemtype_id: 2,
          price: 65.25,
          fields: JSON.stringify([
            {id: 5, fieldname: 'Focal length(mm)', fielddatatype: 1, fieldorder: 0, value: 120},
            {id: 6, fieldname:'Size (inches)', fielddatatype: 1, fieldorder: 1, value: 1.25},
            {id: 7, fieldname:'Apparent field of view (degrees)', fielddatatype: 1, fieldorder: 2, value: 40}]),
          created_at: new Date()
        }];

        return knex('item').insert(items);
      });
};