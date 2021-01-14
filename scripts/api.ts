import { init, renderFloorPlan, renderReservationQue, run } from './engine';
import { setReservationData, setAuthorizationData, setResourceData, getFloorNames, getEnterpriseVisitIds } from './data';

const BASE_API_URL = 'https://develop.mews.li/api';

// TODO account switch
const enterpriseId = '1c8f20d2-1d30-4103-be57-8f3ed917aa2a'; // Payworks Terminal

const request = (url: string, requestData: { [key: string]: any }) => window.fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
        'Access-Control-Request-Headers': 'content-type',
        'Access-Control-Request-Method': 'POST'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer', 
    body: JSON.stringify({
        ...requestData,
        Application: 'Commander',
        Client: 'Mews Web Commander VR',
    })
})
.then(response => response.json());

export const signIn = event => {
    const loader = document.getElementById('loader');
    loader.style['display'] = 'flex';

    const formData = new FormData(event.target);

    const identifier = formData.get('identifier');
    const password = formData.get('password');

    const url = `${BASE_API_URL}/general/v1/users/signIn`;
    const requestData = {
        Extent: {
            Scopes: true,
            Chains: true,
            Enterprises: true,
            Subscriptions: true,
            Services: true,
            CustomLinks: true
        },
        Device: {'System': 'Web'},
        SetCookie: true,

        Identifier: identifier,
        Password: password,
    };

    return request(url, requestData)
        .then(response => {
            setAuthorizationData(response);

            init();
            run();

            return Promise.all([
                fetchReservationData(enterpriseId),
                fetchResources(enterpriseId),
            ]).then(() => {
                document.getElementById('content-2d').style['display'] = 'none';
                
                renderFloorPlan(getFloorNames());
                renderReservationQue();
            });
        })
        .finally(() => { loader.style['display'] = 'none'; });
}

const fetchResources = enterpriseId => {
    const url = `${BASE_API_URL}/commander/v1/resources/getAll`;

    const requestData = {
        EnterpriseId: enterpriseId,
        Extent: {
            ResourceCategories: true,
            ResourceCategoryAssignments: true,
            Resources: true,
        },
    };

    return request(url, requestData).then(responce => setResourceData(responce));
}

const fetchReservationData = enterpriseId => {
    const url = `${BASE_API_URL}/commander/v1/resourceUses/getAll`;
    
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const serviceIds = getEnterpriseVisitIds(enterpriseId);

    const requestData = {
        EnterpriseId: enterpriseId,
        // TODO use enterprise timezone
        CollidingUtc: {
            StartUtc: today.toISOString(),
            EndUtc: tomorrow.toISOString(),
        },
        Extent: {
            Customers: true,
            Reservations: true
        },
        State: 'Definite',
        ServiceIds: serviceIds,
    };

    return request(url, requestData).then(responce => setReservationData(responce));
}
