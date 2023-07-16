import { ClientService } from './client.service';
import { createIPFSClient } from './ipfs/ipfs-client';

jest.mock('./ipfs/ipfs-client', () => ({
  createIPFSClient: jest.fn().mockResolvedValue({}),
}));

describe('ClientService', () => {
  let clientService: ClientService;

  beforeEach(() => {
    clientService = new ClientService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('connectToIpfs', () => {
    it('should initialize ipfsClient if it is not already initialized', async () => {
      await clientService.connectToIpfs();
      expect(createIPFSClient).toHaveBeenCalled();
      expect(clientService.ipfsClient).toBeDefined();
    });
  });

  describe('uploadFile', () => {
    it('should upload the file successfully', async () => {
      clientService.ipfsClient = {
        add: jest.fn().mockResolvedValue({ path: 'file-path' }),
      };
      const finalFile = { name: 'file.txt', content: 'file contents' };
      const result = await clientService.uploadFile(finalFile);
      expect(clientService.ipfsClient.add).toHaveBeenCalled();
      expect(result).toEqual('file-path');
    });
  });

  describe('downloadFile', () => {
    it('should download the file successfully', async () => {
      clientService.ipfsClient = {
        cat: jest
          .fn()
          .mockReturnValue([new TextEncoder().encode('file contents')]),
      };
      const cid = 'file-cid';
      const result = await clientService.downloadFile(cid);
      expect(clientService.ipfsClient.cat).toHaveBeenCalled();
      expect(result).toEqual('file contents');
    });
  });

  describe('deleteFile', () => {
    it('should delete the file successfully', async () => {
      clientService.ipfsClient = {
        pin: { rm: jest.fn().mockResolvedValue({}) },
        repo: { gc: jest.fn().mockReturnValue([{ cid: 'file-cid' }]) },
      };
      const cid = 'file-cid';
      await clientService.deleteFile(cid);
      expect(clientService.ipfsClient.pin.rm).toHaveBeenCalled();
      expect(clientService.ipfsClient.repo.gc).toHaveBeenCalled();
    });
  });
});
