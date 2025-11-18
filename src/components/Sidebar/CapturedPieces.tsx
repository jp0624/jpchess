import React from "react";
import { PIECE_ICONS_MAP } from "../../utils/pieceMaps";

interface CapturedPiecesProps {
	captured: string[];
	color: "w" | "b";
	isTop: boolean;
}

export default function CapturedPieces({
	captured,
	color,
	isTop,
}: CapturedPiecesProps) {
	// Display captured pieces using the PIECE_ICONS_MAP
	const pieceDisplay = captured
		.map((p) => PIECE_ICONS_MAP[`${color}${p.toUpperCase()}`])
		.join(" ");

	const classes = isTop
		? "bg-gray-800 text-white rounded-t-xl"
		: "bg-gray-100 text-gray-800 rounded-b-xl";

	return (
		<div className={`p-3 font-semibold flex flex-col space-y-1 ${classes}`}>
			<div className="text-lg font-mono tracking-wider">
				{color === "w" ? "White" : "Black"} Captured
			</div>
			<div className="text-2xl min-h-[3rem] font-sans">
				{pieceDisplay || "-"}
			</div>
		</div>
	);
}
