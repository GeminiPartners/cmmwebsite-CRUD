// Update with your config settings.



module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost:5432/gobmark?user=gobmark&password=gobmark'
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL 
  }

};
