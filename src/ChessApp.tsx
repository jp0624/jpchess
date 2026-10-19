import {useEffect,useState} from 'react';
import {Chess,type Move} from 'chess.js';
import Board from './components/Board/Board';
import Piece from './components/Board/Piece';
import Controls from './components/Controls/Controls';
import {evaluateMaterial} from './engine/evaluate';
import {minimaxBestMove} from './engine/minimax';
import {createStockfishWorker,stockfishGetBestMove} from './engine/stockfishWorker';
export default function App(){
 const [chess]=useState(()=>new Chess());const [revision,refresh]=useState(0);
 const [mode,setMode]=useState<'local'|'vsComputer'>('local');
 const [side,setSide]=useState<'w'|'b'>('w');
 const [difficulty,setDifficulty]=useState<'easy'|'medium'|'hard'|'extreme'>('medium');
 const [hint,setHint]=useState<Move|null>(null);const [error,setError]=useState('');const [thinking,setThinking]=useState(false);
 function changed(){setHint(null);setError('');refresh(n=>n+1);}
 function reset(next=mode){chess.reset();setMode(next);changed();}
 useEffect(()=>{
  if(mode!=='vsComputer'||chess.turn()===side||chess.isGameOver()){setThinking(false);return;}
  let cancelled=false;let worker:Worker|null=null;const fen=chess.fen();setThinking(true);
  const timer=setTimeout(async()=>{try{
   let best: {from:string;to:string;promotion?:string}|null=null;
   if(difficulty==='extreme'){worker=createStockfishWorker();const uci=await stockfishGetBestMove(worker,fen);if(uci)best={from:uci.slice(0,2),to:uci.slice(2,4),promotion:uci[4]};}
   else if(difficulty==='easy'){const moves=chess.moves({verbose:true});best=moves[Math.floor(Math.random()*moves.length)];}
   else best=minimaxBestMove(chess,chess.turn(),difficulty==='hard'?2:1);
   if(!cancelled&&chess.fen()===fen&&best){chess.move(best);changed();}
  }catch(e){if(!cancelled)setError(e instanceof Error?e.message:'Unable to make a computer move.');}finally{worker?.terminate();if(!cancelled)setThinking(false);}},200);
  return()=>{cancelled=true;clearTimeout(timer);worker?.terminate();};
 },[revision,mode,side,difficulty,chess]);
 function undo(){if(!chess.history().length)return;chess.undo();if(mode==='vsComputer'&&chess.turn()!==side&&chess.history().length)chess.undo();changed();}
 const history=chess.history({verbose:true});const material=evaluateMaterial(chess);
 const status=chess.isCheckmate()?`Checkmate. ${chess.turn()==='w'?'Black':'White'} wins.`:chess.isStalemate()?'Draw by stalemate.':chess.isThreefoldRepetition()?'Draw by threefold repetition.':chess.isInsufficientMaterial()?'Draw: insufficient material.':chess.isDraw()?'Draw.':`${chess.turn()==='w'?'White':'Black'} to move${chess.isCheck()?' — check':''}.`;
 return <main className="game-shell"><header><p>PLAY & LEARN</p><h1>JP Chess</h1><p>Play locally with a friend or choose a computer opponent.</p></header><div className="game-layout"><section><p role="status">{status} {thinking?'Computer is thinking…':''}</p><Board key={`${mode}-${side}-${history.length===0?'new':'playing'}`} chess={chess} onMove={changed} draggableSide={mode==='vsComputer'?side:'both'}/><div className="material"><span>Material: {material===0?'even':`${material>0?'White':'Black'} +${Math.abs(material)}`}</span><meter min={-39} max={39} value={material} aria-label="Material balance"/></div>{(['w','b'] as const).map(color=><div className="captures" key={color}><span>Captured by {color==='w'?'White':'Black'}</span>{history.filter(m=>m.color===color&&m.captured).map((m,i)=><div key={i}><Piece piece={{type:m.captured!,color:color==='w'?'b':'w'}}/></div>)}</div>)}</section><aside><Controls onNewGame={m=>reset(m==='1P'?'vsComputer':'local')} onUndo={undo} onRecommend={()=>setHint(chess.isGameOver()?null:minimaxBestMove(chess,chess.turn(),2))} mode={mode} setMode={m=>reset(m)} difficulty={difficulty} setDifficulty={setDifficulty}/>{mode==='vsComputer'&&<label className="side-choice">Play as <select value={side} onChange={e=>{setSide(e.target.value as 'w'|'b');reset();}}><option value="w">White</option><option value="b">Black</option></select></label>}{error&&<p role="alert">{error} <button onClick={()=>refresh(n=>n+1)}>Retry</button></p>}<div className="hint"><h2>Move suggestion</h2><p>{hint?`${hint.san} (${hint.from} to ${hint.to}). Based on a two-ply material search.`:'Choose Recommend move to explore an option.'}</p></div><h2>Move history</h2><ol className="history">{history.filter((_,i)=>i%2===0).map((m,i)=><li key={i}><span>{m.san}</span><span>{history[i*2+1]?.san??''}</span></li>)}</ol></aside></div><footer>Pieces by Cburnett via <a href="https://commons.wikimedia.org/wiki/Category:PNG_chess_pieces/Standard_transparent">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0</a>. Unmodified PNGs. Extreme mode uses <a href="https://github.com/nmrugg/stockfish.js/tree/v19.0.1">Stockfish.js 19.0.1</a> (<a href="/stockfish/COPYING.txt">GPL v3</a>).</footer></main>;
}
