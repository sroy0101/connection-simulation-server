"use strict"
import { AcceptType, ConsumerSpec, Message } from "./common";
import { Agent } from "./agent";


export class Router {
    agentRegistry: Agent[] = [];

    // router has only one instance. 
    private static _instance: Router;     
    static instance() {
        return this._instance || (this._instance= new this());
    }

    /**
     * Finds a matching agent that can take the call and calls the agent from the agent registration table. 
     * @param consumerSpec - Contains the spec of the consumer trying to connect. 
     */
    connect = (consumerSpec: ConsumerSpec, messageCallBack: Function): boolean => {
        let result: boolean = false;
        let agent: Agent= this.selectAgentsForConsumer(consumerSpec);
        if(agent) {
            if(!agent.isBusy) {
                agent.connect();
                result = true;
            } else {
                let message: Message = {
                    phone: consumerSpec.phone,
                    message: 'please call me back.',
                    callBack: messageCallBack
                };
                agent.saveMessage(message);
            }
        }
        return result;
    }
    /**
     * Register agent 
     * @param  - contains the agent spec
     */
    registerAgent = (agent: Agent) => {
        this.agentRegistry.push(agent);
    }
    

    /**
     * Selects and agents who will accept a call from this consumer, based on a matching criteria. 
     * If multiple matching agents found, returns a randomly selected one.
     * @param consumerSpec - contains the consumer's properties. 
     */
    selectAgentsForConsumer = (consumerSpec: ConsumerSpec) : Agent => {
        let result: Agent[] = [];
        for(let agent of this.agentRegistry) {
            let agentSpec = agent.agentSpec;
            let gotMatch: boolean = false;
            for(let accept of agentSpec.accepts ) {
                // All acceptance spec must match. 
                switch (accept.type) {
                    case AcceptType.CARS:
                        if(consumerSpec.cars >= parseInt(accept.value)) {
                            gotMatch = true;
                        } else {
                            gotMatch = false;
                        }
                    break;
                    case AcceptType.AGE:
                        if(consumerSpec.age >= parseInt(accept.value)) {
                            gotMatch = true;
                        } else {
                            gotMatch = false;
                        }
                    break;
                    case AcceptType.INCOME:
                        if(consumerSpec.income >= parseInt(accept.value)) {
                            gotMatch = true;
                        } else {
                            gotMatch = false;
                        }
                    break;
                    case AcceptType.RENTING:
                        if(consumerSpec.isRenting === Boolean(accept.value)) {
                            gotMatch = true;
                        } else {
                            gotMatch = false;
                        }
                    break;
                    case AcceptType.STATE:
                        if(consumerSpec.state.toLowerCase() === accept.value.toLowerCase()) {
                            gotMatch = true;
                        } else {
                            gotMatch = false;
                        }
                    break;
                }
                if(!gotMatch) {
                    break;
                }
            }
            if(gotMatch) {
                result.push(agent);
            }
            
        }
        // If multiple agents found, pick one at random. 
        let selectIndex = Math.floor(Math.random() * result.length);
        return result[selectIndex];
    }

}




