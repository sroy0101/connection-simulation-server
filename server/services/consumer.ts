"use strict"
import {ConsumerSpec, randomDelay} from "./common";
import { Router } from "./router";


export class Consumer {
    consumerSpec: ConsumerSpec;
    router: Router; 
    isAbort: boolean;    
    connected: boolean;

    // metrics
    connectionAttempts: number;
    callbacksReceived: number;

    constructor (consumerSpec: ConsumerSpec, router: Router) {
        this.consumerSpec = consumerSpec;
        this.router = router;
        this.isAbort = false;        
        this.connected = false;

        this.connectionAttempts = 0; 
        this.callbacksReceived = 0;
    }

    /**
     * Start a connection. 
     * Requests a connection to an agent through the router. 
     * If unsuccessful, retry after a random time within 30 ms. 
     */
    startConnection = () => {
        this.isAbort = false;
        this.connectionAttempts = 0; 
        this.connected = this.router.connect(this.consumerSpec, this.messageCallBack);
        
        return this.connected;
    }
    
    /**
     * Receiver of calls from an agent in response
     * to message left for the agent.
     * Returns busy 80% of the time. 
     */
    messageCallBack = () : boolean => {
        let busy = false;
        this.callbacksReceived++;
        if(Math.random() * 100 < 80) {
            busy = true;
        }
        // if agent called back and was successful, means consumer is connected. 
        if(!busy) {
            this.connected = true; 
        }

        return busy;
    }

}