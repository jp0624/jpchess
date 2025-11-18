import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import type { Chess as ChessType, Color, MoveVerbose } from "../types";

export function useChess(initialFen?: string) {
	const [game] = useState<ChessType>(() => new Chess(initialFen));
	const [turn, setTurn] = useState<Color>(game.turn());

	// Sync turn whenever the game state changes
	useEffect(() => {
		setTurn(game.turn());
	}, [game]);

	// Make a move from "from" to "to", optionally promoting
	function move(
		from: string,
		to: string,
		promotion: string = "q"
	): MoveVerbose | null {
		try {
			const m = game.move({ from, to, promotion });
			if (m) setTurn(game.turn());
			return m;
		} catch (e) {
			return null;
		}
	}

	// Reset the game to initial state
	function reset() {
		game.reset();
		setTurn(game.turn());
	}

	return { game, move, reset, turn };
}
