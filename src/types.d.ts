import { Chess as ChessType } from "chess.js";

// Represents the color of a chess piece or player
export type Color = "w" | "b";

// Verbose move object returned by chess.js
export type MoveVerbose = {
	color: Color;
	from: string;
	to: string;
	flags: string;
	piece: string;
	san: string;
	captured?: string;
	promotion?: string;
};

// Chess instance type
export type Chess = ChessType;
