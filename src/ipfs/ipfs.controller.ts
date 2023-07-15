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

@Controller('ipfs')
export class IpfsController {
  constructor(private readonly ipfsService: IpfsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(new ParseFilePipe())
    file: Express.Multer.File,
    @Body() createIpfs: CreateIpfDto,
  ): Promise<Ipfs> {
    try {
      return await this.ipfsService.uploadFile(file, createIpfs);
    } catch (error) {
      throw error;
    }
  }

  @Get('download/:id')
  async downloadFile(@Res() response: Response, @Param('id') id: string) {
    try {
      const file = await this.ipfsService.downloadFile(id);
      return response
        .setHeader(
          'Content-Disposition',
          'attachment; filename=' + file.originalname,
        )
        .setHeader('Content-Type', file.mimetype)
        .send(file.buffer.data);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async deleteFile(@Param('id') id: string) {
    try {
      const file = await this.ipfsService.deleteFile(id);
      return file;
    } catch (error) {
      throw error;
    }
  }
}
