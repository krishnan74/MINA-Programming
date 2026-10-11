import {Field, Mina, PrivateKey, } from "o1js";

const useProof = false;

const localBlockChain = await Mina.LocalBlockchain({proofsEnabled: useProof});
Mina.setActiveInstance(localBlockChain);

const deployerKey = localBlockChain.testAccounts[0]

const zkPrivateKey = PrivateKey.random();
const zkAppAddress = zkPrivateKey.toPublicKey();

function deployContract(){
    
}
