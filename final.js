// こういう書き方をしたい最終系
import { ECS, schema } from "agrecs"

// vector3 from threejs,babylonjs,pixijs,etc...
class Vector3 {
  constructor(x, y, z) {
    this.x = x
    this.y = y
    this.z = z
  }
  set(x, y, z) {
    this.x = x
    this.y = y
    this.z = z
  }
  add(v) {
    this.x += v.x
    this.y += v.y
    this.z += v.z
  }
}

const ecs = new ECS()
const posComponent = schema.fn(() => new Vector3(0, 0, 0))
const rotComponent = schema.fn(() => new Vector3(0, 0, 0))
const materialComponent = schema.fn(() => { mat: null })

// ecsとしてはデータをuint32arrayなどのarraybufferで持ち、workerでマルチスレッド処理するのがあるべき姿。
// だが、実際の利用法としてはthreejsなどのライブラリが提供するVector3などを使いたい。しかし、javascriptはshared objectに対応していない（セキュリティ的な理由で今後の対応も期待できない）ので、クラスの配列は、workerに持っていくことができず、実質マルチスレッドによる高速化など不可能。
// なので極端なデータ指向による高速化は諦めて、書き易さに特化した実用的なものを目指す。

// arraybufferを止めればこんな書き方をする必要もなくなる
// const posComponent = schema.struct({
//   x: schema.uint32,
//   y: schema.uint32,
//   z: schema.uint32,
// })
// posComponent.x[entityIndex] = 1
// posComponent.y[entityIndex] = 2
// posComponent.z[entityIndex] = 3

ecs.setup({
  components: [posComponent, rotComponent],
  systems: [],
}).run()

const et = ecs.createEntity()
et
  .add(positionComponent)
const position = et.write(position)
position.x = 1
position.y = 2
position.z = 3

pipe(eid,
  ecs.getEntity,
  ecs.read(positionComponent),
)

ecs.read(eid, positionComponent)

