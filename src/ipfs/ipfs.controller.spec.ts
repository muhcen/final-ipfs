import { Test, TestingModule } from '@nestjs/testing';
import { IpfsController } from './ipfs.controller';
import { IpfsService } from './ipfs.service';
import { Response, response } from 'express';
import { createMock } from '@golevelup/ts-jest';

describe('AppController', () => {
  let ipfsController: IpfsController;

  const mockResponseObject = () => {
    return createMock<Response>({
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    });
  };

  // const mockResponse = mockResponseObject();

  const ipfsDto = {
    userId: '1',
    description: 'hello world',
    metadata: 'somthing',
  };

  const mockFile = {
    fieldname: 'file',
    originalname: 'text.txt',
    encoding: '7bit',
    mimetype: 'text/plain',
    buffer: Buffer.from(__dirname + '/testFile/text.txt', 'utf8'),
    size: 518,
  } as Express.Multer.File;

  const mockIpfsService = {
    uploadFile: jest.fn((file: Express.Multer.File, dto) => {
      return {
        ...file,
        ...dto,
      };
    }),
    downloadFile: jest.fn().mockImplementation((response, id) => {
      return {
        ...ipfsDto,
        ...mockFile,
      };
    }),
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
    expect(await ipfsController.uploadFile(mockFile, ipfsDto)).toEqual({
      ...ipfsDto,
      ...mockFile,
    });
  });

  // it('should download file', async () => {
  //   const response = await ipfsController.downloadFile(
  //     mockResponse,
  //     ipfsDto.userId,
  //   );
  //   console.log(response);
  //   expect(await response.getHeader('Content-Disposition')).toBe(
  //     'attachment; filename=text.txt',
  //   );
  //   expect(await response.getHeader('Content-Type')).toBe('text/plain');
  // });
});
