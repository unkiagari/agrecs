import { System } from "../../../../src/index.ts";
import { c_angleSpeed, c_mesh, c_psr } from "../components/SimpleComponents.ts";

export class MoveSystem extends System {
  t = this.query({ all: [c_psr, c_angleSpeed] })
  exec(delta: number, total: number): void {
    const targets = this.t.match()
    targets.forEach(et => {
      const psr = et.read(c_psr)
      const angleSpeed = et.read(c_angleSpeed)

      psr.pos.x += Math.cos(angleSpeed.angle) * angleSpeed.speed * delta
      psr.pos.z += Math.sin(angleSpeed.angle) * angleSpeed.speed * delta

      if (Math.abs(psr.pos.x) > 10 || Math.abs(psr.pos.z) > 10) {
        et.read(c_mesh).mesh?.removeFromParent()
        et.removeEntity(false)
      }
    })
  }
}