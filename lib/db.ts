import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'gestion_absences1',
  password: 'GREGOIRE', 
  port: 5432,
});

export default pool;
