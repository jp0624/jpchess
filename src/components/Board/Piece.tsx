import type { Color } from '../../types';
const names: Record<string,string>={p:'pawn',r:'rook',n:'knight',b:'bishop',q:'queen',k:'king'};
export default function Piece({piece}:{piece:{type:string;color:Color}|null}){
 return piece?<img draggable={false} width={60} height={60} style={{width:'100%',height:'100%',objectFit:'contain'}} src={`${import.meta.env.BASE_URL}pieces/${piece.type}${piece.color==='w'?'l':'d'}.png`} alt={`${piece.color==='w'?'White':'Black'} ${names[piece.type]}`}/>:null;
}
