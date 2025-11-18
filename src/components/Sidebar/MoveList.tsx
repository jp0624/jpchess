import React, { useEffect, useRef } from "react";

interface MoveListProps {
	moves: string[];
}

export default function MoveList({ moves }: MoveListProps) {
	const ref = useRef<HTMLDivElement | null>(null);

	// Auto-scroll to bottom whenever moves change
	useEffect(() => {
		if (ref.current) {
			ref.current.scrollTop = ref.current.scrollHeight;
		}
	}, [moves]);

	return (
		<div
			ref={ref}
			className="flex-grow bg-gray-900 p-3 rounded-lg overflow-y-auto max-h-96 lg:max-h-full"
		>
			<ul className="text-sm font-mono space-y-1">
				{moves.map((move, idx) => (
					<li
						key={idx}
						className={idx % 2 === 0 ? "text-gray-200" : "text-gray-400"}
					>
						{Math.floor(idx / 2) + 1}. {move}
					</li>
				))}
			</ul>
		</div>
	);
}
