import { Square } from './Square.js';

import { Field, Mina, PrivateKey, AccountUpdate } from 'o1js';

const useProof = false;
const localBlockChain = await Mina.LocalBlockchain({ proofsEnabled: useProof });
Mina.setActiveInstance(localBlockChain);

const deployerKey = localBlockChain.testAccounts[0].key;
const deployerAccount = deployerKey.toPublicKey();
const senderKey = localBlockChain.testAccounts[1].key;
const senderAccount = senderKey.toPublicKey();

console.log('\n Initializing zkApp setup');

const zkAppPrivateKey = PrivateKey.random();
const zkAppAddress = zkAppPrivateKey.toPublicKey();

const zkAppInstance = new Square(zkAppAddress);

const txDeploy = await Mina.transaction(deployerAccount, async () => {
  AccountUpdate.fundNewAccount(deployerAccount);
  zkAppInstance.deploy();
});

await txDeploy.sign([deployerKey, zkAppPrivateKey]).send();

const number = zkAppInstance.number.get();
console.log('State after initialization: ' + number.toString());

console.log('\n Initializing transaction1 update method');

const updateTxn = await Mina.transaction(senderAccount, async () => {
  zkAppInstance.update(Field(9));
});

await updateTxn.prove();
await updateTxn.sign([senderKey]).send();

const num1 = zkAppInstance.number.get();
console.log('State after transaction 1  : ' + num1);


console.log('\n Initializing transaction2 update method');
try {
  const wrongUpdateTxn = await Mina.transaction(senderAccount, async () => {
    zkAppInstance.update(Field(75));
  });

  await wrongUpdateTxn.prove();
  await wrongUpdateTxn.sign([senderKey]).send();
} catch (ex: any) {
  console.log(ex.error);
}

const num2 = zkAppInstance.number.get();
console.log('State after transaction 2: ' + num2);



console.log('\n Initializing transaction3 update method');
try {
  const wrongUpdateTxn = await Mina.transaction(senderAccount, async () => {
    zkAppInstance.update(Field(81));
  });

  await wrongUpdateTxn.prove();
  await wrongUpdateTxn.sign([senderKey]).send();
} catch (ex: any) {
  console.log(ex.error);
}
const num3 = zkAppInstance.number.get();
console.log('State after transaction 3: ' + num3);
