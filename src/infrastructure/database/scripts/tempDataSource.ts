
import { DataSource } from "typeorm";

const dataSource = new DataSource({
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "postgres",
  "password": "admin",
  "database": "test",
  "synchronize": false,
  "logging": true,
  "subscribers": [],
  "entities": [
    "D:\\Ny mappe\\portfolio\\src\\infrastructure\\entities\\*Entity.{ts,js}"
  ],
  "migrations": [
    "D:\\Ny mappe\\portfolio\\src\\infrastructure\\database\\migrations\\**\\*.{ts,js}"
  ]
});

export default dataSource;
  