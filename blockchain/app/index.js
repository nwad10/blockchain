const express =require('express');
const bodyParser=require('body-parser');
const Blockchain=require('../index');
const P2pServer= require('./p2p-server');
const HTTP_PORT = process.argv[2] || 3001;
const app= express();
const bc= new Blockchain();
const P2pserver=new P2pServer(bc);
app.use(bodyParser.json());
console.log(bc);
app.get('/blocks',(req,res) =>{
res.json(bc.chain);
});
app.post('/mine',(req,res)=>{
    const block=bc.addBlock(req.body.data);
    console.log(`new block added: ${block.toString()}`); 
    P2pserver.syncChains();
    res.redirect('/blocks');
});
app.listen(HTTP_PORT,() =>console.log(`listening on port ${HTTP_PORT}`));
P2pserver.listen();