window.initState = function() {
    AFRAME.registerState({
        initialState: {
            userName: '',
            password: '',
        },
  
        handlers: {
          setUserName: function (state, { userName }) {
            state.userName = userName;
          },
          setPassword: function (state, { password }) {
            state.password = password;
          }
        },
    });
}

window.getState = () => AFRAME.scenes[0].systems.state.state;

window.getUserName = () => window.getState().userName;
window.hasUserName = () => !!window.getUserName();

window.getPassword = () => window.getState().password;
window.hasPassword = () => !!window.getPassword();