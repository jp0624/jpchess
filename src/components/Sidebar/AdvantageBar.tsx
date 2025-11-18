import React from "react";

interface AdvantageBarProps {
	score: number; // positive => white advantage, negative => black advantage
}

export default function AdvantageBar({ score }: AdvantageBarProps) {
	// Cap score between -20 and +20 for visualization
	const capped = Math.max(-20, Math.min(20, score));
	const percent = Math.round(((capped + 20) / 40) * 100); // convert to 0-100%

	return (
		<div className="w-64">
			<div className="flex justify-between mb-1 text-sm">
				<div>White</div>
				<div>Black</div>
			</div>
			<div className="h-4 w-full bg-gray-200 rounded relative overflow-hidden">
				<div
					className="absolute h-full left-0 top-0"
					style={{
						width: `${percent}%`,
						background: "linear-gradient(90deg,#fef3c7,#bbf7d0)",
					}}
				/>
			</div>
			<div className="text-xs mt-1">Material score: {score.toFixed(1)}</div>
		</div>
	);
}
