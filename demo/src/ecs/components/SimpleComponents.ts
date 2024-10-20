import { Mesh, Vector3 } from "three"
import { Component } from "../../../../src/index.ts"
import { ThreeWrap } from "./Three.ts"
import { InputManager } from "./InputManager.ts"
import { INPUT_RULE } from "../../define.ts"

/** position,scale,rotate */
export const c_psr = Component.raw(() => ({
  pos: new Vector3,
  scale: new Vector3(1, 1, 1),
  rot: new Vector3,
}))

export const c_angleSpeed = Component.raw(() => ({
  angle: 0,
  speed: 0,
}))

export const c_mesh = Component.raw(() => ({
  mesh: null as null | Mesh
}))

export const c_globalState = Component.raw(() => ({

}), {
  global: true
})

export const c_three = Component.raw(() => new ThreeWrap, { global: true })

export const c_input = Component.raw(() => new InputManager(INPUT_RULE), { global: true })

export const c_autoRotate = Component.raw(() => ({ speed: 1 }))

export const c_enemyBrainComponent = Component.raw(() => ({ type: 0 }))

export const tag_player = Component.tag()
export const tag_enemy = Component.tag()
export const tag_bullet = Component.tag()
