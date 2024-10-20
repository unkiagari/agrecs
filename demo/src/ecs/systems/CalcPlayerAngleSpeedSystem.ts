import { Raycaster, Vector3 } from "three"
import { System } from "../../../../src/index.ts"
import { c_angleSpeed, c_input, c_psr, c_three, tag_player } from "../components/SimpleComponents.ts"
export class CalcPlayerAngleSpeedSystem extends System {
  t = this.query({ all: [c_psr, c_angleSpeed, tag_player] })

  exec(delta: number, total: number): void {
    const { mpos3d } = this.g.read(c_input)

    // mpos3dの方向へ移動するように、angle,speed を更新する
    const targets = this.t.match()
    targets.forEach(et => {
      const psr = et.read(c_psr)
      const angleSpeed = et.read(c_angleSpeed)
      const angle = Math.atan2(mpos3d.z - psr.pos.z, mpos3d.x - psr.pos.x)
      angleSpeed.angle = angle

      const distance = new Vector3().subVectors(mpos3d, psr.pos).length()
      angleSpeed.speed = distance / 100
    })
  }
}
