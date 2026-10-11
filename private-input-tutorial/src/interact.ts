import { PrivateInput } from './PrivateInput.js';
import { Field, Mina, PrivateKey, AccountUpdate, NetworkId } from 'o1js';
//import * as configFile from '../config.json' assert { type: 'json' };
const contractConfig = {
  networkId: 'testnet',
  url: 'https://api.minascan.io/node/devnet/v1/graphql',
  keyPath: 'keys/privatecontract.json',
  feepayerKeyPath: 'C:\\Users\\Krishnan/.cache/zkapp-cli/keys/myaccount.json',
  feepayerAlias: 'myaccount',
  fee: '0.01',
  smartContract: 'PrivateInput',
};

const Network = Mina.Network({
  // We need to default to the testnet networkId if none is specified for this deploy alias in config.json
  // This is to ensure the backward compatibility.
  networkId: contractConfig.networkId as NetworkId,
  mina: contractConfig.url,
});

Mina.setActiveInstance(Network);

const senderKey = PrivateKey.fromBase58(
  'EKECUVKnABQJQ16taqtKMJ9YvmwRACZqGjjGCdsdk2aN35Dwft21'
);
const senderAccount = senderKey.toPublicKey();

console.log('\n Initializing zkApp setup');

const salt = Field.random();

const zkAppPrivateKey = PrivateKey.fromBase58(
  'EKFHKZf5s29L46NesLvDzGFaa6qvHc7CChdoE4mB3QwUCGNM2z51'
);

const zkAppAddress = zkAppPrivateKey.toPublicKey();

//await fetchAccount(zkAppAddress);

const zkAppInstance = new PrivateInput(zkAppAddress);

// try {
//   const initTxn = await Mina.transaction(
//     {
//       sender: senderAccount,
//       fee: Number(contractConfig.fee) * 1e9,
//     },
//     async () => {
//       zkAppInstance.initState(salt, Field(750));
//     }
//   );
//   await PrivateInput.compile();
//   await initTxn.prove();
//   const sentTxn = await initTxn.sign([senderKey]).send();

//   if (sentTxn.status === 'pending') {
//     console.log(
//       '\nSuccess! Update transaction sent.\n' +
//         '\nYour smart contract state will be updated' +
//         '\nas soon as the transaction is included in a block:' +
//         `\n${getTxnUrl(contractConfig.url, sentTxn.hash)}`
//     );
//   }
// } catch (ex: any) {
//   console.log(ex.message);
// }

const num2 = zkAppInstance.number.get();
console.log('state after init:', num2.toString());

// try {
//   const initTxn = await Mina.transaction(senderAccount, async () => {
//     zkAppInstance.incrementSecret(salt, Field(752));
//   });
//   await initTxn.prove();
//   const sentTxn = await initTxn.sign([senderKey, zkAppPrivateKey]).send();

//   if (sentTxn.status === 'pending') {
//     console.log(
//       '\nSuccess! Update transaction sent.\n' +
//         '\nYour smart contract state will be updated' +
//         '\nas soon as the transaction is included in a block:' +
//         `\n${getTxnUrl(contractConfig.url, sentTxn.hash)}`
//     );
//   }
// } catch (ex: any) {
//   console.log(ex.message);
// }

// const num3 = zkAppInstance.number.get();
// console.log('state after increment state:', num3.toString());

function getTxnUrl(graphQlUrl: string, txnHash: string | undefined) {
  const hostName = new URL(graphQlUrl).hostname;
  const txnBroadcastServiceName = hostName
    .split('.')
    .filter((item) => item === 'minascan')?.[0];
  const networkName = graphQlUrl
    .split('/')
    .filter((item) => item === 'mainnet' || item === 'devnet')?.[0];
  if (txnBroadcastServiceName && networkName) {
    return `https://minascan.io/${networkName}/tx/${txnHash}?type=zk-tx`;
  }
  return `Transaction hash: ${txnHash}`;
}
