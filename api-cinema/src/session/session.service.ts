import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Session } from '@prisma/client';

@Injectable()
export class SessionService {
  constructor(private prisma: PrismaService) {}

  async create(createSessionDto: CreateSessionDto): Promise<Session> {
    return this.prisma.session.create({ data: createSessionDto });
  }

  async findAll(): Promise<Session[]> {
    return this.prisma.session.findMany({
      include: {
        movie: true,
        room: true,
      },
    });
  }

  async findOne(id: number): Promise<Session> {
    const session = await this.prisma.session.findUnique({
      where: { id },
      include: {
        movie: true,
        room: true,
        tickets: true,
      },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }

    return session;
  }

  async update(id: number, updateSessionDto: UpdateSessionDto): Promise<Session> {
    const sessionExists = await this.prisma.session.findUnique({ where: { id } });

    if (!sessionExists) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }

    return this.prisma.session.update({
      where: { id },
      data: updateSessionDto,
    });
  }

  async remove(id: number): Promise<Session> {
    const sessionExists = await this.prisma.session.findUnique({ where: { id } });

    if (!sessionExists) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }

    return this.prisma.session.delete({
      where: { id },
    });
  }
}
