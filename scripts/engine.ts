import { Color3, Engine, EnvironmentHelper, Scene, HemisphericLight, Vector3, Mesh, FreeCamera } from '@babylonjs/core';

let engine: Engine;
let scene: Scene;
let logger: HTMLElement;
let environment: EnvironmentHelper;

export const init = () => {
	const canvas = <HTMLCanvasElement>document.getElementById('renderCanvas');
	logger = <HTMLElement>document.getElementById("fps");
	engine = new Engine(canvas, true);
	scene = new Scene(engine);
	environment = scene.createDefaultEnvironment({
		skyboxSize: 50,
		groundSize: 50,
		enableGroundMirror: true,
		enableGroundShadow: true,
		groundColor: new Color3(1, 1, 1),
	});

	const light1 = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
    const camera = new FreeCamera("camera", new Vector3(0, 1.6, 0), scene);
    camera.setTarget(new Vector3(25, 0, 0));
    camera.attachControl(canvas, true);

    for (let i = 0; i < 25; i++) {
      const box = Mesh.CreateBox(`box_${i}`, 2, scene);
      box.position = new Vector3(Math.random() * 50.0 - 25.0, 1, Math.random() * 50.0 - 25.0);
    }

	scene.createDefaultXRExperienceAsync({
		floorMeshes: [environment.ground]
	});
}

export const run = () => {
	engine.runRenderLoop(() => {
		scene.render();
		logger.innerHTML = engine.getFps().toFixed() + " fps";
	});
}
