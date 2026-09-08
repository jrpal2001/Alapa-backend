import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { createLogger } from '@alapa/shared';
import localServiceAccount from '../../../alapa-32194-firebase-adminsdk-fbsvc-6d212cafae.js';

const logger = createLogger('video-service-signaling');

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
    logger.info(`🔥 Firebase Admin initialized for WebRTC Signaling (Project: ${serviceAccount.project_id})`);
  } else {
    logger.warn('⚠️ Firebase Service Account Key not found - Firestore WebRTC signaling in stub mode (REST API state active)');
  }
} catch (error) {
  logger.error(`❌ Firebase Signaling Initialization Error: ${error.message}`);
}

export const syncCallStateToFirestore = async (callId, callData) => {
  if (!firestoreDb) return;

  try {
    const callDocRef = firestoreDb.collection('calls').doc(callId.toString());
    await callDocRef.set(
      {
        id: callId.toString(),
        callerId: callData.callerId,
        receiverId: callData.receiverId,
        type: callData.type,
        status: callData.status,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
  } catch (error) {
    logger.error(`❌ Firestore Call Signaling Sync Error [Call ${callId}]: ${error.message}`);
  }
};
