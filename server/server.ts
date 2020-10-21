import express from 'express'
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { router } from './routes';

export function start () {
    const app = express();

    // Register all the middleware with express
    // parses JSON from the body to JSON object. 
    app.use(bodyParser.json());
    // Allow cross-origin requests. 
    // const corsOptions = {
    //     origin: ,
    //     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    // };
    app.use(cors());
    app.use(helmet());
    app.use(morgan('combined'));

    // Enable Pre-Flight for all routes. Allow cross-origin api calls. 
    app.options('*', cors());

    // configurations 
    const port = process.env.PORT || 3030;

    app.use('/api', router)

    app.get('/', (req, res) => {
        res.send(`Welcome to URL conversion.</br></br> Usage: ${req.protocol}://${req.hostname}?longUrl=http(s)://www.xyz.com`);
    });

    app.listen(port, () => {
        console.log(`listening on port ${port}...`);
    });

}


