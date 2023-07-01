import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ipfs } from './entities/ipfs.entity';
import { IpfsController } from './ipfs.controller';
import { IpfsService } from './ipfs.service';
import { HeliaService } from './helia.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ipfs])],
  controllers: [IpfsController],
  providers: [IpfsService, HeliaService],
})
export class IpfsModule {}
