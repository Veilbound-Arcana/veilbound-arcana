import { test } from "node:test";
import assert from "node:assert/strict";
import { RoomManager } from "../lobby/roomManager";

test("RoomManager manages room lifecycle: create, join, leave", () => {
  const rm = new RoomManager();
  const host = "0x1111111111111111111111111111111111111111";
  const guest = "0x2222222222222222222222222222222222222222";

  const room = rm.createRoom("friendly", host);
  assert.ok(room.roomId);
  assert.equal(room.host, host);
  assert.equal(room.state, "waiting");

  // Guest joins
  const joined = rm.joinRoom(room.roomId, guest);
  assert.ok(joined);
  assert.equal(joined.guest, guest);
  assert.equal(joined.state, "locked");

  // Guest leaves
  rm.leaveRoom(guest);

  const updatedRoom = rm.getRoom(room.roomId);
  assert.ok(updatedRoom);
  assert.equal(updatedRoom.guest, null);
  assert.equal(updatedRoom.state, "waiting");
});

test("RoomManager records decks and commits", () => {
  const rm = new RoomManager();
  const host = "0x3333333333333333333333333333333333333333";
  const guest = "0x4444444444444444444444444444444444444444";
  const room = rm.createRoom("friendly", host);
  rm.joinRoom(room.roomId, guest);

  // Record decks
  const starterDeck = [1, 5, 9, 13, 3];
  rm.recordDeck(room.roomId, host, starterDeck);
  assert.deepEqual(rm.getDeck(room.roomId, host), starterDeck);

  // Commits
  const commit1 = rm.recordCommit(room.roomId, 1, host);
  assert.equal(commit1.bothCommitted, false);

  const commit2 = rm.recordCommit(room.roomId, 1, guest);
  assert.equal(commit2.bothCommitted, true);
});
