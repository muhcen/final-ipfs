import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ipfs } from './entities/ipfs.entity';
import { CreateIpfDto } from './dto/create-ipfs.dto';
import { IResponse } from './interface/response.interface';
import { ClientService } from './client.service';

@Injectable()
export class IpfsService {
  constructor(
    @InjectRepository(Ipfs) private ipfsRepo: Repository<Ipfs>,
    private readonly clientService: ClientService,
  ) {}

  public async uploadFile(file, createIpfDto: CreateIpfDto): Promise<Ipfs> {
    try {
      let finalFile = { ...file, ...createIpfDto };
      const path = await this.clientService.uploadFile(finalFile);
      finalFile.cid = path;
      const fileInfo = await this.createIpfs(finalFile);
      return fileInfo;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
  async createIpfs(file: Ipfs): Promise<Ipfs> {
    try {
      const fileInfo = this.ipfsRepo.create(file);
      return await this.ipfsRepo.save(fileInfo);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  public async downloadFile(cid: string) {
    try {
      if (!(await this.fileExist(cid)))
        throw new NotFoundException('file not exist with this cid');

      const text = await this.clientService.downloadFile(cid);

      const file = JSON.parse(text);
      file.buffer.data = Buffer.from(file.buffer.data);
      return file;
    } catch (err) {
      console.log(err.message);
      throw new HttpException(err.message, err.status);
    }
  }

  async fileExist(cid): Promise<Ipfs> {
    try {
      return this.ipfsRepo.findOne({ where: { cid } });
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException(error.message);
    }
  }

  async deleteFile(cid: string): Promise<IResponse> {
    try {
      if (!(await this.fileExist(cid)))
        throw new NotFoundException('file not exist with this cid');

      await this.ipfsRepo.delete({ cid });

      await this.clientService.deleteFile(cid);

      return {
        message: 'file removed successfully.',
      };
    } catch (error) {
      console.log(error.message);
      throw new HttpException(error.message, error.status);
    }
  }
}
