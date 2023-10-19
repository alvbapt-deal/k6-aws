import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options = {
    stages: [
        { duration: '10s', target: 100 },
        { duration: '10s', target: 100 }, 
        { duration: '10s', target: 0 }, 
    ],

    thresholds: {
        http_req_failed: ['rate < 0.01'],
        http_req_duration: ['p(95) < 250']
    },
    ext: {
        loadimpact: {
        projectID: 3659396,
        name: 'qa chapter'
        }
    }
}

const BASE_URL = 'https://test-api.k6.io';

export function setup(){
    const loginRes = http.post(`${BASE_URL}/auth/token/login/`, {
        username: '0.5577608357004727@mail.com',
        password: 'user123'
    });
    const token = loginRes.json('access');
    console.log(token)
    return token;
}


export default function(token){
    
    const params = {
        headers: {
            Authorization: `Bearer ${token}` ,
            'Content-Type': 'application/json',
        }
    }
    const res = http.get(`${BASE_URL}/my/crocodiles`, params);

    const checkResult = check(res, {
        'status code 200': (r) => r.status === 200,
    });
    if (!checkResult) {
        console.error(`Erro na requisição: ${res.status}`);
    }
}



export function handleSummary(data) {
  return {
    "result.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}