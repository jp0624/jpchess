import {mkdirSync,copyFileSync} from 'node:fs';
mkdirSync('public/stockfish',{recursive:true});
for(const ext of ['js','wasm']) copyFileSync(`node_modules/stockfish/bin/stockfish-19-lite-single.${ext}`,`public/stockfish/stockfish-19-lite-single.${ext}`);
copyFileSync('node_modules/stockfish/Copying.txt','public/stockfish/COPYING.txt');
