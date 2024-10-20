import { System } from "../../../../src/index.ts"
import { c_angleSpeed, c_enemyBrainComponent, c_psr } from "../components/SimpleComponents.ts"

export class EnemyBrainSystem extends System {
  t = this.query({ all: [c_enemyBrainComponent, c_psr, c_angleSpeed] })
  exec(delta: number, total: number): void {
    this.t.match().forEach(et => {
      const type = et.read(c_enemyBrainComponent).type
      if (type === 0) {

      }
    })
  }
}