import * as express from 'express';
import * as simulationService from '../services/simulation.service';

const router = express.Router();

router.get('/getSimulationResult', (req, res) => {
  simulationService.getSimulationResult(req, res);
});


export const urlRoutes = router;