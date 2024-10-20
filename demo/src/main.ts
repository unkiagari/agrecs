import "./style.css"
import { ecs } from "./ecs.ts";
import { BoxGeometry, Mesh, MeshBasicMaterial } from "three";
import { c_angleSpeed, c_mesh, c_psr, c_three, tag_player } from "./ecs/components/SimpleComponents.ts";

console.log(ecs)

const et = ecs.createEntity()
const box = new Mesh(
  new BoxGeometry(.2, .2, .2),
  new MeshBasicMaterial({ color: 0x00ff00 })
)
const cMesh = et.add(c_mesh)
cMesh.mesh = box

et.add(c_psr)
et.add(c_angleSpeed)
et.add(tag_player)

ecs.globalEntity.read(c_three).scene.add(box)
