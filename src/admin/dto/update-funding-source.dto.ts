import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateFundingSourceDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
// Note: For more complex applications, you could use @nestjs/mapped-types
// and extend the Create DTO, like so:
// import { PartialType } from '@nestjs/mapped-types';
// import { CreateFundingSourceDto } from './create-funding-source.dto';
// export class UpdateFundingSourceDto extends PartialType(CreateFundingSourceDto) {}
