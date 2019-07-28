exports.seed = (knex, Promise) => {
    return knex.raw('DELETE FROM "user"; ALTER SEQUENCE user_id_seq RESTART WITH 3')
      .then(() => {
        const users = [
          {
            id: 1,
            email: 'hello@hello.com',
            username: 'berto',
            password: '$2b$10$zQprr9Nb7nX11FNau39KRO.Xo91qZJoC/19phsgypma.MYhNkDBJO',
            created_at: new Date()
          },
          {
            id: 2,
            email: 'helen@helen.com',
            username: 'helen',
            password: '$2b$10$zQprr9Nb7nX11FNau39KRO.Xo91qZJoC/19phsgypma.MYhNkDBJO',
            created_at: new Date()
          }
        ]
        return knex('user').insert(users)
      })
};
