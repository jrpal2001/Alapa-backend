import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { createLogger } from '@alapa/shared';
import localServiceAccount from '../../../alapa-32194-firebase-adminsdk-fbsvc-6d212cafae.js';

const logger = createLogger('notification-service-fcm');

let fcmMessaging = null;

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
    fcmMessaging = admin.messaging();
    logger.info(`🔥 Firebase Admin FCM initialized successfully (Project: ${serviceAccount.project_id})`);
  } else {
    logger.warn('⚠️ Firebase Service Account Key not found - FCM push notifications in stub mode');
  }
} catch (error) {
  logger.error(`❌ Firebase Admin FCM Initialization Error: ${error.message}`);
}

export const sendPushNotification = async ({ tokens, title, body, data = {} }) => {
  if (!tokens || !tokens.length) {
    logger.info('ℹ️ No target FCM tokens provided - Skipping push notification');
    return { successCount: 0, failureCount: 0 };
  }

  if (!fcmMessaging) {
    logger.info(`[FCM Stub Mode] Push Notification to [${tokens.length}] device(s): Title: "${title}", Body: "${body}"`);
    return { successCount: tokens.length, failureCount: 0, stub: true };
  }

  try {
    const message = {
      notification: { title, body },
      data,
      tokens
    };

    const response = await fcmMessaging.sendEachForMulticast(message);
    logger.info(`✅ FCM Multicast Sent: ${response.successCount} succeeded, ${response.failureCount} failed`);
    return response;
  } catch (error) {
    logger.error(`❌ FCM Send Multicast Error: ${error.message}`);
    throw error;
  }
};
