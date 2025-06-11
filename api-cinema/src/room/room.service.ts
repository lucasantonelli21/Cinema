import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Room } from '@prisma/client';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    return this.prisma.room.create({ data: createRoomDto });
  }

  async findAll(): Promise<Room[]> {
    return this.prisma.room.findMany();
  }

  async findOne(id: number): Promise<Room> {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: {
        sessions: true,
      },
    });

    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    return room;
  }

  async update(id: number, updateRoomDto: UpdateRoomDto): Promise<Room> {
    const roomExists = await this.prisma.room.findUnique({ where: { id } });

    if (!roomExists) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    return this.prisma.room.update({
      where: { id },
      data: updateRoomDto,
    });
  }

  async remove(id: number): Promise<Room> {
    const roomExists = await this.prisma.room.findUnique({ where: { id } });

    if (!roomExists) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    return this.prisma.room.delete({
      where: { id },
    });
  }
}
