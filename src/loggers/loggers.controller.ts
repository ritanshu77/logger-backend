import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { LoggersService } from './loggers.service';
import { CreateLoggerDto, findAllDto } from './dto/create-logger.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Logger')
@Controller('loggers')
export class LoggersController {
  constructor(private readonly loggersService: LoggersService) { }

  @Post()
  @ApiOperation({ summary: 'Create new log entry' })
  @ApiResponse({ status: 201, description: "Log created" })
  create(@Body() body: CreateLoggerDto) {
    return this.loggersService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'get All logs' })
  @ApiResponse({ status: 200, description: "List of logs" })
  findAll(@Query() query: findAllDto) {
    return this.loggersService.findAll(query);
  }

  // @Get("data")
  //  @ApiResponse({ status: 200, description: "List of random" })
  // addRandomData(){
  //   console.log("------random---------")
  //    return this.loggersService.addRandomData();
  // }
}
