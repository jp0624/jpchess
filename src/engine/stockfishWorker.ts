export type StockfishWorker = Worker | null;
export function createStockfishWorker(): Worker {return new Worker(`${import.meta.env.BASE_URL}stockfish/stockfish-19-lite-single.js`);}
export function stockfishGetBestMove(worker:StockfishWorker,fen:string,options:{depth?:number;movetime?:number}={}):Promise<string|null>{
 return new Promise((resolve,reject)=>{
  if(!worker){reject(new Error('The chess engine could not start.'));return;}
  const cleanup=()=>{clearTimeout(timer);worker.removeEventListener('message',message);worker.removeEventListener('error',error);};
  const error=()=>{cleanup();reject(new Error('The chess engine could not load. Try again.'));};
  const message=(event:MessageEvent)=>{const line=String(event.data);if(line==='uciok')worker.postMessage('isready');else if(line==='readyok'){worker.postMessage(`position fen ${fen}`);worker.postMessage(`go movetime ${options.movetime??1200}`);}else if(line.startsWith('bestmove ')){cleanup();const move=line.split(' ')[1];resolve(move==='(none)'?null:move);}};
  const timer=setTimeout(error,20000);worker.addEventListener('message',message);worker.addEventListener('error',error);worker.postMessage('uci');
 });
}
