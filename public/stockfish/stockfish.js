// stockfish.js - WebAssembly bootstrap loader for Stockfish
// Place this in public/stockfish/stockfish.js

// Detect if the browser supports WebAssembly
if (typeof WebAssembly === "object") {
	var Module = {
		locateFile: function (filename) {
			if (filename.endsWith(".wasm")) {
				return "stockfish.wasm"; // relative path to wasm
			}
			return filename;
		},
		print: (text) => console.log(text),
		printErr: (text) => console.error(text),
	};

	// Load the WASM
	(function () {
		var script = document.createElement("script");
		script.src = "stockfish.wasm.js"; // Some builds may generate a separate JS loader
		document.body.appendChild(script);
	})();
} else {
	console.error(
		"Your browser does not support WebAssembly. Stockfish cannot run."
	);
}

// Minimal Worker wrapper for Stockfish
var stockfishWorker = null;

function createStockfishWorker() {
	if (typeof Worker !== "undefined") {
		stockfishWorker = new Worker("stockfish.js"); // path relative to public/
		return stockfishWorker;
	} else {
		console.error("Web Workers are not supported in this browser.");
		return null;
	}
}

// Optional: expose a simple interface for sending commands to Stockfish
function postCommand(cmd) {
	if (stockfishWorker) stockfishWorker.postMessage(cmd);
}
