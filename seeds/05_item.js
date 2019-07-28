exports.seed = (knex, Promise) => {
  return knex.raw('DELETE FROM item; ALTER SEQUENCE item_id_seq RESTART WITH 1')
      .then(() => {
        const items = [{
          itemname: 'Amazing Spider-Man 135',
          itemdescription: 'A marvel comic',
          owner_id: 1,
          itemtype_id: 1,
          price: 25.00,
          created_at: new Date()
        }, {
          itemname: 'Incredible Hulk 200',
          itemdescription: 'A comic book about the hulk',
          owner_id: 1,
          itemtype_id: 1,
          price: 32.50,
          created_at: new Date()
        }, {
          itemname: 'Celestron X-Cel LX Series Eyepiece - 1.25-Inch 5mm 93421',
          itemdescription: 'X-Cel LX eyepieces, optimized for planetary viewing, offer a 60° field of view through a six-element fully multi-coated lens system',
          owner_id: 2,
          itemtype_id: 2,
          price: 65.25,
          created_at: new Date()
        }];

        return knex('item').insert(items);
      });
};