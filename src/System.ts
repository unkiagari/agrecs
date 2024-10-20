import ECS from "./ECS";
import Entity from "./entity";
import { Query } from "./QueryV2.ts";

export abstract class System {
  ecs: ECS
  g: Entity
  disabled = false;
  query(q: Query) {
    return this.ecs.queryV2(q)
  }
  constructor(ecs: ECS) {
    this.ecs = ecs
    this.g = ecs.globalEntity
  }

  /** called once when ecs.start */
  initialize() { }

  /** called when every ecs loop */
  async prepare() { }

  /** called when every ecs loop */
  abstract exec(delta: number, total: number): void
}
