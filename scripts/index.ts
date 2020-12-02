import { Engine, Scene, HemisphericLight, Vector3, Mesh } from '@babylonjs/core';

class VRApp {
  private _engine: Engine;
  private _scene: Scene;

  constructor() {
    const appDiv = <HTMLCanvasElement>document.getElementById('renderCanvas');
    this._engine = new Engine(appDiv, true);
    this._scene = new Scene(this._engine);

    let light1 = new HemisphericLight("light1", new Vector3(1, 1, 0), this._scene);
    let ground = Mesh.CreateGround("ground", 50, 50, 2, this._scene);

    for (let i = 0; i < 25; i++) {
      let box = Mesh.CreateBox(`box_${i}`, 2, this._scene);
      box.position = new Vector3(Math.random() * 50.0 - 25.0, 1, Math.random() * 50.0 - 25.0);
    }

    var vrHelper = this._scene.createDefaultVRExperience();
    // vrHelper.enableTeleportation();
  }

  run() {
    this._engine.runRenderLoop(() => {
      this._scene.render();
    });
  }
}

new VRApp().run();