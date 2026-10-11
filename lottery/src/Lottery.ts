import {
  Field,
  SmartContract,
  state,
  State,
  Poseidon,
  method,
  PublicKey,
} from 'o1js';

export class Lottery extends SmartContract {
  events = {
    'Amount Transferred': Field,
    'Lottery Status': Field,
  };

  @state(Field) hash = State<Field>();
  @state(Field) status = State<Field>();

  @method async initState(salt: Field, secret: Field) {
    this.hash.set(Poseidon.hash([salt, secret]));
    this.status.set(Field(0));
  }

  @method async lotteryCheck(salt: Field, secret: Field) {
    this.status.requireEquals(Field(0));
    this.hash.requireEquals(this.hash.get());

    Poseidon.hash([salt, secret]).assertEquals(this.hash.get());
    this.account.balance.requireEquals(this.account.balance.get());

    const senderPublicKey = this.sender.getUnconstrained();
    this.send({
      to: senderPublicKey,
      amount: this.account.balance.get(),
    });

    this.emitEvent('Amount Transferred', Field(1));

    this.status.set(Field(1));
    this.emitEvent('Lottery Status', Field(1));
  }
}
