import { Field, SmartContract, state, State, method, Poseidon } from 'o1js';

export class PrivateInput extends SmartContract {
  @state(Field) number = State<Field>();

  @method async initState(salt: Field, firstSecret: Field) {
    this.number.set(Poseidon.hash([salt, firstSecret]));
  }

  @method async incrementSecret(salt: Field, secret: Field) {
    const number = this.number.get();
    this.number.requireEquals(number);

    Poseidon.hash([salt, secret]).assertEquals(number);
    this.number.set(Poseidon.hash([salt, secret.add(1)]));
  }
}
