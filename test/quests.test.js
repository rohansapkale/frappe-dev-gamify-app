import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { TRACKS, QUESTS } from '../src/data/quests.js';

describe('Quest Data Integrity Tests', () => {
  test('TRACKS array is defined and contains valid track items', () => {
    assert.ok(Array.isArray(TRACKS));
    assert.ok(TRACKS.length > 0);

    TRACKS.forEach((track) => {
      assert.ok(track.id, `Track missing id`);
      assert.ok(track.title, `Track ${track.id} missing title`);
      assert.ok(track.description, `Track ${track.id} missing description`);
    });
  });

  test('QUESTS array is defined and all quests have required fields', () => {
    assert.ok(Array.isArray(QUESTS));
    assert.ok(QUESTS.length > 0);

    const seenIds = new Set();
    QUESTS.forEach((quest) => {
      assert.ok(quest.id, 'Quest missing id');
      assert.equal(seenIds.has(quest.id), false, `Duplicate quest id: ${quest.id}`);
      seenIds.add(quest.id);

      assert.ok(quest.title, `Quest ${quest.id} missing title`);
      assert.ok(quest.trackId, `Quest ${quest.id} missing trackId`);
      assert.ok(typeof quest.starterCode === 'string', `Quest ${quest.id} missing starterCode`);
      assert.ok(typeof quest.solutionCode === 'string', `Quest ${quest.id} missing solutionCode`);
      assert.ok(quest.testDoc, `Quest ${quest.id} missing testDoc`);
      assert.ok(typeof quest.xp === 'number', `Quest ${quest.id} missing xp number`);
    });
  });
});
