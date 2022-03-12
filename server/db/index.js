var Pool = require('pg-pool');

var pool2 = new Pool({
  database: 'faq',
  user: 'ubuntu',
  password: 'password',
  host: '184.72.96.86',
  port: 5432,
  // max: 20, // set pool max size to 20
  // idleTimeoutMillis: 1000, // close idle clients after 1 second
  // connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
  // maxUses: 7500, // close (and replace) a connection after it has been used 7500 times (see below for discussion)
});

pool2.connect((err, pool2, release) => {
  if (err) {
    console.log(err);
    return;
  }
  pool2.query('SELECT NOW()').then((res) => console.log(res.rows));
});

module.exports = pool2;
