import { BoxGeometry, Mesh, MeshBasicMaterial, MeshNormalMaterial, PerspectiveCamera, Plane, PlaneGeometry, Scene, Vector3, WebGLRenderer } from "three";

export class ThreeWrap {
  renderer = new WebGLRenderer()
  scene = new Scene
  camera = new PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);

  plane = new Plane(new Vector3(0, 1, 0), 0)

  cube = new Mesh(new BoxGeometry(1, 1, 1), new MeshNormalMaterial())

  constructor() {
    this.renderer.setClearColor(0x3333ff);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshNormalMaterial();
    const cube = this.cube
    cube.scale.multiplyScalar(0.2)
    this.scene.add(cube);

    this.camera.position.x = 0
    this.camera.position.y = 5
    this.camera.position.z = 5;
    this.camera.lookAt(0, 0, 0);

    document.getElementById("app")?.appendChild(this.renderer.domElement);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
