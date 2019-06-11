exports.seed = (knex, Promise) => {
  return knex.raw('DELETE FROM item; ALTER SEQUENCE item_id_seq RESTART WITH 1')
      .then(() => {
        const items = [{
          name: 'snow shovel',
          description: 'A good snow shovel',
          instructions: 'It is out by the shed; pick it up any time',
          user_id: 2
        }, {
          name: 'Power Washer',
          description: 'Black and decker power washer',
          default_instructions_suppress: true,
          instructions: 'I need to show you how to use it; set up time for that.',
          user_id: 2
        }, {
          name: 'Canoe',
          description: 'Three man canoe',
          instructions: 'Must have swimmer certification to use',
          user_id: 1
        }];

        return knex('item').insert(items);
      });
};