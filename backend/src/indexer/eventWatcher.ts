import { ethers } from "ethers";
import {
  ARCANA_CARDS_ABI,
  DUEL_ENGINE_ABI,
  FATE_TOKEN_ABI,
  TAROT_GACHA_ABI,
} from "@veilbound/sdk";
import { config } from "../config";

export interface ChainEvent {
  name: string;
  address: string;
  txHash: string;
  blockNumber: number;
  args: Record<string, string | number | boolean>;
}

type EventHandler = (event: ChainEvent) => void;

const TRACKED = [
  { key: "fateToken", address: () => config.fateTokenAddress, abi: FATE_TOKEN_ABI },
  { key: "arcanaCards", address: () => config.arcanaCardsAddress, abi: ARCANA_CARDS_ABI },
  { key: "tarotGacha", address: () => config.tarotGachaAddress, abi: TAROT_GACHA_ABI },
  { key: "duelEngine", address: () => config.duelEngineAddress, abi: DUEL_ENGINE_ABI },
] as const;

/**
 * Lightweight Sepolia event indexer: polls logs for our contracts and fans decoded
 * events out to connected WebSocket clients (CardDrawn, RoundCommitted, ...).
 */
export class EventWatcher {
  private provider: ethers.JsonRpcProvider;
  private handlers: Set<EventHandler> = new Set();
  private timer: NodeJS.Timeout | null = null;
  private lastBlock = 0;
  private running = false;

  constructor(rpcUrl: string = config.rpcUrl) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl, config.chainId);
  }

  public onEvent(handler: EventHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  public async start(intervalMs = 12000): Promise<void> {
    if (this.running) return;
    this.running = true;

    try {
      this.lastBlock = (await this.provider.getBlockNumber()) - 1;
    } catch {
      this.lastBlock = 0;
    }

    console.log(`[EventWatcher] Polling Sepolia from block ${this.lastBlock}...`);
    this.timer = setInterval(() => void this.tick(), intervalMs);
  }

  public stop(): void {
    this.running = false;
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  private async tick(): Promise<void> {
    try {
      const head = await this.provider.getBlockNumber();
      if (head <= this.lastBlock) return;

      const from = this.lastBlock + 1;
      const to = Math.min(head, from + 49); // bounded range per poll

      for (const tracked of TRACKED) {
        const address = tracked.address();
        if (!address) continue;

        const logs = await this.provider.getLogs({
          address,
          fromBlock: from,
          toBlock: to,
        });

        for (const log of logs) {
          try {
            const iface = new ethers.Interface([...tracked.abi]);
            const parsed = iface.parseLog(log);
            if (!parsed) continue;

            const args: Record<string, string | number | boolean> = {};
            parsed.fragment.inputs.forEach((input, i) => {
              const value = parsed.args[i];
              args[input.name || `arg${i}`] = typeof value === "bigint" ? Number(value) : (value as string | number | boolean);
            });

            const event: ChainEvent = {
              name: parsed.name,
              address: log.address,
              txHash: log.transactionHash,
              blockNumber: log.blockNumber,
              args,
            };

            for (const handler of this.handlers) handler(event);
          } catch {
            // Ignore undecodable logs from other contracts at same address.
          }
        }
      }

      this.lastBlock = to;
    } catch (err) {
      // Testnet jitter: keep polling silently, surface only verbose logs.
      if (process.env.DEBUG) console.warn("[EventWatcher]", (err as Error).message);
    }
  }
}
