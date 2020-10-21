# Connection-Simulation-Server

A nodejs/express server application to simulate the connections of thousands of consumers trying to connect to a pool of agents and collect various  metrics about the process. 

### Rules 
The following rules apply:
1) Each consumer has a set of attributes: age, state, number of kids, number of cars, income, rent or own, and household income. 
2) Each agent can only accept calls from certain type of consumers, such as age above 60, or living in certain state. etc. 
3) Consumers can call a number that routes to a randomly selected agent who can accept the consumer type. If the call to the agent was successful, the consumer is considered to be connected. 
4) An agent can be busy after receiving a call, when it cannot receive another call. 
5) If the agent is busy, then a call is automatically routed to a voice mailbox for the agent. 
6) Agent can call the consumers who left messages. When the consumer successfully receives the call back from the agent, the consumer is considered to be connected. 
7) If the callback to the consumer was unsuccessful, the agent will retry. 

### API
Currently supports one api, api/getSimulationResults?consumers=[number of consumers]&agents=[number of agents]. For example, api/getSimulationResults?consumers=100&agents=10.

#### Current Limitation - maximum run time is set to 1 minute. This restriction will be removed after simulation progress monitoring api is implemented. 

### How to Use
1. Clone this application to your local folder. 
2. Install: 
> npm install
3. Run the app: 
> npm run start 

#### Note
The run will end when all the consumers are connected, even if the end of run time is not reached.
It may also end when the maximum simulation time is reached. 
Also, the run will end at the end of run time even if there are consumers not connected. 

### Tests 
Both unit and e2e tests are provided. 
1. To run the unit tests for the consumer, router and agent classes: 
> npm run test
2. To run the e2e test: 
> npm run test-e2e

## Program Description
1) This app consists of 4 main classes - Consumer, Agent, Router and Report
2) Consumer - For every instantiation, generates a set of attributes with random valid values. Waits for the startConnection() method to be called by the external orchestrator (the app), and call the router's connect() method. The consumer doesn't know about the agents and cannot call an agent directly. Provides messageCallBack() method, available 80% of the time, for calling by the agent when agents process received messages. 
3) Router - Router is a singleton object. Consumer calls its connect() method to connect to an agent. When called, it randomly selects an agent from a list of matching agents in the locally kept agent registry, and calls the connect method of the agent. If the agent doesn't accept the call (because it's busy) it sends a message to the agent by calling the agent's saveMessage() method. 
4) Agent - For every instantiation, generates a set of (currently 2) call acceptance specs with random valid values, and registers itself with the router. Its connect() method is called by the router. After every calls received, the agent remains in busy state (50 to 300 ms) and therefore doesn't receive any calls. Every 500ms, the agent processes the received messages list and calls the consumers related to the messages directly. It removes the message from the message list if the call was successful (note - the consumer is available only 20% of the time). 
5) Report - The report class provides the methods to create and store the reports as described under the Data Collected section. 

The simulation is initiated and orchestrated by the app module. 

## Sequence Diagram

![sequence-diagram](https://raw.githubusercontent.com/sroy0101/connection-simulation/master/images/sequence-diagram.png)


## Dependencies 
This app depends on the following npm packages: 
2. faker@^5.0.2 - for creating fake data. 

There are a number of dev dependencies. Please see package.json. 
 
