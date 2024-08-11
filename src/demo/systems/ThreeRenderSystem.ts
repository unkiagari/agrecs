import { BoxGeometry, Mesh, MeshBasicMaterial } from "three";
import { System } from "../../";
import ThreeRendererComponent from "../components/ThreeRendererComponent";

export default class ThreeRendererSystem extends System {
  constructor(ecs: any) {
    super(ecs)
  }

  initialize() {
    const trc = this.g.read(ThreeRendererComponent)
    trc.renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(trc.renderer.domElement)

    const boxGeo = new BoxGeometry()
    const boxMat = new MeshBasicMaterial({ color: 0x00ff00 })
    const boxMesh = new Mesh(boxGeo, boxMat)
    trc.scene.add(boxMesh)

    trc.camera.position.set(0, 5, 5)
    trc.camera.lookAt(0, 0, 0)
    trc.camera.aspect = window.innerWidth / window.innerHeight
    trc.camera.updateProjectionMatrix()
  }

  exec(delta: number, total: number) {
    const trc = this.g.read(ThreeRendererComponent)
    trc.renderer.render(trc.scene, trc.camera)
  }
}