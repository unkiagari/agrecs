export default class Mask {
  value = 0n

  add(mask: bigint) {
    this.value |= mask
  }
  remove(mask: bigint) {
    this.value &= ~mask
  }

  /** 全て含む */
  has(mask: bigint) {
    return (this.value & mask) === mask
  }

  /** いずれかを含む */
  hasAny(mask: bigint) {
    return (this.value & mask) !== 0n
  }

  /** 全て含まない */
  not(mask: bigint) {
    return (this.value & mask) === 0n
  }

  /** いずれかを含まない */
  notAny(mask: bigint) {
    return (this.value & mask) !== mask
  }

  clear() {
    this.value = 0n
  }
}

// declare const __brand: unique symbol
// type BrandType<B> = { [__brand]: B }
// export type BrandedType<T, B> = T & BrandType<B>
// export type MaskType = BrandedType<bigint, 'MaskType'>

export const MaskF = {
  add(mask: bigint, mask2: bigint) { return mask | mask2 },
  remove(mask: bigint, mask2: bigint) { return mask & ~mask2 },
  all(mask: bigint, mask2: bigint) { return (mask & mask2) === mask2 },
  any(mask: bigint, mask2: bigint) { return (mask & mask2) !== 0n },
  not(mask: bigint, mask2: bigint) { return (mask & mask2) === 0n },
  notAny(mask: bigint, mask2: bigint) { return (mask & mask2) !== mask2 },
}