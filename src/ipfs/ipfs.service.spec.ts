import { Test, TestingModule } from '@nestjs/testing';
import { IpfsService } from './ipfs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ipfs } from './entities/ipfs.entity';
import { FindOneOptions } from 'typeorm';

describe('IpfsService', () => {
  let ipfsService: IpfsService;

  const ipfsDto: Ipfs = {
    id: 1,
    cid: 'xyz',
    originalname: 'somthing',
    encoding: '7bit',
    mimetype: 'text/plain',
    size: '100',
    description: 'somthings',
    metadata: 'xyz',
    userId: 'xyz',
    uploadTime: new Date(2022),
    setUploadtime: function (): void {
      throw new Error('Function not implemented.');
    },
  };

  const mockIpfsRepository = {
    create: jest
      .fn()
      .mockImplementation((ipfs) => Promise.resolve({ ...ipfs })),
    save: jest
      .fn()
      .mockImplementation((ipfs) =>
        Promise.resolve({ id: Date.now(), ...ipfs }),
      ),

    findOne: jest
      .fn()
      .mockImplementation((query: FindOneOptions) => Promise.resolve(ipfsDto)),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IpfsService,
        { provide: getRepositoryToken(Ipfs), useValue: mockIpfsRepository },
      ],
    }).compile();

    ipfsService = module.get<IpfsService>(IpfsService);
  });

  it('Service - should be defined', () => {
    expect(ipfsService).toBeDefined();
  });

  it('should save file data', async () => {
    expect(await ipfsService.createIpfs(ipfsDto)).toEqual({
      id: expect.any(Number),
    });
  });

  it('should return file if exists', async () => {
    expect(await ipfsService.fileExist(ipfsDto)).toEqual(ipfsDto);
  });
});
