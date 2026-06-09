import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import * as topicsController from './topics.controller.js';

const router = Router();

router.post('/suggest-stocks', protect, topicsController.suggestStocks);
router.get('/',                         topicsController.getAll);
const VALID_TYPES = new Set(['sectors', 'stocks', 'themes']);
router.get('/:type', (req, res, next) => {
  if (!VALID_TYPES.has(req.params.type)) return next();
  req.params.type = req.params.type.slice(0, -1); // sectors → sector
  next();
}, topicsController.getByType);
router.get('/sectors/:slug/stocks',     topicsController.getRelatedStocks);
router.get('/stocks/:slug/themes',      topicsController.getRelatedThemes);

export default router;
