# Breakout — Development Instructions

## Overview

Simple arcade Breakout game. Files split by responsibility for maintainability:

- `ui.js` — DOM creation & rendering helpers
- `physics.js` — ball & collision physics
- `game.js` — high-level game logic and state
- `assets/` — images, icons, and sfx (brick-hit, paddle-hit, win, lose, powerup)

## Game States

Define and use: `LOBBY`, `COUNTDOWN`, `PLAYING`, `PAUSED`, `WIN`, `LOSE`. `esc` opens `settings` and toggles `PAUSED`.

## UI / UX Requirements

- Implement Landing with game name and **Start** button.
- Implement user popups:
  - **Controls select**: two clickable divs with icons:
    - `.mouse-option`
    - `.keyboard-option`
    - Supported keys: `ArrowLeft`, `ArrowRight`, `A`, `D` (both left/right should work). Store choice in `controls`.
  - **Level select**: `level-container` holds `.level-option` divs: `.easy`, `.medium`, `.hard`. Store selection in `level`.
  - Settings popup (gear icon or `esc`) shows current `sound`, `level`, `controls`. Changing settings updates `localStorage`.
- Container and main DOM structure:
  - `.container` (root)
    - `.header` — left: `score` + `topScore` (persist in `localStorage`), right: attempts icons (start at 3)
    - `.brick-container` (holds `.bricks-container`)
    - Center overlay for countdown (3,2,1)
    - `.paddle-container` (full width)
      - `.paddle`
    - `.ball`

## Controls Behavior

- Mouse: paddle follows mouse X inside `.paddle-container`. Optionally support drag.
- Keyboard: `ArrowLeft` / `ArrowRight` / `A` / `D` move paddle.
- Ball stuck to paddle until `Space` to launch (on start or after lose).
- Clicking `Start` or hitting `Space` starts `COUNTDOWN` then `PLAYING`.

## Brick generation (in `ui.js`)

- Implement `createBrickLayout(level)` that returns a 2D boolean grid:
  - `easy` → 2 × 10
  - `medium` → 4 × 10
  - `hard` → 6 × 10
  - `insane` → 10 × 10 (bonus mode)
- Use **horizontal symmetry**:
  - Randomly fill half of each row, mirror horizontally to complete row.
  - Enforce min/max fill ratio (60%–85% by default). If outside range, re-generate.
- Optionally support seeded generation for reproducible results (useful for tests).

Example output:

```jsx
;[
  [true, false, false, true],
  [true, true, false, true],
  [false, true, true, false],
]
```

- Implement `renderBrickContainer(bricksArray)` in `ui.js`:
  - Builds DOM nodes under `.bricks-container` with class names e.g. `.brick` and data attributes (`data-row`, `data-col`).
  - Attach attribute/class for powered-up bricks (e.g. `.brick--powered`).

## Physics (in `physics.js`)

- Implement `updateBall(deltaTime, state)` and `checkCollisions(state)`:
  - Paddle collision adjusts angle depending on hit offset (center→vertical, edges→steeper angle).
  - Brick collisions: detect side or corner and reflect velocity accordingly.
  - Prevent ball from getting stuck in a perfect vertical loop (apply tiny random nudge after N frames).
- Use `requestAnimationFrame` loop for updates and rendering (single loop recommended).

## Game Logic (in `game.js`)

- Implement `ballDestroy(brick)`:
  - Remove brick from DOM and grid, update score (e.g. +10), play sound, spawn power-up with chance.
  - Check if all bricks destroyed ⇒ call `win()`.
- `lose()`:
  - Reduce attempts; if attempts remain, reset ball to paddle and resume count; otherwise show Lose popup with `Retry` button (with icon).
- `win()`:
  - Show Win popup with `Restart level` and `Next level` (both with icons). `Next level` should increase difficulty (or go to the next preset).
- Persist `topScore`, `controls`, `level`, and `soundEnabled` in `localStorage`.

## Power-ups

- Implement power-ups: `enlarge-paddle`, `multi-ball`, `slow-ball`. Each lasts 5s.
- Power-ups fall from destroyed bricks as droppable elements; player collects by touching paddle.
- No power-ups in `insane` mode.

## Styling (global)

- Background Color `#191919`
- Text Color `#ffffff`
- Header border-bottom `#333333`
- Paddle, Brick & Ball Color `#ffffff`
- Powered-up Brick `#FE4E00`
- Remaining attempt `#E9190F` with border `#ffffff`
- Lost attempt `transparent` with border `#ffffff`

## Bonus

- `insane` mode: 10×10 grid, increased ball speed, decreased ball & paddle size.
- special background animation for `insane` mode
- eternal mode (endless)
- Brick animation.

## Assets & Audio

- Put audio files in `/assets/sfx/` and preload them. Provide ability to mute from settings.

## README.md

- Add run instructions, file map, assets list, and how to change constants.
