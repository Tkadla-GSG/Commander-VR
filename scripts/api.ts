export const signIn = ({ identifier, password }) => {
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
        .then(response => response.json());
}
