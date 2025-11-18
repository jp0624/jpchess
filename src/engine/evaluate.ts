import { Chess } from "chess.js";
import { PIECE_VALUE } from "../utils/pieceMaps";

/**
 * Evaluates the material balance of a chess position.
 * Positive score => White advantage, Negative => Black advantage
 * @param chess - Chess instance from chess.js
 * @returns material score
 */
export function evaluateMaterial(chess: Chess): number {
	const board = chess.board();
	let score = 0;

	for (const row of board) {
		for (const sq of row) {
			if (!sq) continue;
			const val = PIECE_VALUE[sq.type] ?? 0;
			score += sq.color === "w" ? val : -val;
		}
	}

	return score;
}
