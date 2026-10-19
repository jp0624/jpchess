# JP Chess

A React chess application with drag-and-drop play, move history, material evaluation and multiple AI strategies.

[Live demo](https://jpchess.vercel.app/)

## Playing

Click a piece and a legal destination, or drag it to a square. Local mode lets two people share a board. Computer mode offers Easy (random legal moves), Medium (one-ply search), Hard (two-ply search) and Extreme (Stockfish). Choose White or Black before playing. Changing the side or mode starts a new game.

Pawn promotion offers a queen, rook, bishop or knight. The app reports check, checkmate and draws, tracks captures for both sides, shows move history and a material balance, and offers a two-ply move suggestion. Undo removes one move locally or returns to the human player's previous turn against the computer. Games are held in memory and reset on refresh. There is no online multiplayer or account sync.

## Development

Use Node.js 22.12 or newer.

```sh
npm ci
npm run dev
npm test
npm run build
```

The predev and prebuild scripts copy the pinned Stockfish 19.0.1 lite single-thread engine and its license from the npm package into public/stockfish. No manual engine download or cross-origin isolation headers are required. Vercel builds the Vite app and serves dist.

## Asset credits

The twelve unmodified standard transparent PNG chess pieces are by Cburnett, from [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:PNG_chess_pieces/Standard_transparent), under [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). Filenames map each piece to a light or dark variant.

[Stockfish.js 19.0.1](https://github.com/nmrugg/stockfish.js/tree/v19.0.1) is distributed under GPL v3. Its corresponding source is available at that tagged repository; the license is included with the deployed engine.
