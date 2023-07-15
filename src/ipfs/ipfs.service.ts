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
import { HeliaService } from './helia.service';

@Injectable()
export class IpfsService {
  constructor(
    @InjectRepository(Ipfs) private ipfsRepo: Repository<Ipfs>,
    private readonly heliaService: HeliaService,
  ) {}

  public async uploadFile(file, createIpfDto: CreateIpfDto): Promise<Ipfs> {
    try {
      let finalFile = { ...file, ...createIpfDto };
      const path = await this.heliaService.uploadFile(finalFile);
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

      const text = await this.heliaService.downloadFile(cid);

      const file = JSON.parse(text);
      file.buffer.data = Buffer.from(file.buffer.data);
      return file;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async fileExist(cid): Promise<Ipfs> {
    try {
      return await this.ipfsRepo.findOne({ where: { cid } });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteFile(id: string) {
    try {
      if (!(await this.fileExist(id)))
        throw new NotFoundException('file not exist with this cid');

      const file = await this.ipfsRepo.delete({ cid: id });

      return file;
    } catch (error) {
      console.log(error.message);
      throw new HttpException(error.message, error.status);
    }
  }
}
