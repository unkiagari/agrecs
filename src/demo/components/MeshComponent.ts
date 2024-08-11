import { BoxGeometry, Mesh, MeshBasicMaterial, OctahedronGeometry, SphereGeometry } from "three"
import Component from "../../Component"

type MeshKey = keyof typeof meshDb
const cache = {} as Record<MeshKey, Mesh[]>

const meshDb = {
  box: new Mesh(
    new BoxGeometry(1, 1, 1),
    new MeshBasicMaterial({ color: 0xff0000 })
  ),
  sphere: new Mesh(
    new SphereGeometry(1, 1, 1),
    new MeshBasicMaterial({ color: 0x00ff00 })
  ),
  octahedron: new Mesh(
    new OctahedronGeometry(1, 1),
    new MeshBasicMaterial({ color: 0x0000ff })
  )
}

class MeshComponent {
  key = "" as MeshKey
  mesh: Mesh = null as any
  init(key: MeshKey) {
    this.mesh = cache[key]?.pop() ?? meshDb[key].clone()
    this.key = key
  }
  onRelease() {
    cache[this.key] ??= []
    cache[this.key].push(this.mesh)
  }
}

export default Component.raw(() => new MeshComponent, {
  onRelease: (instance) => instance.onRelease()
})