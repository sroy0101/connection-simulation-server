import * as faker from "faker";
import { Consumer } from "./consumer";
import { Agent } from "./agent";


/** *********************************************
 *              Common Types
 */

export interface ConsumerSpec {
    id: number;
    age: number;
    state: string;
    kids: number;
    cars: number;
    isRenting: boolean;
    income: number;
    phone: number;
}

export enum AcceptType {
    AGE,
    CARS,
    STATE,
    INCOME,
    RENTING
}
export interface Accept {
    type: AcceptType;
    value: string
}

export interface AgentSpec {
    id: number;
    accepts: Accept[];
}

export interface Message {
    phone: number,
    message: string,
    callBack: Function
}

const acceptTypes : AcceptType[] = [
    AcceptType.AGE, 
    AcceptType.CARS, 
    AcceptType.STATE,
    AcceptType.INCOME,
    AcceptType.RENTING
];

export interface ConsumerResult {
    connected: boolean;
    callBacksReceived: number;  
};
export interface AgentResult {
    callsReceived: number;
    messagesReceived: number;
};
export interface ResultResponse {
    consumerConnectedPercent: number,
    agentUtilizationPercent: number, 
    consumers: ConsumerResult[];
    agents: AgentResult[];
}


/** *********************************************
 *              Shared Functions
 */
/**
 * Provides a asynchronous random delay within the given low and high range. 
 * @param lowMs - the low value of the time range 
 * @param highMs - the high value of the time range. 
 */
export function randomDelay (lowMs: number, highMs: number) {
    let ms: number = Math.floor(Math.random() * (highMs - lowMs) + lowMs);
    return (
        new Promise((resolve) => {
            setTimeout(()=> {resolve();}, ms)
        })
    )
}

/**
 * Uses faker package to create an agent spec. 
 */
export function getRandomAgentSpec(): AgentSpec {
    let agentSpec: AgentSpec; 
    let accepts: Accept[] = [];

    // allow 2 accept types per agent (for now)
    let accept: Accept;
    for(let x=0; x < 2; x++) {
        // randomly select one of the 5 accept types (0 - 4)
        let randomType: number = Math.floor(Math.random() * (5));
        let acceptValue = getAgentSpecsValue(acceptTypes[randomType]);
        accept = {
            type: acceptTypes[randomType],
            value: acceptValue
        }
        accepts.push(accept);    
    }
    
    agentSpec = {id:0, accepts: accepts}
    return agentSpec; 
}

const getAgentSpecsValue= (type: AcceptType) : any => {
    let result : any;
    switch(type) {
        case AcceptType.AGE: 
        // age between 18 and 65
        result = Math.floor(Math.random() * (65 - 18 + 1) + 18);
        break; 
        case AcceptType.CARS: 
        // 0 - 3 cars
        result = Math.floor(Math.random() * 4);
        break; 
        case AcceptType.INCOME: 
        // 20000 - 1000000
        result = Math.floor(Math.random() * (1000000 - 20000) + 20000);
        break; 
        case AcceptType.STATE: 
        result = faker.address.state();
        break; 
        case AcceptType.RENTING: 
        result = faker.random.boolean();
        break; 
    }
    return result;
}

/**
 * Returns a fake consumer spec with random values. 
 */
export function getRandomConsumerSpec() : ConsumerSpec {
    let consumerSpec: ConsumerSpec = { 
        id: 0,
        phone: Math.floor(Math.random() * 10000000000),
        age: Math.floor(Math.random() * (65 - 18 + 1) + 18),
        cars: Math.floor(Math.random() * 4), // up to 3 cars
        income: Math.floor(Math.random() * (1000000 - 20000) + 20000),
        kids: Math.floor(Math.random() * 6), // up to 5 kids
        state: faker.address.state(),
        isRenting: faker.random.boolean()
    }
    return consumerSpec;
}