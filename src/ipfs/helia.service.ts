import { Injectable } from '@nestjs/common';

async function createHeliaClient() {
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

    return unixfs(heliaNode);
  } catch (error) {
    console.log(error);
  }
}
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

      const cid = await this.heliaClient.addBytes(
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
}
