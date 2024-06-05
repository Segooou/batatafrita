import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';
import { env } from '../../main/config/env';
import { random } from '../../main/utils/random';

const accountName = env.AZURE.ACCOUNT_NAME;
const accountKey = env.AZURE.ACCOUNT_KEY;
const azureUrl = env.AZURE.URL;

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
const blobServiceClient = new BlobServiceClient(azureUrl, sharedKeyCredential);

interface uploadFileToAzureProps {
  azurePath: string;
  image: Buffer;
}

export const uploadFileToAzure = async ({
  azurePath,
  image
}: uploadFileToAzureProps): Promise<string | null> => {
  try {
    const containerClient = blobServiceClient.getContainerClient('resultado');
    const blockBlobClient = containerClient.getBlockBlobClient(
      azurePath.replace(`${azureUrl}resultado/`, '')
    );

    const blobHTTPHeaders = {
      blobHTTPHeaders: {
        blobContentType: 'image/jpeg'
      }
    };

    await blockBlobClient.uploadData(image, blobHTTPHeaders);

    return blockBlobClient.url;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const generateAzurePathJpeg = (): string => {
  return `${azureUrl}resultado/${Date.now()}-${random()}.jpeg`;
};
