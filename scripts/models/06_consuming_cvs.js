import http from 'k6/http';
import{ checks, sleep} from 'k6';

export const options = {
    stages: [
        { duration: '10s', target: 10 }
    ],
    treshoolds: {
        checks: ['rate > 0.95'],
        http_req_failed: ['rate < 0,01'],
        http_req_duration: ['p(95) < 500']
    }    
}





export default function(){
    const BASE_URL = 'https://cep.awesomeapi.com.br/';
    const res = http.get(BASE_URL);
}