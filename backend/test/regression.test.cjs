const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const { mkdtempSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { spawnSync } = require('node:child_process');
const dir = mkdtempSync(join(tmpdir(), 'graphql-regression-'));
process.env.JWT_SECRET = 'test-only-secret-with-more-than-32-characters';
process.env.DATABASE_PATH = join(dir, 'test.db');
const { db } = require('../dist/db');
const { Mutation } = require('../dist/resolvers/Mutation');
const { Query } = require('../dist/resolvers/Query');
const { Subscription } = require('../dist/resolvers/Subscription');
const { verifyToken } = require('../dist/utils/auth');
after(() => { db.close(); rmSync(dir, { recursive: true, force: true }); });

test('startup rejects missing JWT secret', () => {
  const env = { ...process.env }; delete env.JWT_SECRET;
  const result = spawnSync(process.execPath, ['-e', "require('./dist/utils/auth')"], { cwd: join(__dirname, '..'), env });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr.toString(), /JWT_SECRET must be configured/);
});

test('registration and login issue verifiable tokens; post ownership is enforced', () => {
  const a = Mutation.register(null, { username: 'alice', password: 'valid-test-password' });
  const b = Mutation.register(null, { username: 'bob', password: 'valid-test-password' });
  assert.equal(verifyToken(a.token).userId, a.user.id);
  assert.throws(() => Mutation.login(null, { username: 'alice', password: 'wrong' }));
  assert.equal(verifyToken(Mutation.login(null, { username: 'alice', password: 'valid-test-password' }).token).userId, a.user.id);
  const post = Mutation.createPost(null, { content: 'hello' }, { user: a.user });
  assert.throws(() => Mutation.updatePost(null, { id: post.id, content: 'hijacked' }, { user: b.user }));
  assert.throws(() => Mutation.deletePost(null, { id: post.id }, { user: b.user }));
  assert.equal(Query.post(null, { id: post.id }).content, 'hello');
  assert.equal(Mutation.deletePost(null, { id: post.id }, { user: a.user }), true);
});

test('pagination rejects unbounded input and returns distinct pages', () => {
  for (const args of [{ limit: -1 }, { limit: 0 }, { limit: 101 }, { offset: -1 }]) {
    assert.throws(() => Query.posts(null, args));
    assert.throws(() => Query.messages(null, args));
  }
  const { user } = Mutation.login(null, { username: 'alice', password: 'valid-test-password' });
  Mutation.createPost(null, { content: 'page1' }, { user });
  Mutation.createPost(null, { content: 'page2' }, { user });
  const first = Query.posts(null, { limit: 1, offset: 0 });
  const second = Query.posts(null, { limit: 1, offset: 1 });
  assert.equal(first.length, 1); assert.equal(second.length, 1);
  assert.notEqual(first[0].id, second[0].id);
});

test('sending a message returns that exact row even when timestamps tie', () => {
  const { user } = Mutation.login(null, { username: 'alice', password: 'valid-test-password' });
  const a = Mutation.sendMessage(null, { content: 'first' }, { user });
  const b = Mutation.sendMessage(null, { content: 'second' }, { user });
  assert.equal(a.content, 'first'); assert.equal(b.content, 'second'); assert.notEqual(a.id, b.id);
  assert.throws(() => Mutation.sendMessage(null, { content: 'blocked' }, { user: null }));
});

test('public chat remains readable and subscribable without a token', async () => {
  assert.ok(Array.isArray(Query.messages(null, {})));
  const iterator = Subscription.messageAdded.subscribe();
  assert.equal(typeof iterator.next, 'function');
  await iterator.return();
});

test('an explicit database path never tries to create the default data directory', () => {
  const script = `const fs = require('fs'); fs.existsSync = () => false; fs.mkdirSync = () => { throw new Error('default directory write attempted'); }; const { db } = require('./dist/db'); db.close();`;
  const result = spawnSync(process.execPath, ['-e', script], { cwd: join(__dirname, '..'), env: { ...process.env, DATABASE_PATH: ':memory:' } });
  assert.equal(result.status, 0, result.stderr.toString());
});
