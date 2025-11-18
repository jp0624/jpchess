import React from "react";

interface RecommendationProps {
	recommended: any | null; // move object from chess.js
	explanation?: string | null;
}

export default function Recommendation({
	recommended,
	explanation,
}: RecommendationProps) {
	if (!recommended) return null;

	return (
		<div className="p-2 border rounded bg-white max-w-xs text-black">
			<div className="font-semibold">Recommended move</div>
			<div className="mt-1">
				Move:{" "}
				<strong>
					{recommended.san ?? `${recommended.from}-${recommended.to}`}
				</strong>
			</div>
			{explanation && (
				<div className="mt-2 text-sm text-gray-700">Why: {explanation}</div>
			)}
		</div>
	);
}
