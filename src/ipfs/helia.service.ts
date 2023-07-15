import { Injectable } from '@nestjs/common';
import { createHeliaClient } from './helia/helia-client';

@Injectable()
export class HeliaService {
  private heliaClient;

  constructor() {
    this.connectToIpfs().then(() => {
      console.log('ipfs ready to use');
    });
  }

  async connectToIpfs() {
    if (!this.heliaClient) this.heliaClient = await createHeliaClient();
    return this.heliaClient;
  }

  async uploadFile(finalFile) {
    try {
      await this.connectToIpfs();
      const encoder = new TextEncoder();

      const { cid } = await this.heliaClient.add(
        encoder.encode(JSON.stringify(finalFile)),
      );

      return cid;
    } catch (error) {
      return error;
    }
  }

  async downloadFile(cid) {
    try {
      await this.connectToIpfs();
      const decoder = new TextDecoder();
      let text = '';
      for await (const chunk of this.heliaClient.cat(cid)) {
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
      const file = await this.heliaClient.pin.rm(id);
      console.log(file);
      return file;
    } catch (error) {
      console.log(error);
    }
  }
}
