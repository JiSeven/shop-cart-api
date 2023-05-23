import { Pool, PoolClient, QueryResult } from 'pg';

const {
  DATABASE_PASSWORD,
  DATABASE_USERNAME,
  DATABASE_NAME,
  DATABASE_PORT,
  DATABASE_HOST,
} = process.env;

const options = {
  host: DATABASE_HOST,
  port: Number(DATABASE_PORT),
  database: DATABASE_NAME,
  user: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 10000,
};

let pool: Pool;

if (!pool) {
  pool = new Pool(options);
}

export const query = async <T>(query: string, values: any[] = []): Promise<QueryResult<T>> => {
  const poolClient = await pool.connect();

  let result: QueryResult;

  try {
    result = await pool.query<T>(query, values);
  } catch (err) {
    console.log(err);
    return err;
  } finally {
    poolClient.release();
  }
  return result;
};