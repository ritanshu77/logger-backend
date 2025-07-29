import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateLoggerDto, findAllDto } from './dto/create-logger.dto';
import { UpdateLoggerDto } from './dto/update-logger.dto';
import * as fs from "fs";
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggersService {
  private readonly filepath = process.cwd() + '/database/logs.json';

  async create(createLoggerDto: CreateLoggerDto) {
    try {
      let log: any[] = [];
      createLoggerDto["timestamp"] = moment.utc().format();
      createLoggerDto["id"]= uuidv4();
      if (fs.existsSync(this.filepath)) {
        const filecontent = fs.readFileSync(this.filepath, 'utf-8')
        try {
          log = JSON.parse(filecontent)

        } catch (error) {
          log = [];
        }
      }
      log.push(createLoggerDto);
      fs.writeFileSync(this.filepath, JSON.stringify(log, null, 2),'utf-8');

      return {
        status: true,
        message: 'Logger created',
        data:{
          id:createLoggerDto["id"],
        }
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  findAll(query: findAllDto) {
    try {
      let log: any[] = [];
      if (fs.existsSync(this.filepath)) {
        const filecontent = fs.readFileSync(this.filepath, 'utf-8');
        if (!filecontent) {
          return {
            page: 1,
            limit: 0,
            total: 0,
            data: [],
          };
        }
        try {
          log = JSON.parse(filecontent);
          // log = log.map((item) => ({
          //   ...item,
          //   id: item.id || uuidv4(),
          // }));
          // fs.writeFileSync(this.filepath, JSON.stringify(log, null, 2), 'utf-8');
          log = log.filter((item) => {
            return (
              (!query.level || item.level.toLowerCase() === query.level.toLowerCase())
              &&(!query.id || item.id == query.id.trim())
              &&(!query.message || item.message.toLowerCase().includes(query.message.toLowerCase()))
              &&(!query.resourceId || item.resourceId.toLowerCase().includes(query.resourceId.toLowerCase()))
              &&(!query.traceId || item.traceId.toLowerCase().includes(query.traceId.toLowerCase()))
              &&(!query.spanId || item.spanId.toLowerCase().includes(query.spanId.toLowerCase()))
              &&(!query.commit || item.commit.toLowerCase().includes(query.commit.toLowerCase()))
              &&(!query.startDate || item.timestamp?.split('T')[0] >= query.startDate.toLowerCase())
              &&(!query.endDate || item.timestamp?.split('T')[0] <= query.endDate.toLowerCase())
              &&(!query.searchText || item.message.toLowerCase().includes(query.searchText.toLowerCase()) || item.resourceId.toLowerCase().includes(query.searchText.toLowerCase()) || item.traceId.toLowerCase().includes(query.searchText.toLowerCase()) || item.spanId.toLowerCase().includes(query.searchText.toLowerCase()) || item.commit.toLowerCase().includes(query.searchText.toLowerCase()))
            );
          });

          const sortField = query?.sort || 'timestamp';
          const order = query?.order?.toUpperCase() || 'DESC';

          log.sort((a, b) => {
            if (!a[sortField] || !b[sortField]) return 0;
            if (order === 'ASC') return a[sortField] > b[sortField] ? 1 : -1;
            else return a[sortField] < b[sortField] ? 1 : -1;
          });

          log = log.map((item, index) => ({
            ...item,
            no: index + 1
          }));

          let page = Number(query.page) ?? 1;
          let limit = Number(query.limit) ?? 10;
          let start = (page - 1) * limit;
          let end = start + limit;

          let paginatedData = log.slice(start, end);
          if (paginatedData.length == 0 && log.length > 0) {
            page = 1
            start = (page - 1) * limit;
            end = start + limit;
            paginatedData = log.slice(start, end);
          }
          limit = paginatedData.length > limit ? limit : paginatedData.length;
          return {
            page,
            limit,
            total: log.length,
            data: paginatedData,
          };

        } catch (error) {
          throw new InternalServerErrorException(error.message);
        }
      }
      return {
        page: 1,
        limit: 0,
        total: 0,
        data: [],
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // add logs dynamicly for development purpose only
  // addRandomData() {
  //   // Type definitions
  //   interface Metadata {
  //     parentResourceId: string;
  //   }

  //   interface LogEntry {
  //     level: string;
  //     message: string;
  //     resourceId: string;
  //     timestamp: string;
  //     traceId: string;
  //     spanId: string;
  //     commit: string;
  //     metadata: Metadata;
  //   }

  //   // Constants
  //   const levels = ['error', 'warn', 'info', 'debug'];
  //   const messages = [
  //     "Failed to connect to database.",
  //     "Memory usage exceeded threshold.",
  //     "User login successful.",
  //     "Starting background job scheduler.",
  //     "Cache cleared successfully.",
  //     "File uploaded to server.",
  //     "Scheduled task executed.",
  //     "Token expired and regenerated."
  //   ];
  //   const resourceIds = ['server-1234', 'container-7890', 'auth-service', 'worker-node-22', 'gateway-9001', 'scheduler-cluster'];
  //   const commits = ['5e5342f', '7g8412h', '3e2221c', '9d832af', '1a2b3c4', 'd4e5f6g'];

  //   // Random generators
  //   function getRandomDate(): string {
  //     const start = new Date(2023, 0, 1).getTime(); // Jan 1, 2023
  //     const end = new Date(2025, 6, 19).getTime();  // Jul 19, 2025
  //     return new Date(start + Math.random() * (end - start)).toISOString();
  //   }

  //   function getRandomItem<T>(arr: T[]): T {
  //     return arr[Math.floor(Math.random() * arr.length)];
  //   }

  //   function generateLog(): LogEntry {
  //     return {
  //       level: getRandomItem(levels),
  //       message: getRandomItem(messages),
  //       resourceId: getRandomItem(resourceIds),
  //       timestamp: getRandomDate(),
  //       traceId: `trace-${Math.random().toString(36).substring(2, 10)}`,
  //       spanId: `span-${Math.floor(Math.random() * 1000)}`,
  //       commit: getRandomItem(commits),
  //       metadata: {
  //         parentResourceId: getRandomItem(resourceIds),
  //       },
  //     };
  //   }

  //   // Main function
  //   function generateLogs(total: number) {
  //     const logs: LogEntry[] = [];
  //     console.log(`📦 Generating ${total} logs...`);

  //     for (let i = 0; i < total; i++) {
  //       logs.push(generateLog());
  //       if (i % 100000 === 0 && i !== 0) console.log(`✅ ${i} logs created`);
  //     }
  //     let filepath = process.cwd() + '/database/logs.json'
  //     console.log("-----------v----------",filepath)
  //     fs.writeFileSync(filepath, JSON.stringify(logs, null, 2));
  //     console.log(`✅ File saved: ${filepath}`);
  //   }

  //   // Run it
  //    generateLogs(1000000);
  //  return 'run the function'
  // }
}
