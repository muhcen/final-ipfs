import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Ipfs } from './entities/ipfs.entity';
import { CreateIpfDto } from './dto/create-ipfs.dto';
import { IpfsService } from './ipfs.service';
import { IResponse } from './interface/response.interface';
import { ApiConsumes, ApiParam } from '@nestjs/swagger';

@Controller('ipfs')
export class IpfsController {
  constructor(private readonly ipfsService: IpfsService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(new ParseFilePipe())
    file: Express.Multer.File,
    @Body() createIpfs: CreateIpfDto,
  ): Promise<Ipfs> {
    return await this.ipfsService.uploadFile(file, createIpfs);
  }

  @Get('download/:id')
  async downloadFile(@Res() response: Response, @Param('id') id: string) {
    const file = await this.ipfsService.downloadFile(id);
    return response
      .setHeader(
        'Content-Disposition',
        'attachment; filename=' + file.originalname,
      )
      .setHeader('Content-Type', file.mimetype)
      .send(file.buffer.data);
  }

  @Delete(':cid')
  async deleteFile(@Param('cid') cid: string): Promise<IResponse> {
    return this.ipfsService.deleteFile(cid);
  }
}
