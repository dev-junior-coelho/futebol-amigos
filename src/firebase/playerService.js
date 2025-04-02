import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';

const COLLECTION_NAME = 'players';

// Obter todos os jogadores
export const getPlayers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Erro ao buscar jogadores:", error);
    throw error;
  }
};

// Obter jogadores adimplentes
export const getAdimplentePlayers = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), where("statusPagamento", "==", "Adimplente"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Erro ao buscar jogadores adimplentes:", error);
    throw error;
  }
};

// Adicionar jogador
export const addPlayer = async (playerData) => {
  try {
    // Preparar dados com valores padrão para garantir que todos os campos obrigatórios estejam presentes
    const preparedData = {
      name: playerData.name || "",
      position: playerData.position || "Meio-campo",
      peDominante: playerData.peDominante || "Destro",
      idade: playerData.idade || 0,
      assists: playerData.assists || 0,
      statusPagamento: playerData.statusPagamento || "Adimplente",
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), preparedData);
    return { id: docRef.id, ...preparedData };
  } catch (error) {
    console.error("Erro ao adicionar jogador:", error);
    throw error;
  }
};

// Atualizar jogador
export const updatePlayer = async (id, playerData) => {
  try {
    const playerRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(playerRef, { 
      ...playerData,
      peDominante: playerData.peDominante || "Destro",
      idade: playerData.idade || 0,
      updatedAt: serverTimestamp()
    });
    return { id, ...playerData };
  } catch (error) {
    console.error("Erro ao atualizar jogador:", error);
    throw error;
  }
};

// Deletar jogador
export const deletePlayer = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return id;
  } catch (error) {
    console.error("Erro ao deletar jogador:", error);
    throw error;
  }
};
