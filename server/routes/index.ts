import express from 'express';

const router = express.Router();

import { urlRoutes } from './url.routes';

router.use('/', urlRoutes);

export { router };