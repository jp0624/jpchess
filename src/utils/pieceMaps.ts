export const PIECE_VALUE: Record<string, number> = {
	p: 1,
	n: 3,
	b: 3,
	r: 5,
	q: 9,
	k: 0, // king has no material value (infinite value in actual evaluation)
};

export const PIECE_UNICODE: Record<string, string> = {
	p: "♟︎",
	r: "♜",
	n: "♞",
	b: "♝",
	q: "♛",
	k: "♚",
};

export const PIECE_ICONS_MAP: Record<string, string> = {
	wK: "♔",
	wQ: "♕",
	wR: "♖",
	wB: "♗",
	wN: "♘",
	wP: "♙",
	bK: "♚",
	bQ: "♛",
	bR: "♜",
	bB: "♝",
	bN: "♞",
	bP: "♟",
};
