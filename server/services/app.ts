import { Consumer } from "./consumer";
import { Router } from "./router";
import { Agent } from "./agent";
//import { Report } from "./report";
import { ConsumerSpec, AgentSpec, ConsumerResult, AgentResult, ResultResponse, getRandomAgentSpec, getRandomConsumerSpec, randomDelay } from "./common";

export async function startSimulation (requiredConsumers: number, requiredAgents: number): Promise<ResultResponse> {    
    let waitForConnectionsMin = 1; 
    const printDetails = false;
    const generateReport = true;

    console.log(`Starting simulation - Consumers : ${requiredConsumers}, Agents : ${requiredAgents}. Print Details : ${printDetails}. Generate Reports : ${generateReport} `);

    let router = Router.instance();

    // create agents with randomly generated agent spec 
    let agents: Agent[] = [];
    for(let x=0; x < requiredAgents; x++) {
        let agentSpec: AgentSpec = getRandomAgentSpec();
        agentSpec.id = x + 1;
        agents.push(new Agent(agentSpec, router));            
    }

    // create consumers with randomly generated consumer spec
    let consumers: Consumer[] = [];
    for(let x=0; x < requiredConsumers; x++) {
        let consumerSpec: ConsumerSpec = getRandomConsumerSpec();
        consumerSpec.id = x + 1;
        consumers.push(new Consumer(consumerSpec, router));            
    }

    console.log(`Initiating ${requiredConsumers} connections ....`);
    for( let consumer of consumers)  {
        // Add the delay below between start connections to prevent almost all the connections being done through the messaging and callback. 
        await randomDelay(5, 10).then (() => {
            consumer.startConnection();
        })
    }
    
    let timesRun = Math.floor(waitForConnectionsMin * 60 * 1000 / 10000);
    console.log(`waiting for up to ${waitForConnectionsMin} minutes, and checking every 10 secs to see if all consumers are connected ....`);
    
    let today = new Date();
    process.stdout.write(`started at - ${today.getHours()}:${today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes()}`);
    // start calls 
    return new Promise((resolve, reject) =>  {
        try {
            const interval = setInterval(function(){
                let allConnected = true;
                for(let x=0; x < consumers.length; x++) {
                    if(!consumers[x].connected) {
                        allConnected = false;
                        break;
                    }
                }
                if(timesRun-- === 0 || allConnected) {
                    let response:ResultResponse = getResultResponse(consumers, agents);
                    
                    today = new Date();
                    process.stdout.write(`Ended at - ${today.getHours()}:${today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes()}\n`);
                    
                    printResults(consumers, agents, printDetails);
                    clearInterval(interval);
                    resolve(response);  

                } else {
                    process.stdout.write(' . ');
                }
            }, 10000); 
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

function printResults (consumers: Consumer[], agents: Agent[], printDetails: boolean = true) {
    let totalConnected: number = 0;
    consumers.forEach(consumer => {
        if(consumer.connected) {
            totalConnected++;
        }
    });
    const connectedConsumersPercent = Math.floor(totalConnected * 100 / consumers.length); 

    let agentReceivedCallsTotal: number = 0;
    agents.forEach(agent => {
        if(agent.callsReceived) {
            agentReceivedCallsTotal++;
        }
    });
    const agentUtilization = Math.floor(agentReceivedCallsTotal * 100/agents.length);

    console.log(`Number of Consumers = ${consumers.length} ----------- Number of Agents = ${agents.length}`);
    console.log(`Consumers Connected = ${connectedConsumersPercent}%;  Agent Utilization = ${agentUtilization}%`);

    if(printDetails) {
        consumers.forEach(consumer => {            
            console.log(`consumer id = ${consumer.consumerSpec.id}; is Connected = ${consumer.connected}; Callbacks Received = ${consumer.callbacksReceived}; specs = ${JSON.stringify(consumer.consumerSpec)}`);
        });
        agents.forEach(agent => {
            console.log(`agent id = ${agent.agentSpec.id}; calls Received = ${agent.callsReceived}; messages Received = ${agent.messagesReceived}; accepts = ${JSON.stringify(agent.agentSpec.accepts)}; `)
        });
    }
}

function getResultResponse(consumers: Consumer[], agents: Agent[]): ResultResponse {
    let response: ResultResponse = {
        consumerConnectedPercent: 0,
        agentUtilizationPercent: 0,
        consumers: [],
        agents: []
    };
    
    let totalConnected = 0; 
    consumers.forEach(item => {
        let consumer:ConsumerResult = {connected: false, callBacksReceived: 0}
        consumer.callBacksReceived = item.callbacksReceived;
        consumer.connected = item.connected;
        response.consumers.push(consumer);
        if(consumer.connected) {
            totalConnected++;
        }
    });
    response.consumerConnectedPercent = Math.floor(totalConnected * 100 / consumers.length);

    let totalCallsReceived = 0
    agents.forEach(item=> {
        let agent:AgentResult = {messagesReceived: 0, callsReceived: 0}
        agent.callsReceived = item.callsReceived;
        agent.messagesReceived = item.messagesReceived;
        response.agents.push(agent);
        if(item.callsReceived) {
            totalCallsReceived++;
        }
    })
    response.agentUtilizationPercent= Math.floor(totalCallsReceived * 100/agents.length);

    return response;

}
