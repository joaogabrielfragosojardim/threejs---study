"use client";
import React, { useCallback, useEffect, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { DRACOLoader, OrbitControls } from "three/examples/jsm/Addons.js";

const Home: React.FC = () => {
  const setupScene = (): {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
  } => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#d6d6d6");

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(-3, 2, 3);
    scene.add(camera);

    const ambientLight = new THREE.AmbientLight("#2e2e2e", 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight("#ffffff", 0.35);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);

    return { scene, camera };
  };

  const createHotPoints = (scene: THREE.Scene): void => {
    const hotPointGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const hotPointMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    const hotPoint1 = new THREE.Mesh(hotPointGeometry, hotPointMaterial);
    hotPoint1.position.set(-2.8, 1, 0);
    scene.add(hotPoint1);
  };

  const loadModel = (scene: THREE.Scene, loader: GLTFLoader): void => {
    loader.load(
      "/3D/batman_v_superman_batmobile.glb",
      (gltf) => {
        scene.add(gltf.scene);
        createHotPoints(scene);
      },
      undefined,
      (error) => {
        console.error(error);
      }
    );
  };

  const createRenderer = (): THREE.WebGLRenderer => {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    return renderer;
  };

  const setupControls = (
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
  ): OrbitControls => {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.5, 0);
    controls.update();
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.addEventListener("start", () => {
      console.log(0);
    });
    return controls;
  };

  const animate = useCallback(
    (
      controls: OrbitControls,
      scene: THREE.Scene,
      camera: THREE.PerspectiveCamera,
      renderer: THREE.WebGLRenderer
    ): void => {
      controls.update();
      requestAnimationFrame(() => animate(controls, scene, camera, renderer));
      renderer.render(scene, camera);
    },
    []
  );

  useEffect(() => {
    const { scene, camera } = setupScene();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("js/libs/draco/gltf/");
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loadModel(scene, loader);

    const renderer = createRenderer();
    const controls = setupControls(camera, renderer);

    animate(controls, scene, camera, renderer);
  }, [animate]);

  return <div></div>;
};

export default Home;
