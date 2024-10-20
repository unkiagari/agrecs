import { ecs } from "./ecs.ts";
import { c_psr } from "./ecs/components/SimpleComponents.ts";

class GameScene {
  start() { }
  placementPlayer() {
    const et = ecs.createEntity()
    const psr = et.add(c_psr)
    psr.pos.set(0, 0, 0)
  }
  createEnemyTimeline() { }
}