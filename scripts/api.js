window.signIn = function() {
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

        Identifier: window.getUserName(),
        Password: window.getPassword(),
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
        .then(response => response.json())
        .catch(console.error)
        .then(data => console.log(data));
}
