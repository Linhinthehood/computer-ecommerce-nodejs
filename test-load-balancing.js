const http = require('http');

const totalRequests = 30;
let completedRequests = 0;
const instanceCounts = {};

function makeRequest() {
    http.get('http://localhost:8080/instance-check', (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            try {
                const response = JSON.parse(data);
                const instanceId = response.instanceId;
                instanceCounts[instanceId] = (instanceCounts[instanceId] || 0) + 1;
            } catch (e) {
                console.error('Error parsing response:', e);
            }
            
            completedRequests++;
            if (completedRequests === totalRequests) {
                console.log('\nLoad balancing results:');
                console.log('----------------------');
                Object.keys(instanceCounts).forEach(instanceId => {
                    const count = instanceCounts[instanceId];
                    const percentage = ((count / totalRequests) * 100).toFixed(1);
                    console.log(`Instance ${instanceId}: ${count} requests (${percentage}%)`);
                });
            }
        });
    }).on('error', (err) => {
        console.error('Error making request:', err);
        completedRequests++;
    });
}

console.log(`Making ${totalRequests} requests to test load balancing...`);
for (let i = 0; i < totalRequests; i++) {
    setTimeout(makeRequest, i * 100); // Space out requests by 100ms
} 