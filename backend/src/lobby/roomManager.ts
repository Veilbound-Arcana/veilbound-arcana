export interface DuelRoom {
  roomId: string;
  onChainMatchId?: number;
  playerA?: string;
  playerB?: string;
  state: "waiting" | "locked" | "dueling" | "finished";
  createdAt: number;
}

export class RoomManager {
  private rooms: Map<string, DuelRoom> = new Map();

  public createRoom(roomId: string, playerAddress: string): DuelRoom {
    const room: DuelRoom = {
      roomId,
      playerA: playerAddress,
      state: "waiting",
      createdAt: Date.now(),
    };
    this.rooms.set(roomId, room);
    return room;
  }

  public joinRoom(roomId: string, playerAddress: string): DuelRoom | null {
    const room = this.rooms.get(roomId);
    if (!room || room.state !== "waiting" || room.playerA === playerAddress) {
      return null;
    }
    room.playerB = playerAddress;
    room.state = "locked";
    return room;
  }

  public getRoom(roomId: string): DuelRoom | undefined {
    return this.rooms.get(roomId);
  }

  public setOnChainMatchId(roomId: string, matchId: number): void {
    const room = this.rooms.get(roomId);
    if (room) {
      room.onChainMatchId = matchId;
      room.state = "dueling";
    }
  }
}
