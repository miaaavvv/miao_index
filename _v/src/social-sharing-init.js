import { initSocialSharing } from './social-sharing.js?v=social-20261123';
// No SDK or signature requests are made until an authorized endpoint is configured.
initSocialSharing().catch(() => {});
