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
  authDomain: 'devfest-pisa24.firebaseapp.com',
  databaseURL: 'https://devfest-pisa-24-v2-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'devfest-pisa24',
  storageBucket: 'devfest-pisa24.appspot.com',
  messagingSenderId: '926979139472',
  appId: '1:926979139472:web:baa04d68db000aa6477515',
  measurementId: 'G-81ZM9D8RDF',
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
