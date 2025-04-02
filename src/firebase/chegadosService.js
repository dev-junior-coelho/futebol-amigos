import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  query, 
  where, 
  serverTimestamp,
  doc
} from 'firebase/firestore';
import { db } from './config';

const COLLECTION_NAME = 'chegados';

// Obter todos os jogadores que chegaram
export const getChegados = async (eventoId = 'atual') => {
  try {
    const q = query(collection(db, COLLECTION_NAME), where("eventoId", "==", eventoId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Erro ao buscar chegados:", error);
    throw error;
  }
};

// Adicionar jogador aos chegados
export const addChegado = async (player, eventoId = 'atual') => {
  try {
    // Verificar se o jogador já está na lista
    const q = query(
      collection(db, COLLECTION_NAME),
      where("playerId", "==", player.id),
      where("eventoId", "==", eventoId)
    );
    const querySnapshot = await getDocs(q);
    
    // Se o jogador já estiver na lista, retorne
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    }
    
    // Adicionar jogador à lista de chegados
    const chegadoData = {
      playerId: player.id,
      playerName: player.name,
      playerPosition: player.position,
      eventoId: eventoId,
      chegadaEm: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), chegadoData);
    return { id: docRef.id, ...chegadoData };
  } catch (error) {
    console.error("Erro ao adicionar chegado:", error);
    throw error;
  }
};

// Remover jogador dos chegados
export const removeChegado = async (playerId, eventoId = 'atual') => {
  try {
    // Encontrar o documento para deletar
    const q = query(
      collection(db, COLLECTION_NAME),
      where("playerId", "==", playerId),
      where("eventoId", "==", eventoId)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log("Jogador não encontrado na lista de chegados");
      return;
    }
    
    // Deletar o documento
    await deleteDoc(doc(db, COLLECTION_NAME, querySnapshot.docs[0].id));
    return playerId;
  } catch (error) {
    console.error("Erro ao remover chegado:", error);
    throw error;
  }
};
