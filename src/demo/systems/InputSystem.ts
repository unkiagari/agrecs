import { System } from "../../System";

export default class InputSystem extends System {
  initialize(): void {
    document.addEventListener('keydown', (e) => {
      console.log(e.key)
    })
  }
  exec(delta: number, total: number): void {

  }
}