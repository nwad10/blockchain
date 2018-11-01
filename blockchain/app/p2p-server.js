const Websocket= require('ws');
const P2P_PORT = process.argv[3] || 5001;
const peers = process.argv[4] ? process.argv[4].split(','):[];

class P2pServer{
    constructor(blockchain){
        this.blockchain= blockchain;
        this.sockets=[];
    }

    listen(){
        const server = new Websocket.Server({port: P2P_PORT});
        server.on('connection',socket =>this.connectSocket(socket));

        this.connectToPeers();
        console.log(`listening for peer-to-peer connections on:${P2P_PORT}`);
    }
    connectToPeers(){
        peers.forEach(peer => {
            const socket=new Websocket(peer);
            socket.on('open',() => this.connectSocket(socket));
            
        });
    }

    connectSocket(socket){
        this.sockets.push(socket);
        console.log('socket connected');
        this.messageHandler(socket);
        this.sendChain(socket);
    }
    messageHandler(socket){
        socket.on('message',message =>{
            const data =JSON.parse(message);
            console.log('data',data);
            this.blockchain.replaceChain(data);
        });
    }
    sendChain(socket){
        socket.send(JSON.stringify(this.blockchain.chain));
    }
    syncChains(){
        this.sockets.forEach(socket =>{this.sendChain(socket)

        });
    }
}
module.exports=P2pServer;