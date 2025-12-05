import { Controller, Get, Post, Body } from '@nestjs/common'; 
import { PositionsService } from './positions.service';
    @Controller('positions') 
      export class PositionsController { constructor(private readonly positionsService: PositionsService) {} 
      
    @Get() 
    async getAll() { 
      return this.positionsService.getAll(); } 
      
    @Post() 
    async create(@Body() body: any) { const { position_code, position_name, users_id } = body; 
      return this.positionsService.create(position_code, position_name, users_id); 
    } 
  }