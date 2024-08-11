import { AmbientLight, DirectionalLight, HemisphereLight, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import Component from "../../Component";

const canvas = document.createElement('canvas')
export default Component.raw(() => ({
  canvas,
  renderer: new WebGLRenderer({ canvas }),
  scene: new Scene(),
  camera: new PerspectiveCamera(75, 1, 0.1, 1000),
  light: {
    ambient: new AmbientLight(0xffffff, 0.5),
    directional: new DirectionalLight(0xffffff, 0.5),
    hemisphere: new HemisphereLight(0xffffff, 0.5),
  },
}), { global: true })