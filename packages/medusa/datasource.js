const { DataSource } = require("typeorm")

const AppDataSource = new DataSource({
  type: "postgres",
  port: 5432,
  username: "medusaserverpostgresql_i5hq_user",
  password: "TN818aorb6p2OswanLbRgciJVw4tZe5c",
  host: "dpg-ch541pik728glsjgdlhg-a.oregon-postgres.render.com",
  database: "medusaserverpostgresql_i5hq",
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [
    "dist/models/group.js",
    "dist/models/role.js",
    "dist/models/user.js",
  ],
  migrations: ["dist/migrations/*.js"],
})

module.exports = {
  datasource: AppDataSource,
}
