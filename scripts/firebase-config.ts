// https://github.com/import-js/eslint-plugin-import/issues/1810
// eslint-disable-next-line import/no-unresolved
import { cert, initializeApp, ServiceAccount } from 'firebase-admin/app';
// https://github.com/import-js/eslint-plugin-import/issues/1810
// eslint-disable-next-line import/no-unresolved
import { getFirestore } from 'firebase-admin/firestore';
//import serviceAccount from '../serviceAccount.json';

let serviceAccount = {
    "type": "service_account",
    "project_id": "test-project",
    "private_key_id": "fake-key-id",
    "private_key": "fake-key",
    "client_email": "fake@test-project.iam.gserviceaccount.com",
    "client_id": "123456789",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/test-project.iam.gserviceaccount.com"
};

const credential = cert(serviceAccount as ServiceAccount);
initializeApp({ credential });
const firestore = getFirestore();

export { firestore };
