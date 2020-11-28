window.initKeyboard = () => {
    AFRAME.registerComponent('on-input', {
        init: function(){
          this.el.addEventListener('superkeyboardinput', event => {
            if (window.hasUserName()) {
                AFRAME.scenes[0].emit('setUserName', { userName: event.value });
                // reset keyboard
                this.el.updateTextInput('');
            } else {
                AFRAME.scenes[0].emit('setPassword', { password: event.value });

                // reset keyboard
                this.el.dismiss();
                window.signIn()
                    .then(() => { /* remove keyboard */ })
                    .catch(() => {
                        // reset keyboard
                        AFRAME.scenes[0].emit('setUserName', { userName: null });
                        AFRAME.scenes[0].emit('setPassword', { password: null });
                    });
            }
          });
        }
    });
}
