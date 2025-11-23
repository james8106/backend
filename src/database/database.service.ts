import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  pool!: mysql.Pool;

  async onModuleInit() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST || 'mysql-17e1c6cf-gbox-c5a1.k.aivencloud.com',
      port: +(process.env.DB_PORT || 19570),
      user: process.env.DB_USER || 'avnadmin',
      password: process.env.DB_PASSWORD || process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'defaultdb',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 20000, // 20 seconds to avoid early timeout

      // 🔒 Required for Aiven Cloud MySQL
      ssl: {
        rejectUnauthorized: false,
      },
    });

    try {
      const conn = await this.pool.getConnection();
      await conn.ping();
      conn.release();
      console.log('✅ MySQL pool created successfully');
    } catch (err: any) {
      console.error('❌ Failed to connect to MySQL:', err.message);
      throw err;
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  getPool(): mysql.Pool {
    return this.pool;
  }
}
