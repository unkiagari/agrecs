import { System } from "../../../../src/index.ts"
import { c_three } from "../components/SimpleComponents.ts"
export class CommonSystem extends System {
  exec(delta: number, total: number): void {
    const three = this.g.read(c_three)
    three.render()
  }
}