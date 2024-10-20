import ECS from "./ECS"

interface IComponentOptions<T> {
  global: boolean,
  onRelease: (v: T) => void
}
export interface IComponent<T = any> {
  id: number
  mask: bigint
  options: IComponentOptions<T>,

  make: (ecs: ECS) => T
  pool: T[]
}


function raw<T>(make: (ecs: ECS) => T, options: Partial<IComponentOptions<T>> = {
  global: false,
}) {
  return {
    id: 0,
    mask: 0n,
    changedMask: 0n,
    addedMask: 0n,
    removedMask: 0n,
    make,
    options: {
      global: false,
      onRelease: () => { },
      ...options,
    },
    pool: []
  } as IComponent<T>
}

export default {
  raw,
  tag: () => raw(() => ({})),
}