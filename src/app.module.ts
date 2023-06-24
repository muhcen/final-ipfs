import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IpfsModule } from './ipfs/ipfs.module';
import { Ipfs } from './ipfs/entities/ipfs.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.POSTGRES_URI,
      entities: [Ipfs],
      synchronize: false,
    }),
    IpfsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
