import { Raycaster, Vector2 } from "three"
import { ECS, System } from "../../../../src/index.ts"
import { c_three, c_input } from "../components/SimpleComponents.ts"
export class InputSystem extends System {
  mpos = { x: 0, y: 0 }
  raycaster = new Raycaster

  exec(delta: number, total: number): void {
    this.g.read(c_input).mpos2d.set(this.mpos.x, this.mpos.y)

    const { plane, camera } = this.g.read(c_three)
    const cInput = this.g.read(c_input)
    cInput.updateMpos3d(this.raycaster, plane, camera)
    cInput.update(delta)
  }

  constructor(ecs: ECS) {
    super(ecs)
    window.addEventListener('mousemove', (e) => {
      this.mpos.x = e.clientX
      this.mpos.y = e.clientY
    })
  }
}