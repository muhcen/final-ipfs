import { Test, TestingModule } from '@nestjs/testing';
import { IpfsService } from './ipfs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ipfs } from './entities/ipfs.entity';
import { FindOneOptions } from 'typeorm';
import { CreateIpfDto } from './dto/create-ipfs.dto';
import { ClientService } from './client.service';
import { resolve } from 'path';

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
  };

  const MockFile: Express.Multer.File = {
    fieldname: 'example',
    originalname: '',
    encoding: '',
    mimetype: '',
    size: 0,
    stream: undefined,
    destination: '',
    filename: '',
    path: '',
    buffer: Buffer.from('mohsen moradi'),
  };

  const createIpfs: CreateIpfDto = {
    userId: '123',
    description: 'somthing',
    metadata: 'xyz',
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

    delete: jest.fn().mockImplementation((query) => Promise.resolve()),
  };

  const cid = '123456789';
  const mockClientService = {
    uploadFile: jest.fn((file) => {
      return cid;
    }),

    downloadFile: jest.fn((cid) => JSON.stringify(MockFile)),

    deleteFile: jest.fn((cid) => Promise.resolve()),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IpfsService,
        ClientService,
        { provide: getRepositoryToken(Ipfs), useValue: mockIpfsRepository },
      ],
    })
      .overrideProvider(ClientService)
      .useValue(mockClientService)
      .compile();

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
    expect(await ipfsService.fileExist(cid)).toEqual(ipfsDto);
  });

  it('should upload file in ipfs', async () => {
    expect(await ipfsService.uploadFile(MockFile, createIpfs)).toEqual({
      id: expect.any(Number),
    });
  });

  it('should download file from ipfs', async () => {
    expect(await ipfsService.downloadFile(cid)).toEqual(
      expect.objectContaining({ fieldname: 'example' }),
    );
  });

  it('should remove file from ipfs', async () => {
    expect(await ipfsService.deleteFile(cid)).toEqual(
      expect.objectContaining({ message: 'file removed successfully.' }),
    );
  });
});
