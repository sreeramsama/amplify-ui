import { StorageManager } from '@aws-amplify/ui-react-storage'; // IGNORE
export const StorageManagerResumableExample = () => {
  return (
    <StorageManager
      acceptedFileTypes={['image/*', '.zip', '.mp4']}
      accessLevel="public"
      maxFileCount={10}
      isResumable
      provider="slow" // IGNORE
    />
  );
};