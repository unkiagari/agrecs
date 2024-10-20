const ENEMY = [
  { id: "zako", hp: 1, brain: 1, },
  { id: "zako_no_otomo", hp: 30, brain: 2 },
  { id: "boss", hp: 999, brain: 3 },
]

const ENEMY_GROUP = [
]

const TIME_LIME = [
  ...arr(10).map(i => ({ id: "zako", time: 5000 + 200 * i, pos: { x: -1, y: 0, z: 1 } })),
  ...arr(10).map(i => ({ id: "zako", time: 5000 + 200 * i, pos: { x: 1, y: 0, z: 1 } })),
].sort((a, b) => a.time - b.time)

function arr(len: number) {
  return Array.from({ length: len }).map((_, i) => i)
}
