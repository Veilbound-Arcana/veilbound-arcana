import WebSocket from "ws";

const URL = "ws://localhost:4000";
const address = "0x1111111111111111111111111111111111111111";
const deck = [1, 5, 9, 13, 3];

const ws = new WebSocket(URL);
const log = [];
let step = 0;
let matchRoom = null;
let timer = null;

function send(obj) {
  log.push(`--> ${obj.type}`);
  ws.send(JSON.stringify(obj));
}

function fail(reason) {
  console.error("SMOKE FAIL:", reason);
  console.error("Log:\n" + log.join("\n"));
  process.exit(1);
}

function pass() {
  console.log("SMOKE PASS\n" + log.join("\n"));
  process.exit(0);
}

function expect(type, handler) {
  const onMessage = (raw) => {
    const msg = JSON.parse(raw.toString());
    log.push(`<-- ${msg.type}`);
    if (msg.type === "ERROR") fail(`server error: ${msg.code} ${msg.message}`);
    if (msg.type === type) {
      ws.off("message", onMessage);
      handler(msg);
    }
  };
  ws.on("message", onMessage);
}

ws.on("open", () => {
  send({ type: "HELLO", address });
  expect("HELLO_ACK", () => {
    send({ type: "PRACTICE_CHALLENGE", address });
    expect("ROOM_CREATED", (m) => {
      matchRoom = m.room.roomId;
      expect("MATCH_STARTED", () => {
        expect("PRACTICE_STATE", (state) => {
          if (state.hand.length !== 3) fail("hand must have 3 cards");
          if (state.round !== 1) fail("expected round 1");
          send({ type: "DECK_LOCKED", address, deckDefIds: deck });
          expect("PRACTICE_STATE", () => playRound(1));
        });
      });
    });
  });
});

function playRound(round) {
  if (round > 3) return fail("match did not finish within 3 rounds");
  send({ type: "ROUND_COMMIT", address, round, slot: ((round - 1) % 3) + 1, energy: round === 3 ? 4 : 2 });

  expect("ROUND_RESOLVED", (m) => {
    if (m.resolution.round !== round) fail(`resolution round mismatch: ${m.resolution.round}`);
    log.push(`     r${round}: winner=${m.resolution.winner} powerA=${m.resolution.powerA} powerB=${m.resolution.powerB} score=${m.resolution.scoreA}-${m.resolution.scoreB}`);
    const done = m.resolution.scoreA >= 2 || m.resolution.scoreB >= 2 || round >= 3;
    if (done) {
      expect("MATCH_FINISHED", (f) => {
        log.push(`     final: ${f.scoreA}-${f.scoreB} winner=${f.winner}`);
        if (matchRoom === null) fail("no room");
        pass();
      });
    } else {
      expect("PRACTICE_STATE", (s) => {
        if (s.round !== round + 1) fail(`expected round ${round + 1}, got ${s.round}`);
        playRound(round + 1);
      });
    }
  });
}

ws.on("error", (e) => fail(`ws error: ${e.message}`));
timer = setTimeout(() => fail("timeout"), 30000);
