export async function createIPFSClient() {
  try {
    const { create } = await import('ipfs-http-client');
    const client = create({
      host: process.env.IPFS_ADDRESS_HOST,
      port: Number(process.env.IPFS_ADDRESS_PORT),
      protocol: process.env.IPFS_ADDRESS_PROTOCOL,
    });

    return client;
  } catch (error) {
    console.log(error.message);
  }
}
