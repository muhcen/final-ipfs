import { Test, TestingModule } from '@nestjs/testing';
import { IpfsController } from './ipfs.controller';
import { IpfsService } from './ipfs.service';
import { Response } from 'express';
import { createMock } from '@golevelup/ts-jest';
import { CreateIpfDto } from './dto/create-ipfs.dto';

describe('AppController', () => {
  let ipfsController: IpfsController;

  const mockResponseObject = () => {
    return createMock<Response>({
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      setHeader: function (header, value) {
        this[header] = value;
        return this;
      },
      send: jest.fn().mockReturnThis(),
    });
  };

  const MockFile: Express.Multer.File = {
    fieldname: '',
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
    file: undefined,
  };

  const mockResponse = mockResponseObject();

  const mockIpfsService = {
    uploadFile: jest.fn((file: Express.Multer.File, dto) => {
      return {
        ...file,
        ...dto,
      };
    }),

    downloadFile: jest.fn((id) => MockFile),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [IpfsController],
      providers: [IpfsService],
    })
      .overrideProvider(IpfsService)
      .useValue(mockIpfsService)
      .compile();

    ipfsController = app.get<IpfsController>(IpfsController);
  });

  it('Controller - should be defined', () => {
    expect(ipfsController).toBeDefined();
  });

  it('should upload file', async () => {
    expect(await ipfsController.uploadFile(MockFile, createIpfs)).toEqual({
      ...MockFile,
      ...createIpfs,
    });
  });

  it('should download a file and set the response headers', async () => {
    const id = '123456';

    await ipfsController.downloadFile(mockResponse, id);

    expect(mockIpfsService.downloadFile).toHaveBeenCalledWith(id);
    expect(mockResponse.setHeader).toHaveBeenCalledTimes(2);
    expect(mockResponse.setHeader).toHaveBeenCalledWith(
      'Content-Disposition',
      'attachment; filename=' + MockFile.originalname,
    );
    expect(mockResponse.setHeader).toHaveBeenCalledWith(
      'Content-Type',
      MockFile.mimetype,
    );
    expect(mockResponse.send).toHaveBeenCalled();
  });
});
