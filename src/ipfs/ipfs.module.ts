import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ipfs } from './entities/ipfs.entity';
import { IpfsController } from './ipfs.controller';
import { IpfsService } from './ipfs.service';
import { ClientService } from './client.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ipfs]),
    MulterModule.register({ limits: { fileSize: 100 * 1024 * 1024 } }),
  ],
  controllers: [IpfsController],
  providers: [IpfsService, ClientService],
})
export class IpfsModule {}
