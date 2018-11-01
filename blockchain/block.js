
 const {DIFFICULTY,MINE_RATE}=require('../config');
 const chainUtil=require('../chain-util');
class block{
    constructor(timestamp,lastHash,hash,data,nonce,difficulty) {
        this.timestamp=timestamp;
        this.lastHash=lastHash;
        this.hash=hash;
        this.data=data;
        this.nonce=nonce;
        this.difficulty=difficulty ||DIFFICULTY;
    }

    toString() {
        return `Block -
        timestamp : ${this.timestamp}
        last hash : ${this.lastHash.substring(0,10)}
        hash      : ${this.hash.substring(0,10)}
        nonce     :${this.nonce}
        difficulty:${this.difficulty}
        data      : ${this.data}`;
    }
    static genesis() {
        return new this('genesis time', '   ', 'f1r57-h45h',[],0,DIFFICULTY);
    }
    static mineBlock(lastBlock,data){
        let hash, timestamp;
        
        const lastHash=lastBlock.hash;
        let {difficulty}=lastBlock;
        let nonce=0;
        do{
            nonce++;
            timestamp=Date.now();
            difficulty=block.adjustDifficulty(lastBlock,timestamp);
             hash=block.hash(timestamp,lastHash,data,nonce,difficulty); 
        } while(hash.substring(0,difficulty)!=='0'.repeat(difficulty));

        return new this(timestamp, lastHash, hash,data,nonce,difficulty);

    }

    static hash(timestamp,lastHash,data,nonce,difficulty) {
        return chainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
    }
    static blockHash(block){
        const { timestamp,lastHash,data, nonce,difficulty }=block;
        return this.hash(timestamp,lastHash,data,nonce,difficulty);
}
    static adjustDifficulty(lastBlock,currentTime){
        let{difficulty}=lastBlock;
        difficulty=lastBlock.timestamp+MINE_RATE>currentTime ? difficulty+1 : difficulty-1;
        return difficulty;
    }
}
module.exports= block;