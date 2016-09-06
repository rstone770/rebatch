import chai, { expect } from 'chai';
import spread from '../src/spread';

describe('spread', () => {
  it('throws if args is not an array or null.', () => {
    const throwString = () => spread('a', () => {}),
          throwNumber = () => spread(1, () => {}),
          throwObject = () => spread({}, () => {});

    expect(throwString).to.throw();
    expect(throwNumber).to.throw();
    expect(throwObject).to.throw();
  });

  it('accept array or nully args.', () => {
    const array = () => spread([], () => {}),
          nully = () => spread(null, () => {});

    expect(array).to.not.throw();
    expect(nully).to.not.throw();
  });

  it('throws if fn is not a function type.', () => {
    const throwString = () => spread([], 'a'),
          throwNumber = () => spread([], 1),
          throwObject = () => spread([], {}),
          throwArray = () => spread([], []),
          throwNully = () => spread([], null);

    expect(throwString).to.throw();
    expect(throwNumber).to.throw();
    expect(throwObject).to.throw();
    expect(throwArray).to.throw();
    expect(throwNully).to.throw();
  });

  it('accept function type as fn.', () => {
    const doNotThrow = () => spread([], () => {});

    expect(doNotThrow).to.not.throw();
  });

  it('spreads arguments over fn.', () => {
    const over = chai.spy();

    spread([
      'a',
      'b',
      'c'
    ], over);

    expect(over).to.have.been.called.exactly(1);
    expect(over).to.have.been.called.with.exactly('a', 'b', 'c');
  });

  it('returns fn result.', () => {
    expect(
      spread([], () => 'value')
    ).to.equal('value');
  });
});
