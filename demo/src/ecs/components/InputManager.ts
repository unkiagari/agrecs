import { Camera, Plane, Raycaster, Vector2, Vector3 } from "three";

export interface InputRule<Ids extends string> {
  id: Ids,
  kbd?: string
  pad?: number
  mouse?: "left" | "right"
}

export class InputManager<Id extends string> {
  mpos2d = new Vector2
  mpos2dNormalized = new Vector2
  mpos3d = new Vector3

  #kbd = new Map<string, boolean>()
  #mouse = new Map<string, boolean>()
  states = [] as { down: boolean, up: boolean, pressing: boolean, frame: number, disableUntilUp: boolean }[]

  gamepadIndex = -1

  updateMpos3d(raycaster: Raycaster, plane: Plane, camera: Camera) {
    raycaster.setFromCamera(this.mpos2dNormalized, camera)
    raycaster.ray.intersectPlane(plane, this.mpos3d)
  }

  constructor(private rules: InputRule<Id>[]) {
    this.states = rules.map(() => ({
      down: false,
      up: false,
      pressing: false,
      frame: 0,
      disableUntilUp: false
    }))
    window.addEventListener('mousemove', (e) => {
      this.mpos2d.x = e.clientX
      this.mpos2d.y = e.clientY

      // -1~1の範囲に正規化
      this.mpos2dNormalized.x = (this.mpos2d.x / window.innerWidth) * 2 - 1
      this.mpos2dNormalized.y = -(this.mpos2d.y / window.innerHeight) * 2 + 1
    })
    window.addEventListener("keydown", (e) => this.#kbd.set(e.code, true))
    window.addEventListener("keyup", (e) => this.#kbd.set(e.code, false))

    const setMouseState = (num: number, isDown: boolean) => {
      let id = ""
      if (num === 0) id = "left"
      else if (num === 1) id = "middle"
      else if (num === 2) id = "right"
      else return
      this.#mouse.set(id, isDown)
    }
    window.addEventListener("mousedown", (e) => setMouseState(e.button, true))
    window.addEventListener("mouseup", (e) => setMouseState(e.button, false))

    window.addEventListener("gamepadconnected", e => {
      if (this.gamepadIndex === -1) {
        this.gamepadIndex = e.gamepad.index
        // this.gamepadVendorId = e.gamepad.id.match(/Vendor: ([a-z0-9]{4})/)![1]
      }
    })
    window.addEventListener("gamepaddisconnected", e => {
      if (this.gamepadIndex === e.gamepad.index) {
        this.gamepadIndex = -1
      }
    })
  }

  disableTimer = 0
  #waitInputsResolveStack = [] as { ids: Id[], resolve: (id: Id) => void }[]

  #down(index: number) {
    if (index === -1) return
    const state = this.states[index]
    if (!state.pressing) {
      state.down = true
      state.pressing = true
      state.up = false
      state.frame = 0
    }
  }
  #up(index: number) {
    if (index === -1) return
    const state = this.states[index]
    state.down = false
    state.pressing = false
    state.up = true
    state.frame = 0
    state.disableUntilUp = false
  }

  update(dt: number) {
    this.disableTimer -= dt
    for (let i = this.#waitInputsResolveStack.length - 1; i >= 0; i--) {
      const t = this.#waitInputsResolveStack[i]
      const id = t.ids.find(v => this.isDown(v))
      if (id !== undefined) {
        t.resolve(id)
        this.#waitInputsResolveStack.splice(i, 1)
        break
      }
    }

    this.rules.forEach((rule, i) => {
      const state = this.states[i]
      state.down = false
      state.up = false
      state.frame += dt

      if ((rule.kbd && this.#kbd.get(rule.kbd))
        || (rule.mouse && this.#mouse.get(rule.mouse))) {
        this.#down(i)
      } else {
        this.#up(i)
      }
    })
  }

  isDown(id: Id) {
    const i = this.rules.findIndex(v => v.id === id)
    if (i === -1) return false
    return this.states[i].down
  }
  isPressing(id: Id) {
    const i = this.rules.findIndex(v => v.id === id)
    if (i === -1) return false
    return this.states[i].pressing
  }
  isUp(id: Id) {
    const i = this.rules.findIndex(v => v.id === id)
    if (i === -1) return false
    return this.states[i].up
  }
}
