import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { createLogger } from '@alapa/shared';
import localServiceAccount from '../../../alapa-32194-firebase-adminsdk-fbsvc-6d212cafae.js';

const logger = createLogger('chat-service-firebase');

let firestoreDb = null;

const getServiceAccount = () => {
  try {
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      return {
        type: 'service_account',
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL
      };
    }
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY.trim();
      if (raw.startsWith('{')) return JSON.parse(raw);
      if (fs.existsSync(raw)) return JSON.parse(fs.readFileSync(raw, 'utf8'));
    }
    if (localServiceAccount && localServiceAccount.project_id) {
      return localServiceAccount;
    }
  } catch (err) {
    logger.error(`Error reading Firebase service account key: ${err.message}`);
  }
  return null;
};

try {
  const serviceAccount = getServiceAccount();
  if (serviceAccount) {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }
    firestoreDb = admin.firestore();
    logger.info(`🔥 Firebase Admin SDK initialized for Firestore Realtime Projections (Project: ${serviceAccount.project_id})`);
  } else {
    logger.warn('⚠️ Firebase Service Account Key not found - Firestore realtime sync disabled (MongoDB durable storage active)');
  }
} catch (error) {
  logger.error(`❌ Firebase Admin Initialization Error: ${error.message}`);
}

export const syncMessageToFirestore = async (conversationId, message) => {
  if (!firestoreDb) return;

  try {
    const messageDocRef = firestoreDb
      .collection('conversations')
      .doc(conversationId.toString())
      .collection('messages')
      .doc(message._id.toString());

    await messageDocRef.set({
      id: message._id.toString(),
      conversationId: conversationId.toString(),
      senderId: message.senderId,
      type: message.type,
      text: message.text,
      mediaUrl: message.mediaUrl,
      status: message.status,
      createdAt: message.createdAt.toISOString()
    });

    // Update conversation realtime metadata doc
    await firestoreDb.collection('conversations').doc(conversationId.toString()).set(
      {
        lastMessage: {
          text: message.text,
          senderId: message.senderId,
          type: message.type,
          createdAt: message.createdAt.toISOString()
        },
        lastMessageAt: message.createdAt.toISOString()
      },
      { merge: true }
    );
  } catch (error) {
    logger.error(`❌ Firestore Sync Error for Message ${message._id}: ${error.message}`);
  }
};
