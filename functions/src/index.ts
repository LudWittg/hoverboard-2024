// https://github.com/import-js/eslint-plugin-import/issues/1810
// eslint-disable-next-line import/no-unresolved
import { initializeApp } from 'firebase-admin/app';
import {
  scheduleWrite,
  sessionsWrite,
  speakersWrite,
} from './generate-sessions-speakers-schedule.js';
import { mailchimpSubscribe } from './mailchimp-subscribe.js';
import { sendGeneralNotification } from './notifications.js';
import { optimizeImages } from './optimize-images.js';
import { prerender } from './prerender.js';
import { scheduleNotifications } from './schedule-notifications.js';

// TODO: Update `tsconfig.json`
// - "noImplicitReturns": true,
// - "strict": true,

const firebaseConfig = {
  apiKey: 'AIzaSyAZnfT3Ct7J38vSdwfLpByd-fpOj9Oy8ew',
  authDomain: 'devfest-pisa-24-v2.firebaseapp.com',
  databaseURL: 'https://devfest-pisa-24-v2-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'devfest-pisa-24-v2',
  storageBucket: 'devfest-pisa-24-v2.appspot.com',
  messagingSenderId: '926979139472',
  appId: '1:926979139472:web:90d2017dc6e09286477515',
  measurementId: 'G-GXZBR1DJ7E',
};


initializeApp(firebaseConfig);

export {
  sendGeneralNotification,
  scheduleNotifications,
  optimizeImages,
  mailchimpSubscribe,
  prerender,
  scheduleWrite,
  sessionsWrite,
  speakersWrite,
};
