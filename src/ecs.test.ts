import { ECS, Component, System } from "."

class V3 {
  x: number
  y: number
  z: number
  constructor(x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z
  }
}
const Pos = Component.raw(() => new V3(0, 0, 0))
const UnusedComponent = Component.raw(() => { })

class PosXPlusOneSystem extends System {
  target = this.query({ all: [Pos] })
  exec(dt: number, tt: number) {
    this.target.match().forEach(et => {
      const pos = et.write(Pos)
      pos.x += 1
    })
  }
}

const ecs = new ECS()
ecs
  .registerComponent(Pos)
  .registerComponent(UnusedComponent)
  .registerSystem(PosXPlusOneSystem)
  .setup()
const et = ecs.createEntity()

describe("ecs", () => {
  it("コンポーネントの追加", () => {
    et.add(Pos)
    expect(et.read(Pos)).toBeInstanceOf(V3)
  })
  it("同じコンポーネントを二つ追加するとエラー", () => {
    expect(() => et.add(Pos)).toThrow()
  })
  it("値の書き込み", () => {
    const pos = et.write(Pos)
    pos.x = 1
    expect(pos.x).toBe(1)
  })
  it("システムの反映", () => {
    ecs.updateArchetypeOfPendingEntities()
    ecs.tick(1000 / 60)
    const pos = et.read(Pos)
    expect(pos.x).toBe(2)
  })
  it("システムの無効化と有効化", () => {
    const pos = et.read(Pos)
    expect(pos.x).toBe(2)

    ecs.getSystem(PosXPlusOneSystem)!.disabled = true
    ecs.tick(1000 / 60)
    expect(pos.x).toBe(2)

    ecs.getSystem(PosXPlusOneSystem)!.disabled = false
    ecs.tick(1000 / 60)
    expect(pos.x).toBe(3)
  })
  it("存在しないコンポーネントを読み込むとエラー", () => {
    expect(() => et.read(UnusedComponent)).toThrow()
  })
  it("コンポーネントの存在チェック", () => {
    ecs.updateArchetypeOfPendingEntities()
    expect(et.has(Pos)).toBe(true)
    expect(et.has(UnusedComponent)).toBe(false)
  })
  it("コンポーネントの削除", () => {
    expect(et.read(Pos)).toBeInstanceOf(V3)
    et.remove(Pos)
    expect(() => et.read(Pos)).toThrow()
  })

  it("コンポーネントの遅延削除", () => {
    et.add(Pos)
    et.remove(Pos, true)
    expect(et.read(Pos)).toBeInstanceOf(V3)

    ecs.tick(1000 / 60)
    expect(() => et.read(Pos)).toThrow()
  })

  it("エンティティの削除と再利用", () => {
    const et = ecs.createEntity()
    et.removeEntity()
    const et2 = ecs.createEntity()
    expect(et.index).toBe(et2.index)
  })
  it("エンティティ再利用時に古いIDは使用できなくなる", () => {
    const et = ecs.createEntity()
    const etIdx1 = et.index
    const etId1 = et.id
    const etGen1 = et.generaton
    et.removeEntity()
    const et2 = ecs.createEntity()
    const etIdx2 = et2.index
    const etId2 = et2.id
    const etGen2 = et2.generaton
    console.log("etid", etId1, etId2, etIdx1, etIdx2, etGen1, etGen2)
    expect(etIdx1).toBe(etIdx2)
    expect(etId1).not.toBe(etId2)
    expect(ecs.getEntity(etId1)).toBe(null)
    expect(ecs.getEntity(etId2)).toBe(et2)
  })


  it("グローバルエンティティの存在確認", () => {
    const globalEntity = ecs.globalEntity
    console.log("globalEntity", globalEntity)
    expect(globalEntity).not.toBe(null)
  })
  // it("シングルトンコンポーネントの読み込み", () => {
  //   const moveSystem = ecs.getSystem(MoveSystem)
  //   const hoge = moveSystem.g.read(C.GlobalComponent).hoge
  //   expect(hoge).toBe("hoge?")
  // })

  // query test
})