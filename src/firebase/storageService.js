import { storage } from './config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// Upload de imagem do jogador
export const uploadPlayerImage = (file, playerId, progressCallback) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('Nenhum arquivo foi selecionado'));
      return;
    }

    const storageRef = ref(storage, `players/${playerId}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (progressCallback) progressCallback(progress);
      },
      (error) => {
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
};
