// positions.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('positions')
export class PositionsController {
  private positions = [];

  @Get()
  getAllPositions() {
    return this.positions;
  }

  @Post()
  createPosition(@Body() position: { position_code: any; position_name: any }) {
    this.positions.push;
    return position;
  }
} 