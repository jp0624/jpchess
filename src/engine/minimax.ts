import { Chess } from "chess.js";
import { evaluateMaterial } from "./evaluate";
import type { Color } from "../types"; //

/**
 * Simple minimax implementation for choosing the best move.
 * @param chess - Chess instance from chess.js
 * @param colorToMove - "w" or "b"
 * @param depth - depth of search (default 2)
 * @returns best move object or null if no legal moves
 */
export function minimaxBestMove(chess: Chess, colorToMove: Color, depth = 2) {
	const maximizing = colorToMove === "w";

	function minimax(node: Chess, d: number, maximizingPlayer: boolean): number {
		if (d === 0) return evaluateMaterial(node);

		const moves = node.moves({ verbose: true });
		if (!moves || moves.length === 0) return evaluateMaterial(node);

		if (maximizingPlayer) {
			let best = -Infinity;
			for (const m of moves) {
				const copy = new Chess(node.fen());
				copy.move({ from: m.from, to: m.to, promotion: m.promotion });
				const val = minimax(copy, d - 1, false);
				best = Math.max(best, val);
			}
			return best;
		} else {
			let best = Infinity;
			for (const m of moves) {
				const copy = new Chess(node.fen());
				copy.move({ from: m.from, to: m.to, promotion: m.promotion });
				const val = minimax(copy, d - 1, true);
				best = Math.min(best, val);
			}
			return best;
		}
	}

	const moves = chess.moves({ verbose: true });
	if (!moves || moves.length === 0) return null;

	let bestMove: any = null;
	let bestScore = maximizing ? -Infinity : Infinity;

	for (const m of moves) {
		const copy = new Chess(chess.fen());
		copy.move({ from: m.from, to: m.to, promotion: m.promotion });
		const score = minimax(copy, depth - 1, !maximizing);
		if (maximizing && score > bestScore) {
			bestScore = score;
			bestMove = m;
		}
		if (!maximizing && score < bestScore) {
			bestScore = score;
			bestMove = m;
		}
	}

	return bestMove;
}
