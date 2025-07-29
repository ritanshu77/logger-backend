import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsOptional, Matches } from 'class-validator';



export class CreateLoggerDto {

    @ApiProperty({ description: "level to be stored" })
    level: string;
    @ApiProperty({ description: "The Log Message to be stored" })
    message: string;
    @ApiProperty({ description: "The Log resourceId to be stored" })
    resourceId: string;
    @ApiProperty({ description: "The Log traceId to be stored" })
    traceId: string;
    @ApiProperty({ description: "The Log spanId to be stored" })
    spanId: string;
    @ApiProperty({ description: "The Log commit to be stored" })
    commit: string;
    @ApiProperty({ description: "The Log metadata to be stored" })
    metadata: Record<string, any>;

}
export class findAllDto {
    @ApiProperty({ description: 'Filter by id', required: false })
    id?:string;

    @ApiProperty({ description: 'page for pagination', required: false })
    page?: number;

    @ApiProperty({ description: 'limit for pagination', required: false })
    limit?: number;

    @ApiPropertyOptional({ description: 'ASC or DESC order', enum: ['ASC', 'DESC'], example: 'DESC' })
    @IsOptional()
    @IsIn(['ASC', 'DESC'], { message: 'order must be either ASC or DESC' })
    order?: 'ASC' | 'DESC';

    @ApiProperty({ description: 'Field to sort by', required: false })
    sort?: string;

    @ApiProperty({ description: 'filter by level', required: false })
    level?: string;


    @ApiProperty({ description: 'filter by message', required: false })
    message?: string;

    @ApiProperty({ description: 'filter by resourceId', required: false })
    resourceId?: string;

    @ApiProperty({ description: 'filter by traceId', required: false })
    traceId?: string;

    @ApiProperty({ description: 'filter by spanId', required: false })
    spanId?: string;

    @ApiProperty({ description: 'filter by commit', required: false })
    commit?: string;

    @ApiProperty({description: 'Start date for filtering (YYYY-MM-DD)', example: '2023-09-01',required: false })
    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'startDate must be in YYYY-MM-DD format',})
     @IsOptional()
    startDate?: string;

    @ApiProperty({ description: 'End date for filtering (YYYY-MM-DD)', example: '2023-09-30', required: false })
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {message: 'endDate must be in YYYY-MM-DD format',})
     @IsOptional()
    endDate?: string;

    @ApiProperty({description:"Search any"})
    @IsOptional()
    searchText?:string
}
