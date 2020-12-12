import { init, run } from './engine';

export const signIn = event => {
    const loader = document.getElementById('loader');
    loader.style['display'] = 'flex';

    const formData = new FormData(event.target);

    const identifier = formData.get('identifier');
    const password = formData.get('password');

    const url = 'https://develop.mews.li/api/general/v1/users/signIn';
    const data = {
        Application: 'Commander',
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
        Client: 'Mews Web Commander VR',

        Identifier: identifier,
        Password: password,
    };

    return window.fetch(url, {
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
        body: JSON.stringify(data)
    })
        .then(response => {
            init();

            // render something based on response.json()

            run();

            document.getElementById('content-2d').style['display'] = 'none';
        })
        .finally(() => { loader.style['display'] = 'none'; });
}
