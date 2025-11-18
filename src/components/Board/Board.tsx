import React from "react";
import Square from "./Square";
import Piece from "./Piece";
import { Chess } from "chess.js";
import type { Color } from "../../types";

interface BoardProps {
	chess: Chess;
	onMove: (move: any) => void;
	draggableSide?: Color | "both";
}

export default function Board({
	chess,
	onMove,
	draggableSide = "both",
}: BoardProps) {
	const board = chess.board();
	const ranks = [8, 7, 6, 5, 4, 3, 2, 1];
	const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

	function handleDragStart(e: React.DragEvent, from: string, piece: any) {
		if (!piece) return e.preventDefault();
		const turn = chess.turn();
		if (draggableSide !== "both" && piece.color !== draggableSide)
			return e.preventDefault();
		if (piece.color !== turn) return e.preventDefault();
		e.dataTransfer.setData("application/chess-move", from);
		e.dataTransfer.effectAllowed = "move";
	}

	function handleDrop(e: React.DragEvent, to: string) {
		e.preventDefault();
		const from = e.dataTransfer.getData("application/chess-move");
		if (!from) return;
		try {
			const move = chess.move({ from, to, promotion: "q" });
			if (move) onMove(move);
		} catch (err) {
			// invalid move, ignore
		}
	}

	function allowDrop(e: React.DragEvent) {
		e.preventDefault();
	}

	return (
		<div
			className="grid grid-cols-8 grid-rows-8 gap-0 border-2 border-gray-300"
			style={{ width: "max-content" }}
		>
			{ranks.map((r, ri) =>
				files.map((f, fi) => {
					const coord = `${f}${r}`;
					const square = board[ri][fi];
					const isLight = (ri + fi) % 2 === 0;
					return (
						<div
							key={coord}
							onDragOver={allowDrop}
							onDrop={(e) => handleDrop(e, coord)}
							className="p-0"
						>
							<Square coord={coord} isLight={isLight}>
								{square ? (
									<div
										draggable
										onDragStart={(e) => handleDragStart(e, coord, square)}
										className="cursor-grab"
									>
										<Piece
											piece={{
												type: square.type,
												color: square.color as Color,
											}}
										/>
									</div>
								) : null}
							</Square>
						</div>
					);
				})
			)}
		</div>
	);
}
