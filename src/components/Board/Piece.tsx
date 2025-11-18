import React from "react";
import type { Color } from "../../types";

interface PieceProps {
	piece: { type: string; color: Color } | null;
}

export default function Piece({ piece }: PieceProps) {
	if (!piece) return null;

	// Unicode symbols for pieces
	const unicodeMap: Record<string, Record<Color, string>> = {
		p: { w: "♟︎", b: "♟︎" },
		r: { w: "♜", b: "♜" },
		n: { w: "♞", b: "♞" },
		b: { w: "♝", b: "♝" },
		q: { w: "♛", b: "♛" },
		k: { w: "♚", b: "♚" },
	};

	const label = unicodeMap[piece.type]?.[piece.color] ?? "?";

	return <span className="text-2xl md:text-3xl">{label}</span>;
}
