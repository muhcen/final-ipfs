import { Injectable } from '@nestjs/common';
import { createIPFSClient } from './ipfs/ipfs-client';

@Injectable()
export class HeliaService {
  private ipfsClient;

  constructor() {
    this.connectToIpfs().then(() => {
      console.log('ipfs ready to use');
    });
  }

  async connectToIpfs() {
    if (!this.ipfsClient) this.ipfsClient = await createIPFSClient();
    return this.ipfsClient;
  }

  async uploadFile(finalFile) {
    try {
      await this.connectToIpfs();
      const encoder = new TextEncoder();

      const { path } = await this.ipfsClient.add(
        encoder.encode(JSON.stringify(finalFile)),
      );

      return path;
    } catch (error) {
      return error;
    }
  }

  async downloadFile(cid) {
    try {
      await this.connectToIpfs();
      const decoder = new TextDecoder();
      let text = '';
      for await (const chunk of this.ipfsClient.cat(cid)) {
        text += decoder.decode(chunk, {
          stream: true,
        });
      }

      return text;
    } catch (error) {
      return error;
    }
  }

  async deleteFile(id: string) {
    try {
      const { cid } = await this.ipfsClient.pin.rm(id);
      for await (const res of this.ipfsClient.repo.gc()) {
        console.log(res);
      }
      return cid;
    } catch (error) {
      console.log(error);
    }
  }
}
