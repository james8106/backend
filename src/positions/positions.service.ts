import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { OkPacket, RowDataPacket } from 'mysql2';

@Injectable()
export class PositionsService {
  constructor(private readonly db: DatabaseService) {}

  // Create a new position
  async create(position_code: string, position_name: string, users_id: number | null) {
    const code = position_code ?? null;
    const name = position_name ?? null;
    const owner = users_id ?? null;

    const sql = `
      INSERT INTO positions (position_code, position_name, user_id)
      VALUES (?, ?, ?)
    `;

    const [result] = await this.db.getPool().execute(sql, [
      code,
      name,
      owner,
    ]);

    return {
      position_id: (result as OkPacket).insertId,
      position_code: code,
      position_name: name,
      user_id: owner,
    };
  }

  // Get all positions
  async getAll() {
    const sql = `
      SELECT position_id, position_code, position_name, user_id
      FROM positions
    `;

    const [rows] = await this.db
      .getPool()
      .execute<RowDataPacket[]>(sql);

    return rows;
  }
}
