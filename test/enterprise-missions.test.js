import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { MISSION_CATEGORIES, ENTERPRISE_MISSIONS } from '../src/data/enterpriseMissions.js';

describe('Enterprise Missions Integrity Tests', () => {
  test('MISSION_CATEGORIES array is valid', () => {
    assert.ok(Array.isArray(MISSION_CATEGORIES));
    assert.ok(MISSION_CATEGORIES.length > 0);
    MISSION_CATEGORIES.forEach(cat => {
      assert.ok(cat.id, 'Category missing id');
      assert.ok(cat.name, 'Category missing name');
    });
  });

  test('ENTERPRISE_MISSIONS array has 50 valid scenarios', () => {
    assert.ok(Array.isArray(ENTERPRISE_MISSIONS));
    assert.equal(ENTERPRISE_MISSIONS.length, 50);

    const ids = new Set();
    ENTERPRISE_MISSIONS.forEach(mission => {
      assert.ok(mission.id, 'Mission missing id');
      assert.equal(ids.has(mission.id), false, `Duplicate mission id: ${mission.id}`);
      ids.add(mission.id);

      assert.ok(mission.title, `Mission ${mission.id} missing title`);
      assert.ok(mission.categoryId, `Mission ${mission.id} missing categoryId`);
      assert.ok(typeof mission.xp === 'number', `Mission ${mission.id} missing xp`);
    });
  });
});
