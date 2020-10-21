import "mocha";
import * as chai from "chai";

import { Consumer } from "../../server/services/consumer";
import {ConsumerSpec, AgentSpec, getRandomAgentSpec, getRandomConsumerSpec, randomDelay } from "../../server/services/common";
import { Router } from "../../server/services/router";
import { Agent } from "../../server/services/agent";

const expect = chai.expect;
let router = Router.instance();

describe('simulate connections between consumer and agents', () => {
    it('uses 1000 consumers and 20 agents', () => {
        
        const requiredConsumers = 1000;         
        const requiredAgents = 20; 
        const printDetails = false;
        const generateReport = true;

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

        // start calls 
        consumers.forEach(consumer => {
            consumer.startConnection();
        })
        setTimeout(() => {
            printResults(consumers, agents, printDetails);            
        }, 30000)        
    });

    function printResults (consumers: Consumer[], agents: Agent[], printDetails: boolean = true) {
        let totalConnected: number = 0;
        consumers.forEach(consumer => {
            if(consumer.connected) {
                totalConnected++;
            }
        });
        const connectedConsumersPercent = Math.floor(totalConnected * 100 / consumers.length) 
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
})