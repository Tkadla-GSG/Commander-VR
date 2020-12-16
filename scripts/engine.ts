import { map } from 'lodash/fp';
import { EnvironmentHelper } from "@babylonjs/core/Helpers/environmentHelper";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Color3, Vector3 } from "@babylonjs/core/Maths/math";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Mesh } from "@babylonjs/core/Meshes/mesh";

// Side effect for mesh helpers mesh.createDefaultXXX
import "@babylonjs/core/Meshes/meshBuilder";
// Side effect for scene helpers scene.createDefaultXXX
import "@babylonjs/core/Helpers/sceneHelpers";
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';

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

	scene.createDefaultXRExperienceAsync({
		floorMeshes: [environment.ground]
	});
}

export const renderFloorPlan = floorNumbers => {
	let z = 1;
	map(number => {
		const box = MeshBuilder.CreateBox(`${number}`, { height: 0.75, width: 10, depth: 0.75 }, scene);
		box.position = new Vector3(5.0, z++, 5.0);
	}, floorNumbers);
}

export const run = () => {
	engine.runRenderLoop(() => {
		scene.render();
		logger.innerHTML = engine.getFps().toFixed() + " fps";
	});
}
