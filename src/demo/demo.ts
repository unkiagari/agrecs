import { ECS } from "../"
import Position from "./components/Position"
import ThreeRendererComponent from "./components/ThreeRendererComponent"
import ThreeRendererSystem from "./systems/ThreeRenderSystem"

const ecs = new ECS

ecs
  .registerComponent(Position)
  .registerComponent(ThreeRendererComponent)
  .registerSystem(ThreeRendererSystem)
  .setup()
  .run()