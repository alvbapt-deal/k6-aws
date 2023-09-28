import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '10s', target: 100 },
        { duration: '1m', target: 100 }, 
        { duration: '10s', target: 0 }, 
    ],

    thresholds: {
        http_req_failed: ['rate < 0.01'],
        http_req_duration: ['p(95) < 250']
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
    check(res, {
        'status code 400': (r) => r.status === 400,
        'status code 401': (r) => r.status === 401,
        'status code 500': (r) => r.status === 500,
        'status code 501': (r) => r.status === 501,
        'status code 502': (r) => r.status === 502,
        'status code 503': (r) => r.status === 503,
        'status code 504': (r) => r.status === 504,                
    });
    const checkResult = check(res, {
        'status code 200': (r) => r.status === 200,
    });
    if (!checkResult) {
        console.error(`Erro na requisição: ${res.status}`);
    }
}