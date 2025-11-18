import React from "react";

interface ControlsProps {
	onNewGame: (mode: "2P" | "1P") => void;
	onUndo: () => void;
	onRecommend: () => void;
	mode: "local" | "vsComputer";
	setMode: (mode: "local" | "vsComputer") => void;
	difficulty: "easy" | "medium" | "hard" | "extreme";
	setDifficulty: (level: "easy" | "medium" | "hard" | "extreme") => void;
}

export default function Controls({
	onNewGame,
	onUndo,
	onRecommend,
	mode,
	setMode,
	difficulty,
	setDifficulty,
}: ControlsProps) {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex gap-2">
				<button
					onClick={() => onNewGame("2P")}
					className="px-3 py-1 rounded bg-blue-600 text-white"
				>
					New 2P
				</button>
				<button
					onClick={() => onNewGame("1P")}
					className="px-3 py-1 rounded bg-purple-600 text-white"
				>
					New vs AI
				</button>
				<button onClick={onUndo} className="px-3 py-1 rounded bg-gray-300">
					Undo
				</button>
			</div>

			<div className="flex gap-2 items-center">
				<label className="text-sm">Mode:</label>
				<select
					value={mode}
					onChange={(e) => setMode(e.target.value as "local" | "vsComputer")}
					className="p-1 border rounded"
				>
					<option value="local">2 Player (Local)</option>
					<option value="vsComputer">Play vs Computer</option>
				</select>
			</div>

			{mode === "vsComputer" && (
				<div className="flex gap-2 items-center">
					<label className="text-sm">Difficulty:</label>
					<select
						value={difficulty}
						onChange={(e) =>
							setDifficulty(
								e.target.value as "easy" | "medium" | "hard" | "extreme"
							)
						}
						className="p-1 border rounded"
					>
						<option value="easy">Easy</option>
						<option value="medium">Medium</option>
						<option value="hard">Hard</option>
						<option value="extreme">Extreme (Stockfish)</option>
					</select>
				</div>
			)}

			<div className="text-sm">
				If vs Computer, AI moves automatically after your move.
			</div>
		</div>
	);
}
