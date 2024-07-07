import { PrivateInput } from './PrivateInput.js';
import { Field, Mina, PrivateKey, AccountUpdate, PublicKey } from 'o1js';

const useProof = false;
const localBlockChain = await Mina.LocalBlockchain({ proofsEnabled: useProof });
Mina.setActiveInstance(localBlockChain);

const deployerKey = localBlockChain.testAccounts[0].key;
const deployerAccount = deployerKey.toPublicKey();
const senderKey = localBlockChain.testAccounts[1].key;
const senderAccount = senderKey.toPublicKey();

console.log('\n Initializing zkApp setup');

const salt = Field.random();

const zkAppPrivateKey = PrivateKey.random();

const zkAppAddress = zkAppPrivateKey.toPublicKey();
console.log(zkAppAddress.x);

const zkAppInstance = new PrivateInput(zkAppAddress);

try {
  const deployTxn = await Mina.transaction(deployerAccount, async () => {
    AccountUpdate.fundNewAccount(deployerAccount);
    zkAppInstance.deploy();
    //
  });
  //
  await deployTxn.sign([deployerKey, zkAppPrivateKey]).send();

  const num0 = zkAppInstance.number.get();
  console.log('state after deploy:', num0.toString());
} catch (ex: any) {
  console.log(ex.message);
}

try {
  const initTxn = await Mina.transaction(deployerAccount, async () => {
    zkAppInstance.initState(salt, Field(750));
  });
  await initTxn.prove();
  await initTxn.sign([deployerKey, zkAppPrivateKey]).send();
} catch (ex: any) {
  console.log(ex.message);
}

const num2 = zkAppInstance.number.get();
console.log('state after init:', num2.toString());


try {
  const initTxn = await Mina.transaction(deployerAccount, async () => {
    zkAppInstance.incrementSecret(salt, Field(752));
  });
  await initTxn.prove();
  await initTxn.sign([deployerKey, zkAppPrivateKey]).send();
} catch (ex: any) {
  console.log(ex.message);
}

const num3 = zkAppInstance.number.get();
console.log('state after increment state:', num3.toString());
