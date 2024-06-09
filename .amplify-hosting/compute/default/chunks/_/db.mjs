import knex from 'knex';

const db = knex({
  client: "sqlite3",
  // or 'better-sqlite3'
  connection: {
    filename: "./mydb.sqlite"
  }
});

export { db as d };
//# sourceMappingURL=db.mjs.map
