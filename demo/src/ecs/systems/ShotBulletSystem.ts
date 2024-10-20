import { Mesh, MeshBasicMaterial, SphereGeometry } from "three";
import { System } from "../../../../src/index.ts";
import { c_angleSpeed, c_input, c_mesh, c_psr, c_three, tag_bullet, tag_player } from "../components/SimpleComponents.ts";

export class ShotBulletSystem extends System {
  player = this.query({ all: [tag_player] })
  exec(delta: number, total: number): void {
    const im = this.g.read(c_input)

    if (im.isPressing("shot")) {
      const playerPos = this.player.match().at(0)?.read(c_psr).pos
      if (!playerPos) return

      const et = this.ecs.createEntity()
      et.add(tag_bullet)

      const bulletMesh = new Mesh(
        new SphereGeometry(.1),
        new MeshBasicMaterial({ color: 0xff0000 })
      )
      const cThree = this.g.read(c_three)
      cThree.scene.add(bulletMesh)

      const cMesh = et.add(c_mesh)
      cMesh.mesh = bulletMesh

      const cPSR = et.add(c_psr)
      cPSR.pos.copy(playerPos)

      const angleSpeed = et.add(c_angleSpeed)
      angleSpeed.angle = Math.PI / 180 * 270
      angleSpeed.speed = .01
    }
  }
}