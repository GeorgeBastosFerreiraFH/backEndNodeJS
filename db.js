const { Pool } = require('pg')

const pool = new Pool({
  host: 'ep-shy-salad-a5gvxecw-pooler.us-east-2.aws.neon.tech',
  user: 'neondb_owner',
  password: 'uk2hfr3JKxQz',
  database: 'neondb',
  port: 5432,
  ssl: { rejectUnauthorized: false },
})

module.exports = pool