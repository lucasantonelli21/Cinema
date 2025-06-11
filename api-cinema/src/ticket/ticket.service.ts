import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Ticket } from '@prisma/client';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) {}

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    return this.prisma.ticket.create({ data: createTicketDto });
  }

  async findAll(): Promise<Ticket[]> {
    return this.prisma.ticket.findMany({
      include: {
        session: {
          include: {
            movie: true,
            room: true,
          },
        },
      },
    });
  }

  async findOne(id: number): Promise<Ticket> {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        session: {
          include: {
            movie: true,
            room: true,
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }

    return ticket;
  }

  async update(id: number, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
    const ticketExists = await this.prisma.ticket.findUnique({ where: { id } });

    if (!ticketExists) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }

    return this.prisma.ticket.update({
      where: { id },
      data: updateTicketDto,
    });
  }

  async remove(id: number): Promise<Ticket> {
    const ticketExists = await this.prisma.ticket.findUnique({ where: { id } });

    if (!ticketExists) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }

    return this.prisma.ticket.delete({
      where: { id },
    });
  }
}
