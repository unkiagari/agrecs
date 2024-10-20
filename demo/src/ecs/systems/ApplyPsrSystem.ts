import { System } from "../../../../src/index.ts"
import { c_psr, c_mesh } from "../components/SimpleComponents.ts"

export class ApplyPsrSystem extends System {
  t = this.query({ all: [c_psr, c_mesh] })
  exec(delta: number, total: number): void {
    const targets = this.t.match()
    // console.log("targets", targets)
    targets.forEach(et => {
      const psr = et.read(c_psr)
      const { mesh } = et.read(c_mesh)
      if (!mesh) return

      mesh.position.copy(psr.pos)
      mesh.rotation.set(psr.rot.x, psr.rot.y, psr.rot.z)
      mesh.scale.copy(psr.scale)
    })
  }
} 