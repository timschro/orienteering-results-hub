#!/usr/bin/env node

/**
 * Test script to verify multi-domain setup
 * Run with: node scripts/test-domains.js
 */

const http = require('http');

const domains = [
  'results.dm-ol.de',
  'results.hamburg-ol.de'
];

const port = process.env.PORT || 3000;
const host = 'localhost';

async function testDomain(domain) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: host,
      port: port,
      path: '/api/domain',
      method: 'GET',
      headers: {
        'Host': domain
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve({ domain, status: res.statusCode, data: response });
        } catch (e) {
          reject({ domain, error: 'Failed to parse JSON', data });
        }
      });
    });

    req.on('error', (err) => {
      reject({ domain, error: err.message });
    });

    req.end();
  });
}

async function runTests() {
  console.log('Testing multi-domain setup...\n');
  
  for (const domain of domains) {
    try {
      const result = await testDomain(domain);
      console.log(`✅ ${domain}:`);
      console.log(`   Status: ${result.status}`);
      console.log(`   Domain: ${result.data.domain}`);
      console.log(`   Name: ${result.data.config?.name}`);
      console.log(`   Competitions: ${result.data.config?.competitions?.length || 0}`);
      console.log('');
    } catch (error) {
      console.log(`❌ ${domain}: ${error.error || error.message}`);
      console.log('');
    }
  }
  
  console.log('Test completed!');
}

// Check if server is running
const checkServer = http.get(`http://${host}:${port}/api/domain`, (res) => {
  if (res.statusCode === 200) {
    runTests();
  } else {
    console.log(`❌ Server not responding correctly (status: ${res.statusCode})`);
    console.log('Make sure the development server is running with: npm run dev');
  }
}).on('error', (err) => {
  console.log(`❌ Cannot connect to server: ${err.message}`);
  console.log('Make sure the development server is running with: npm run dev');
}); 