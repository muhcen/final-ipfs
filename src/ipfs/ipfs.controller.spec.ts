import { Test, TestingModule } from '@nestjs/testing';
import { IpfsController } from './ipfs.controller';
import { IpfsService } from './ipfs.service';
import fs from 'fs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ipfs } from './entities/ipfs.entity';
import { ConfigModule } from '@nestjs/config';
describe('AppController', () => {
  let ipfsController: IpfsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([Ipfs]),
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          type: 'postgres',
          url: process.env.POSTGRES_URI,
          entities: [Ipfs],
          synchronize: false,
        }),
      ],
      controllers: [IpfsController],
      providers: [IpfsService],
    }).compile();

    ipfsController = app.get<IpfsController>(IpfsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'TradeHistory.csv',
        encoding: '7bit',
        mimetype: 'text/csv',
        buffer: Buffer.from(__dirname + '/../../TradeHistory.csv', 'utf8'),
        size: 51828,
      } as Express.Multer.File;
      expect(
        ipfsController.uploadFile(mockFile, {
          userId: 'xyz',
          description: 'abc',
          metadata: 'hjk',
        }),
      ).toContain({
        fieldname: 'file',
        originalname: 'TradeHistory.csv',
        encoding: '7bit',
        mimetype: 'text/csv',
      });
    });
  });
});
