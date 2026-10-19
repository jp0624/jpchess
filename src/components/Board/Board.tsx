import {useState} from 'react';
import {Chess,type Square as ChessSquare} from 'chess.js';
import Piece from './Piece';
import type {Color} from '../../types';
export default function Board({chess,onMove,draggableSide='both'}:{chess:Chess;onMove:(move:any)=>void;draggableSide?:Color|'both'}){
 const [selected,setSelected]=useState<string|null>(null);
 const [promotion,setPromotion]=useState<{from:string;to:string}|null>(null);
 const allowed=(from:string)=>{const p=chess.get(from as ChessSquare);return !chess.isGameOver()&&p&&p.color===chess.turn()&&(draggableSide==='both'||p.color===draggableSide);};
 const move=(from:string,to:string,promote?:string)=>{
  if(!allowed(from))return;
  const legal=chess.moves({square:from as ChessSquare,verbose:true}).find(m=>m.to===to);if(!legal)return;
  if(legal.promotion&&!promote){setPromotion({from,to});return;}
  try{const m=chess.move({from,to,promotion:promote??'q'});setSelected(null);setPromotion(null);onMove(m);}catch{setSelected(null);}
 };
 const targets=selected&&allowed(selected)?chess.moves({square:selected as ChessSquare,verbose:true}).map(m=>m.to):[];
 return <div><div className="chess-board" aria-label="Chess board">{chess.board().flatMap((rank,ri)=>rank.map((piece,fi)=>{const coord=`${'abcdefgh'[fi]}${8-ri}`;return <button key={coord} className={`chess-square ${(ri+fi)%2?'dark':'light'} ${selected===coord?'selected':''}`} aria-label={`${coord}${piece?` ${piece.color==='w'?'White':'Black'} ${piece.type}`:''}`} draggable={!!piece&&!!allowed(coord)} onDragStart={e=>{if(!allowed(coord)){e.preventDefault();return;}setSelected(coord);e.dataTransfer.setData('text/plain',coord);}} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();move(e.dataTransfer.getData('text/plain'),coord);}} onClick={()=>{if(selected&&targets.includes(coord as ChessSquare))move(selected,coord);else setSelected(allowed(coord)?coord:null);}}><Piece piece={piece}/>{targets.includes(coord as ChessSquare)&&<span className="legal-dot"/>}<small>{coord}</small></button>}))}</div>{promotion&&<div role="group" aria-label="Choose promotion" className="promotion"><p>Promote pawn to:</p>{['q','r','b','n'].map(p=><button key={p} onClick={()=>move(promotion.from,promotion.to,p)}>{({q:'Queen',r:'Rook',b:'Bishop',n:'Knight'})[p]}</button>)}<button onClick={()=>setPromotion(null)}>Cancel</button></div>}</div>;
}
