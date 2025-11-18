import React, { useEffect, useMemo, useRef, useState } from "react";
import { Chess } from "chess.js";
import Board from "./components/Board/Board";
import Controls from "./components/Controls/Controls";
import MoveList from "./components/Sidebar/MoveList";
import CapturedPieces from "./components/Sidebar/CapturedPieces";
import Recommendation from "./components/Sidebar/Recommendation";
import AdvantageBar from "./components/Sidebar/AdvantageBar";
import { evaluateMaterial } from "./engine/evaluate";
import { minimaxBestMove } from "./engine/minimax";
import {
	createStockfishWorker,
	stockfishGetBestMove,
} from "./engine/stockfishWorker";
import { PIECE_UNICODE } from "./utils/pieceMaps";
import type { Color } from "./types";

export default function App() {
	const [chess] = useState(() => new Chess());
	const [, forceRerender] = useState(0);
	const [playerSide, setPlayerSide] = useState<Color>(() =>
		Math.random() < 0.5 ? "w" : "b"
	);

	const [mode, setMode] = useState<"local" | "vsComputer">("local");
	const [difficulty, setDifficulty] = useState<
		"easy" | "medium" | "hard" | "extreme"
	>("medium");
	const [moveHistory, setMoveHistory] = useState<string[]>([]);
	const [captured, setCaptured] = useState<{ w: string[]; b: string[] }>({
		w: [],
		b: [],
	});
	const [recommended, setRecommended] = useState<any | null>(null);
	const [explain, setExplain] = useState<string | null>(null);

	const stockfishWorkerRef = useRef<Worker | null>(null);

	useEffect(() => {
		return () => {
			if (stockfishWorkerRef.current) {
				stockfishWorkerRef.current.terminate();
				stockfishWorkerRef.current = null;
			}
		};
	}, []);

	function pushHistory(san: string) {
		setMoveHistory((m) => [...m, san]);
	}

	function onMove(move: any) {
		if (!move) return;
		if (move.captured) {
			const cap = move.captured.toLowerCase();
			const color = move.color as Color;
			setCaptured((c) => ({ ...c, [color]: [...(c as any)[color], cap] }));
		}
		pushHistory(move.san ?? `${move.from}-${move.to}`);
		setRecommended(null);
		setExplain(null);
		forceRerender((n) => n + 1);

		if (mode === "vsComputer") {
			const turn = chess.turn();
			const computerColor: Color = playerSide === "w" ? "b" : "w";
			if (turn === computerColor && !chess.game_over()) {
				setTimeout(() => handleComputerMove(computerColor), 200);
			}
		}
	}

	async function handleComputerMove(color: Color) {
		if (difficulty === "easy") {
			const moves = chess.moves({ verbose: true });
			if (!moves || moves.length === 0) return;
			const choice = moves[Math.floor(Math.random() * moves.length)];
			const m = chess.move({
				from: choice.from,
				to: choice.to,
				promotion: choice.promotion,
			});
			if (m) onMove(m);
			return;
		}

		if (difficulty === "medium") {
			const best = recommendMoveOnePly(chess, color);
			if (!best) return;
			const m = chess.move({
				from: best.from,
				to: best.to,
				promotion: best.promotion,
			});
			if (m) onMove(m);
			return;
		}

		if (difficulty === "hard") {
			const best = minimaxBestMove(chess, color, 2);
			if (!best) return;
			const m = chess.move({
				from: best.from,
				to: best.to,
				promotion: best.promotion,
			});
			if (m) onMove(m);
			return;
		}

		if (difficulty === "extreme") {
			if (!stockfishWorkerRef.current)
				stockfishWorkerRef.current = createStockfishWorker();
			const worker = stockfishWorkerRef.current;
			const bestUci = await stockfishGetBestMove(worker, chess.fen(), {
				depth: 12,
			});
			if (!bestUci) return;
			const from = bestUci.substring(0, 2);
			const to = bestUci.substring(2, 4);
			const promotion = bestUci.length > 4 ? bestUci[4] : undefined;
			const m = chess.move({ from, to, promotion: promotion ?? "q" });
			if (m) onMove(m);
			return;
		}
	}

	function recommendMoveOnePly(chessInst: Chess, color: Color) {
		const moves = chessInst.moves({ verbose: true });
		if (!moves || moves.length === 0) return null;
		let best: any = null;
		let bestScore = color === "w" ? -Infinity : Infinity;
		for (const m of moves) {
			const copy = new Chess(chessInst.fen());
			copy.move({ from: m.from, to: m.to, promotion: m.promotion });
			const score = evaluateMaterial(copy);
			if (color === "w") {
				if (score > bestScore) {
					bestScore = score;
					best = m;
				}
			} else {
				if (score < bestScore) {
					bestScore = score;
					best = m;
				}
			}
		}
		return best;
	}

	function onNewGame(modeParam: "2P" | "1P") {
		chess.reset();
		setCaptured({ w: [], b: [] });
		setMoveHistory([]);
		setRecommended(null);
		setExplain(null);
		setPlayerSide(Math.random() < 0.5 ? "w" : "b");
		setMode(modeParam === "1P" ? "vsComputer" : "local");
		forceRerender((n) => n + 1);
	}

	function onUndo() {
		const mv = chess.undo();
		if (mv && mv.captured) {
			const key = mv.color === "w" ? "w" : "b";
			setCaptured((c) => {
				const arr = [...(c as any)[key]];
				const idx = arr.lastIndexOf(mv.captured);
				if (idx >= 0) arr.splice(idx, 1);
				return { ...c, [key]: arr } as any;
			});
		}
		setMoveHistory((m) => m.slice(0, -1));
		forceRerender((n) => n + 1);
	}

	function onRecommend() {
		const turn = chess.turn() as Color;
		const best = recommendMoveOnePly(chess, turn);
		if (!best) {
			setRecommended({ move: "N/A" });
			setExplain("No legal moves");
			return;
		}
		const copy = new Chess(chess.fen());
		copy.move({ from: best.from, to: best.to, promotion: best.promotion });
		const before = evaluateMaterial(chess);
		const after = evaluateMaterial(copy);
		const diff = after - before;
		const explanation =
			diff > 0
				? `Increases White material by ${diff.toFixed(1)}`
				: diff < 0
				? `Decreases White material by ${Math.abs(diff).toFixed(1)}`
				: `Maintains material but may improve position`;
		setRecommended(best);
		setExplain(explanation);
	}

	const material = useMemo(
		() => evaluateMaterial(chess),
		[moveHistory.join(",")]
	);

	const movesForDisplay = moveHistory.map((m, idx) => `${idx + 1}. ${m}`);

	return (
		<div
			className="min-h-screen p-6 bg-gray-50 text-slate-800"
			style={
				{ "--green": "#4f7942", "--beige": "#f6f1e6" } as React.CSSProperties
			}
		>
			<div className="max-w-6xl mx-auto">
				<div className="flex gap-6">
					<div className="flex gap-4">
						<div className="flex flex-col items-center gap-3">
							<div className="flex items-center gap-4">
								<div className="text-sm">
									You are playing:{" "}
									<strong>{playerSide === "w" ? "White" : "Black"}</strong>
								</div>
								<AdvantageBar score={material} />
							</div>

							<div className="flex gap-4 items-start">
								<CapturedPieces captured={captured.w} color="w" isTop={true} />
								<Board chess={chess} onMove={onMove} draggableSide={"both"} />
								<div className="flex flex-col gap-3">
									<Controls
										onNewGame={onNewGame}
										onUndo={onUndo}
										onRecommend={onRecommend}
										mode={mode}
										setMode={setMode}
										difficulty={difficulty}
										setDifficulty={setDifficulty}
									/>
									<Recommendation
										recommended={recommended}
										explanation={explain}
									/>
								</div>
							</div>
						</div>
					</div>

					<div className="flex flex-col">
						<div className="font-semibold mb-2">Move history</div>
						<MoveList moves={movesForDisplay} />
					</div>
				</div>
			</div>
		</div>
	);
}
