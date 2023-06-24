import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ipfs } from './entities/ipfs.entity';
import { CreateIpfDto } from './dto/create-ipfs.dto';

@Injectable()
export class IpfsService {
  private fs;

  constructor(@InjectRepository(Ipfs) private ipfsRepo: Repository<Ipfs>) {
    this.connectIpfs();
  }

  private async connectIpfs() {
    try {
      const { unixfs } = await import('@helia/unixfs');
      const { FsBlockstore } = await import('blockstore-fs');
      const { FsDatastore } = await import('datastore-fs');
      const { createHelia } = await import('helia');

      const blockstore = new FsBlockstore(process.env.IPFS_PATH);
      const datastore = new FsDatastore(process.env.IPFS_PATH);

      const heliaNode = await createHelia({
        datastore,
        blockstore,
      });

      this.fs = unixfs(heliaNode);
    } catch (error) {
      console.log(error);
    }
  }

  public async uploadFile(file, createIpfDto: CreateIpfDto): Promise<Ipfs> {
    try {
      const encoder = new TextEncoder();
      let finalFile = { ...file, ...createIpfDto };

      const cid = await this.fs.addBytes(
        encoder.encode(JSON.stringify(finalFile)),
      );

      finalFile.cid = cid;
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

  public async downloadFile(id: string) {
    try {
      const { CID } = await import('multiformats/cid');
      const cid = CID.parse(id);

      if (!(await this.fileExist(cid)))
        throw new NotFoundException('file not exist with this cid');

      const decoder = new TextDecoder();
      let text = '';
      for await (const chunk of this.fs.cat(cid)) {
        text += decoder.decode(chunk, {
          stream: true,
        });
      }
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
}
