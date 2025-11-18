import React from "react";

interface SquareProps {
	coord: string;
	isLight: boolean;
	children?: React.ReactNode;
}

export default function Square({ coord, isLight, children }: SquareProps) {
	// Show coord top-right small label
	return (
		<div
			data-coord={coord}
			className={`relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center select-none ${
				isLight ? "bg-[color:var(--beige)]" : "bg-[color:var(--green)]"
			}`}
		>
			<div className="absolute top-0 right-0 text-[10px] opacity-70 p-0.5">
				{coord}
			</div>
			{children}
		</div>
	);
}
