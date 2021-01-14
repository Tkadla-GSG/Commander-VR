import { map, each, times, identity } from 'lodash/fp';
import { EnvironmentHelper } from "@babylonjs/core/Helpers/environmentHelper";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Color3, Vector3 } from "@babylonjs/core/Maths/math";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { getArrivingReservationIds, getDepartingReservationIds, getReservationAdultCount, getReservationChildCount } from './data';

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

export const renderReservationQue = () => {
	const sortedArrivalReservationIds = getArrivingReservationIds();
	const sortedDepartureReservationIds = getDepartingReservationIds();

	renderQue(sortedArrivalReservationIds, new Vector3(1.0, 0.5, 1.0));
	// TODO renderQue(sortedDepartureReservationIds, new Vector3(1.0, 0.5, 1.0), -1);
}

const renderQue = (reservationIds, position: Vector3, direction = 1) => {
	let x = 1;
	each(id => {
		renderReservation(id, position.clone().add(new Vector3(x + (direction * 0.5), 0, 0)));
		x++;
	}, reservationIds);
}

const renderReservation = (id, position: Vector3) => {
	const adultCount = getReservationAdultCount(id);
	const childCount = getReservationChildCount(id);

	let y = 1;
	each(child => {
		console.log({ child });
		const box = MeshBuilder.CreateBox(`child-${child}`, { height: 0.4, width: 0.4, depth: 0.4 }, scene);
		box.position = position.clone().add(new Vector3(0, 0, y + 0.5));
		y++;
	}, times(identity, childCount));

	each(adult => {
		console.log({ adult });
		const box = MeshBuilder.CreateBox(`adult-${adult}`, { height: 0.75, width: 0.75, depth: 0.75 }, scene);
		box.position = position.clone().add(new Vector3(0, 0, y + 0.5));
		y++;
	}, times(identity, adultCount));
}

export const run = () => {
	engine.runRenderLoop(() => {
		scene.render();
		logger.innerHTML = engine.getFps().toFixed() + " fps";
	});
}
