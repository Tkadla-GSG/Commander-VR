import { Engine, EnvironmentHelper, Scene, HemisphericLight, Vector3, Mesh, FreeCamera } from '@babylonjs/core';
import { InputPassword, InputText, VirtualKeyboard, StackPanel, Control, AdvancedDynamicTexture } from '@babylonjs/gui';

class VRApp {
  private _engine: Engine;
  private _scene: Scene;
  private _logger: HTMLElement;
  private _environment: EnvironmentHelper;

  constructor() {
    const canvas = <HTMLCanvasElement>document.getElementById('renderCanvas');
    this._logger = <HTMLElement>document.getElementById("fps");
    this._engine = new Engine(canvas, true);
    this._scene = new Scene(this._engine);
    this._environment = this._scene.createDefaultEnvironment({
        skyboxSize: 50,
        groundSize: 50,
        enableGroundMirror: true,
    });

    const light1 = new HemisphericLight("light1", new Vector3(1, 1, 0), this._scene);
    const camera = new FreeCamera("camera", new Vector3(0, 1.6, 0), this._scene);
    camera.setTarget(new Vector3(25, 0, 0));
    camera.attachControl(canvas, true);

    // GUI
    /*
    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
    const panel = new StackPanel();
    
    const userNameField = new InputText();
    userNameField.width = 0.2;
    userNameField.maxWidth = 0.2;
    userNameField.height = "40px";
    userNameField.text = "sample-admin";
    userNameField.color = "white";
    userNameField.background = "green";

    panel.addControl(userNameField);

    const passwordFiled = new InputPassword();
    passwordFiled.width = 0.2;
    passwordFiled.maxWidth = 0.2;
    passwordFiled.height = "40px";
    passwordFiled.text = "sample";
    passwordFiled.color = "white";
    passwordFiled.background = "green";

    panel.addControl(passwordFiled);

    var keyboard = VirtualKeyboard.CreateDefaultLayout();
    keyboard.connect(userNameField);

    panel.addControl(keyboard);

    advancedTexture.addControl(panel);
*/
    for (let i = 0; i < 25; i++) {
      const box = Mesh.CreateBox(`box_${i}`, 2, this._scene);
      box.position = new Vector3(Math.random() * 50.0 - 25.0, 1, Math.random() * 50.0 - 25.0);
    }

   this._scene.createDefaultXRExperienceAsync({
    floorMeshes: [this._environment.ground]
   });
  }

  run() {
    this._engine.runRenderLoop(() => {
      this._scene.render();
      this._logger.innerHTML = this._engine.getFps().toFixed() + " fps";
    });
  }
}

new VRApp().run();