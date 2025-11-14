# React Chess App

A modular **React + TypeScript chess application** with AI difficulty levels, including **Extreme mode using Stockfish WebAssembly**. The app supports 2-player local games, playing vs AI with multiple difficulty levels, and displays move history, captured pieces, and a material advantage bar.

---

## Features

- **2 Player Mode (Local)**: Play with a friend on the same device.
- **AI Mode**:
  - **Easy**: Random legal move.
  - **Medium**: 1-ply material evaluation.
  - **Hard**: 2-ply minimax.
  - **Extreme**: Stockfish WASM AI via Web Worker.
- **Captured pieces display** for both sides.
- **Move history panel**.
- **Material Advantage Bar** showing white vs black advantage.
- **Move recommendation** for 1-ply best move.
- Drag & drop pieces on the board.

---

## Folder Structure

```
public/
  stockfish/
    stockfish.js        # Stockfish JS bootstrap that loads stockfish.wasm
    stockfish.wasm      # Stockfish WebAssembly binary
src/
  index.tsx
  App.tsx
  types.d.ts
  hooks/
    useChess.ts
  engine/
    evaluate.ts
    minimax.ts
    stockfishWorker.ts
  components/
    Board/
      Board.tsx
      Square.tsx
      Piece.tsx
    Controls/
      Controls.tsx
    Sidebar/
      MoveList.tsx
      CapturedPieces.tsx
      Recommendation.tsx
      AdvantageBar.tsx
  utils/
    pieceMaps.ts
```

---

## Getting Started

1. **Clone the repository** or copy the project files.
2. **Install dependencies**:

```bash
npm install react react-dom chess.js @types/chess.js
# or
yarn add react react-dom chess.js @types/chess.js
```

3. **Download Stockfish WASM**:

Download the WebAssembly build of Stockfish from [https://github.com/niklasf/stockfish.wasm](https://github.com/niklasf/stockfish.wasm) and place:

```
public/stockfish/stockfish.js
public/stockfish/stockfish.wasm
```

4. **Run the app**:

```bash
npm start
# or
yarn start
```

---

## Usage

- Select **2 Player (Local)** to play with a friend.
- Select **Play vs Computer** and choose a difficulty:
  - Easy / Medium / Hard / Extreme
- Click **New Game** to start.
- Use **Undo** to revert moves.
- AI moves automatically after your move in 1P mode.

---

## Technical Details

- **Board**: Drag-and-drop squares, top-right coordinates.
- **AI Implementation**:
  - Easy: Random move.
  - Medium: 1-ply material evaluation.
  - Hard: 2-ply minimax using material score.
  - Extreme: Stockfish via Web Worker using `uci` protocol.
- **Hooks**:
  - `useChess` manages Chess.js instance.
- **Engine**:
  - `evaluate.ts` for material evaluation.
  - `minimax.ts` for hard AI.
  - `stockfishWorker.ts` for Stockfish Web Worker integration.
- **Components**:
  - Board: `Board`, `Square`, `Piece`.
  - Controls: `Controls`.
  - Sidebar: `MoveList`, `CapturedPieces`, `Recommendation`, `AdvantageBar`.

---

## License

MIT License
