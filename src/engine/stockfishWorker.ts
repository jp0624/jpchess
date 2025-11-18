// Wrapper around a Stockfish Web Worker. It exposes a simple function to request bestmove.
// The project must include public/stockfish/stockfish.js and stockfish.wasm (or a combined JS that loads wasm).

export type StockfishWorker = Worker | null;

/**
 * Creates a Stockfish Web Worker instance.
 * @returns Worker | null
 */
export function createStockfishWorker(): StockfishWorker {
	try {
		// Worker path relative to your built app's public folder
		return new Worker("/stockfish/stockfish.js");
	} catch (e) {
		console.error("Failed to create Stockfish worker:", e);
		return null;
	}
}

/**
 * Requests the best move from Stockfish for a given FEN.
 * @param worker - Stockfish Web Worker
 * @param fen - Current board position in FEN
 * @param options - optional depth or movetime
 * @returns Promise resolving to best move string (e.g., "e2e4") or null
 */
export function stockfishGetBestMove(
	worker: StockfishWorker,
	fen: string,
	options: { depth?: number; movetime?: number } = {}
): Promise<string | null> {
	return new Promise((resolve) => {
		if (!worker) return resolve(null);

		const depth = options.depth ?? 8;
		const movetime = options.movetime ?? 1000;

		let best: string | null = null;

		const onMessage = (ev: MessageEvent) => {
			const data = ev.data as string;
			// Stockfish outputs lines like: "bestmove e2e4 ponder e7e5"
			if (typeof data !== "string") return;
			if (data.startsWith("bestmove")) {
				const parts = data.split(" ");
				best = parts[1];
				worker.removeEventListener("message", onMessage);
				resolve(best);
			}
		};

		worker.addEventListener("message", onMessage);

		// Initialize Stockfish
		worker.postMessage("uci");
		worker.postMessage(`position fen ${fen}`);
		// Use depth or movetime for calculating the move
		if (options.depth) {
			worker.postMessage(`go depth ${options.depth}`);
		} else {
			worker.postMessage(`go movetime ${movetime}`);
		}
	});
}
