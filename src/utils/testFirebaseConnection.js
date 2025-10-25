// 🧪 Test rapide de connexion Firebase
import { db, storage, auth } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

export async function testFirebaseConnection() {
  console.log('🧪 Test de connexion Firebase...');
  
  const results = {
    firestore: false,
    storage: false,
    auth: false,
    errors: []
  };

  try {
    // Test Firestore
    console.log('📊 Test Firestore...');
    const testCollection = collection(db, 'test');
    await getDocs(testCollection);
    results.firestore = true;
    console.log('✅ Firestore : OK');
  } catch (error) {
    results.errors.push(`Firestore: ${error.message}`);
    console.error('❌ Firestore :', error.message);
  }

  try {
    // Test Storage
    console.log('💾 Test Storage...');
    const testRef = ref(storage, 'test/test.txt');
    await getDownloadURL(testRef);
    results.storage = true;
    console.log('✅ Storage : OK');
  } catch (error) {
    // Storage peut échouer si le fichier n'existe pas, c'est normal
    if (error.code === 'storage/object-not-found') {
      results.storage = true; // Storage fonctionne, juste pas de fichier test
      console.log('✅ Storage : OK (pas de fichier test, mais service disponible)');
    } else {
      results.errors.push(`Storage: ${error.message}`);
      console.error('❌ Storage :', error.message);
    }
  }

  try {
    // Test Auth
    console.log('🔐 Test Auth...');
    if (auth && auth.app) {
      results.auth = true;
      console.log('✅ Auth : OK');
    } else {
      throw new Error('Auth non initialisé');
    }
  } catch (error) {
    results.errors.push(`Auth: ${error.message}`);
    console.error('❌ Auth :', error.message);
  }

  // Résumé
  const allWorking = results.firestore && results.storage && results.auth;
  console.log('📋 Résumé des tests :');
  console.log(`   Firestore: ${results.firestore ? '✅' : '❌'}`);
  console.log(`   Storage: ${results.storage ? '✅' : '❌'}`);
  console.log(`   Auth: ${results.auth ? '✅' : '❌'}`);
  
  if (allWorking) {
    console.log('🎉 Tous les services Firebase fonctionnent correctement !');
  } else {
    console.log('⚠️ Certains services Firebase ont des problèmes :');
    results.errors.forEach(error => console.log(`   - ${error}`));
  }

  return results;
}

// Fonction pour tester depuis la console du navigateur
window.testFirebase = testFirebaseConnection;
