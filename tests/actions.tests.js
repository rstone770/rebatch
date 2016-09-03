import { expect } from 'chai';
import * as actions from '../src/actions';

describe('actions', () => {
  describe('batch', () => {
    const batch = actions.batch;

    it('creates a BATCH action.', () => {
      expect(
        batch()
      ).to.have.property('type', actions.BATCH);
    });

    it('has an actions property.', () => {
      expect(
        batch().actions
      ).to.be.a('array');
    });

    it('adds actions through arguments.', () => {
      expect(
        batch('a', 'b', 'c').actions
      ).to.eql(['a', 'b', 'c']);
    });

    it('adds actions through array.', () => {
      expect(
        batch(['a', 'b', 'c']).actions
      ).to.eql(['a', 'b', 'c']);
    });

    it('adds actions through arrays and arguments.', () => {
      expect(
        batch(
          'a', 'b', 'c',
          ['d', 'e', 'f']
        ).actions
      ).to.eql(['a', 'b', 'c', 'd', 'e', 'f']);
    });
  });

  describe('begin', () => {
    const begin = actions.begin;

    it('creates a BATCH_BEGIN action.', () => {
      expect(
        begin()
      ).to.have.property('type', actions.BATCH_BEGIN);
    });
  });

  describe('end', () => {
    const end = actions.end;

    it('creates a BATCH_END action.', () => {
      expect(
        end()
      ).to.have.property('type', actions.BATCH_END);
    });
  });

  describe('commit', () => {
    const commit = actions.commit;

    it('creates a BATCH_COMMIT action.', () => {
      expect(
        commit()
      ).to.have.property('type', actions.BATCH_COMMIT);
    });

    it('has an actions payload.', () => {
      expect(
        commit(['a', 'b', 'c']).actions
      ).to.eql(['a', 'b', 'c']);
    });
  });

  describe('isBatchAction', () => {
    const isBatchAction = actions.isBatchAction;

    it('determines if an actions is a batch action.', () => {
      expect(
        isBatchAction(actions.batch())
      ).to.equal(true);
    });

    it('determines if an action is not a batch action.', () => {
      [
        isBatchAction(),
        isBatchAction(null),
        isBatchAction(actions.begin()),
        isBatchAction([]),
        isBatchAction('abc'),
        isBatchAction(1),
        isBatchAction({ type: 'action' })
      ].map((isBatchAction) => expect(isBatchAction).to.equal(false));
    });
  });
});
