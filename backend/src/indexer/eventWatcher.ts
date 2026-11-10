import { ethers } from "ethers";

export interface IndexerConfig {
  rpcUrl: string;
  duelEngineAddress: string;
}

export class EventWatcher {
  private provider: ethers.JsonRpcProvider;
  private duelEngineAddress: string;

  constructor(config: IndexerConfig) {
    this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
    this.duelEngineAddress = config.duelEngineAddress;
  }

  public async startListening(onEvent: (name: string, payload: any) => void) {
    console.log(`[EventWatcher] Listening to Sepolia contracts at ${this.duelEngineAddress}...`);
    // Sample heartbeat / poll mechanism for demonstration
    setInterval(async () => {
      try {
        const blockNumber = await this.provider.getBlockNumber();
        onEvent("BlockHeartbeat", { blockNumber, timestamp: Date.now() });
      } catch (err) {
        // Silent error for testnet jitter
      }
    }, 15000);
  }
}
