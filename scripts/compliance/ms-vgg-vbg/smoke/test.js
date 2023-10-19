import http from 'k6/http';

const BASE_URL = 'https://des-api-internal-pld.tihum.com';
const PATH_NEOWAY = '/bureau/persons/';
const DOC = '35536247875';
const fullURL = BASE_URL + PATH_NEOWAY + DOC;


export let options = {
    stages: [
        { duration: '5s', target: 10 },
        { duration: '5s', target: 10 }, 
        { duration: '5s', target: 0 }, 
    ],

    thresholds: {
        http_req_failed: ['rate < 0.01'],
        http_req_duration: ['p(95) < 250']
    },

    insecureSkipTLSVerify: true,
};

export function setup() {
    const URL_Login = 'https://userpool-internal-infraestruturanprod-shared.auth.sa-east-1.amazoncognito.com/oauth2/token';
    const authorizationHeader = 'Basic NTk0bTFvN29jYWQza3NiODdnYTBrcDNtcTk6MTQ4aDh2Mzd1M3NmOTIxbjA1bmY0YWQzcm5qY2lvdnRyc2JqYmwzMW0xZ2tuYWVqdXZzbQ==';

    const payload = {
        grant_type: 'client_credentials'
    };

    const params = {
        headers: {
            Authorization: authorizationHeader,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    const loginRes = http.post(URL_Login, payload, params);
    const token = loginRes.json('access_token');
    console.log('Token:', token);
    return token;

}

export default function (token) {
    let headers = {
        'Host': 'des-api-internal-pld.tihum.com',
        'Authorization': `Bearer ${token}` 
    };
    let response = http.get(fullURL, { headers: headers });

    if (response.status === 200) {
        console.log('Requisição bem-sucedida!');
    } else {
        console.error('Erro na requisição:', response.status);
    }
}

