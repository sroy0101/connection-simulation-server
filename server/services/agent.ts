import { AgentSpec, Message, randomDelay } from "./common";
import { Router } from "./router";

export class Agent {

    agentSpec: AgentSpec;
    isBusy: boolean;
    router: Router; 
    messages: Message[];
    // metrics
    messagesReceived: number;
    callsReceived: number;
    
    constructor (agentSpec: AgentSpec, router: Router) {
        this.agentSpec = agentSpec;
        this.isBusy = false;
        this.router = router;
        // Register with router
        this.router.registerAgent(this);
        this.messages = []; 
        this.callConsumer();  
        this.messagesReceived = 0;
        this.callsReceived = 0;      
    }
    
    /**
     * Called to connect to agent. 
     * Sets itself to busy state - for a time period. 
     */
    connect = () : boolean => {
        let result = false;
        this.callsReceived++;
        if(!this.isBusy) {
            this.isBusy = true; 
            result = true;
            // Wait 50 to 300ms. 
            randomDelay(50, 300).then(() => {
                this.isBusy = false;            
            })
        }        
        return result;
    }

    /**
     * Saves a voice message for the agent to call at a later time. 
     * @param message - the message to be saved. 
     */
    saveMessage = (message : Message) => {
        this.messages.push(message);
        this.messagesReceived++;
    }

    /**
     * Checks every second and calls consumers in the message list. 
     * Then removes the message from the list if the call was successful. 
     */
    callConsumer = () => {
        const PROCESS_MESSAGES_RATE_MS = 1000;        
        const interval = setInterval(() => {
            this.isBusy = true;
            for(let x = 0; x < this.messages.length; x++) {
                let message : Message = this.messages[x]; 
                // if the consumer was not busy, ie accepted the call, remove the message from message list. 
                if(!message.callBack()) {
                    this.messages.splice(x, 1);
                }
            }
            this.isBusy = false;                    
        }, PROCESS_MESSAGES_RATE_MS);
        return interval;
    }    
}