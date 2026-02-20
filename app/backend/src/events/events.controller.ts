import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { EventResponseDto } from './dto/event-response.dto';
import { plainToInstance } from 'class-transformer';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createEventDto: CreateEventDto, @CurrentUser() user: User): Promise<EventResponseDto> {
    const event = await this.eventsService.create(createEventDto, user);
    return plainToInstance(EventResponseDto, event);
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ): Promise<{ data: EventResponseDto[]; total: number; page: number; limit: number }> {
    const [events, total] = await this.eventsService.findAll(page, limit);
    return {
      data: plainToInstance(EventResponseDto, events),
      total,
      page,
      limit,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<EventResponseDto> {
    const event = await this.eventsService.findOne(id);
    return plainToInstance(EventResponseDto, event);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @CurrentUser() user: User,
  ): Promise<EventResponseDto> {
    const event = await this.eventsService.update(id, updateEventDto, user);
    return plainToInstance(EventResponseDto, event);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @CurrentUser() user: User): Promise<{ message: string }> {
    await this.eventsService.remove(id, user);
    return { message: 'Event deleted successfully' };
  }
}
