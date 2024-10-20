import { ECS } from "../../src/index.ts"
import { c_mesh, c_angleSpeed, c_psr, c_three, c_input, tag_player } from "./ecs/components/SimpleComponents.ts"
import { ApplyPsrSystem } from "./ecs/systems/ApplyPsrSystem.ts"
import { CalcPlayerAngleSpeedSystem } from "./ecs/systems/CalcPlayerAngleSpeedSystem.ts"
import { CommonSystem } from "./ecs/systems/CommonSystem.ts"
import { InputSystem } from "./ecs/systems/InputSystem.ts"
import { MoveSystem } from "./ecs/systems/MoveSystem.ts"
import { ShotBulletSystem } from "./ecs/systems/ShotBulletSystem.ts"

export const ecs = new ECS()
ecs
  .registerComponent(c_input)
  .registerComponent(c_three)
  .registerComponent(c_psr)
  .registerComponent(c_angleSpeed)
  .registerComponent(c_mesh)
  .registerComponent(tag_player)
  .registerSystem(InputSystem)
  .registerSystem(CalcPlayerAngleSpeedSystem)
  .registerSystem(MoveSystem)
  .registerSystem(ApplyPsrSystem)
  .registerSystem(CommonSystem)
  .registerSystem(ShotBulletSystem)
  .setup()

ecs.run()


window["ecs"] = ecs
window["query"] = ecs.queryV2({ all: [c_psr] })