import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MovieModule } from './movie/movie.module';
import { RoomModule } from './room/room.module';
import { SessionModule } from './session/session.module';
import { TicketModule } from './ticket/ticket.module';

@Module({
  imports: [PrismaModule, MovieModule, RoomModule, SessionModule, TicketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
