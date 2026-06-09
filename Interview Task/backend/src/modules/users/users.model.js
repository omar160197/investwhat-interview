// Users share the same MongoDB collection as Auth (both use the 'User' model).
// We re-export the model from auth to avoid re-registering the same model.
export { default } from '../auth/auth.model.js';
