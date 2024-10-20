import { InputRule } from "./ecs/components/InputManager.ts";

export const INPUT_RULE = [
  { id: "enter", kbd: "KeyE", mouse: "left" },
  { id: "cancel", kbd: "KeyQ", mouse: "right" },
  { id: "shot", mouse: "left" },
  { id: "bomb", mouse: "right" },
] as const satisfies InputRule<string>[]