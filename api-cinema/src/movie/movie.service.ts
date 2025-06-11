import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Movie } from '@prisma/client';

@Injectable()
export class MovieService {
  constructor(private prisma: PrismaService) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.prisma.movie.create({ data: createMovieDto });
  }

  async findAll(): Promise<Movie[]> {
    return this.prisma.movie.findMany();
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      include: {
        sessions: true,
      },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    return movie;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const movieExists = await this.prisma.movie.findUnique({ where: { id } });

    if (!movieExists) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    return this.prisma.movie.update({
      where: { id },
      data: updateMovieDto,
    });
  }

  async remove(id: number): Promise<Movie> {
    const movieExists = await this.prisma.movie.findUnique({ where: { id } });

    if (!movieExists) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    return this.prisma.movie.delete({
      where: { id },
    });
  }
}
