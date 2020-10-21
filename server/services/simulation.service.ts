import { Request, Response } from 'express';
import { startSimulation } from './app';

/**
 * Returns simulation results for the given number of consumers and agents. 
 * Api: /api/getSimulationResult?consumers=100&agents=10
 * See response type in common.ts: ResultResponse. 
 */
export async function getSimulationResult (req: Request, res: Response) {
    const badRequest = `Error: missing url parameter(s). Usage example: ${req.protocol}://${req.host}/getSimulationResult?consumers=100&agents=20`;
    try {
        if(req.query) {
            if(!req.query.agents || !req.query.consumers)  {
                throw new Error(badRequest);
            }

            startSimulation(req.query.consumers, req.query.agents)
            .then (response => {
                res.send(response);
            }).catch(error =>  {
                res.send(error);
            });
            
        } else {
            throw new Error(badRequest);
        }
    } catch (error) {
        res.send(JSON.stringify([{ "Error": error }]));
    }
}


