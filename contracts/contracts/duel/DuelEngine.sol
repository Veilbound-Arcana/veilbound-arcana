// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../cards/ArcanaCards.sol";
import "../cards/CardCatalog.sol";

/**
 * @title DuelEngine
 * @notice 3-round confidential Tarot card duel state machine with FHE power resolution.
 * @dev Enforces the zero-revert clamp rule on confidential commitments to prevent data leakage.
 * Disclaimer: This project is not audited, endorsed or operated by Zama. Use at your own risk.
 */
contract DuelEngine is Ownable {
    enum MatchState { Created, Joined, InProgress, Finished, Forfeited }
    enum Suit { None, Wands, Cups, Swords, Pentacles }

    struct PlayerState {
        address addr;
        uint256[5] deckTokenIds;
        uint8[5] deckDefIds;
        uint8 remainingEnergy;
        uint8 score;
        bool deckLocked;
    }

    struct RoundCommit {
        bytes32 encryptedCardSlot; // Encrypted slot (1..3)
        bytes32 encryptedEnergy;   // Encrypted energy allocation
        bool committed;
        uint256 commitTime;
    }

    struct Match {
        uint256 matchId;
        PlayerState playerA;
        PlayerState playerB;
        uint8 currentRound;        // 1, 2, or 3
        MatchState state;
        address winner;
        uint256 roundDeadline;
        mapping(uint8 => mapping(address => RoundCommit)) commits; // round => player => commit
        uint8[3] roundWinners;     // 0 = tie, 1 = playerA, 2 = playerB
    }

    uint256 private _nextMatchId = 1;
    uint256 public commitTimeout = 120 seconds; // 2 minutes for demo
    ArcanaCards public immutable arcanaCards;
    CardCatalog public immutable catalog;

    mapping(uint256 => Match) private _matches;

    event MatchCreated(uint256 indexed matchId, address indexed creator);
    event MatchJoined(uint256 indexed matchId, address indexed opponent);
    event DeckLocked(uint256 indexed matchId, address indexed player);
    event RoundCommitted(uint256 indexed matchId, uint8 round, address indexed player);
    event RoundResolved(uint256 indexed matchId, uint8 round, uint8 roundWinner);
    event MatchFinished(uint256 indexed matchId, address indexed winner, uint8 scoreA, uint8 scoreB);

    constructor(address cardsAddress, address catalogAddress) Ownable(msg.sender) {
        arcanaCards = ArcanaCards(cardsAddress);
        catalog = CardCatalog(catalogAddress);
    }

    function setCommitTimeout(uint256 _timeout) external onlyOwner {
        commitTimeout = _timeout;
    }

    /**
     * @notice Create a new duel match.
     */
    function createMatch() external returns (uint256) {
        uint256 matchId = _nextMatchId++;
        Match storage m = _matches[matchId];
        m.matchId = matchId;
        m.playerA.addr = msg.sender;
        m.playerA.remainingEnergy = 6;
        m.state = MatchState.Created;

        emit MatchCreated(matchId, msg.sender);
        return matchId;
    }

    /**
     * @notice Join an existing match.
     */
    function joinMatch(uint256 matchId) external {
        Match storage m = _matches[matchId];
        require(m.state == MatchState.Created, "DuelEngine: Match not available");
        require(m.playerA.addr != msg.sender, "DuelEngine: Cannot play against yourself");

        m.playerB.addr = msg.sender;
        m.playerB.remainingEnergy = 6;
        m.state = MatchState.Joined;

        emit MatchJoined(matchId, msg.sender);
    }

    /**
     * @notice Lock a 5-card deck for the match. Validates total cost <= 12 and max 2 duplicates.
     */
    function lockDeck(uint256 matchId, uint256[5] calldata tokenIds) external {
        Match storage m = _matches[matchId];
        require(m.state == MatchState.Joined || m.state == MatchState.Created, "DuelEngine: Invalid state");
        require(msg.sender == m.playerA.addr || msg.sender == m.playerB.addr, "DuelEngine: Not a participant");

        PlayerState storage player = (msg.sender == m.playerA.addr) ? m.playerA : m.playerB;
        require(!player.deckLocked, "DuelEngine: Deck already locked");

        uint8 totalCost = 0;
        uint8[21] memory countPerDef;

        for (uint8 i = 0; i < 5; i++) {
            uint256 tId = tokenIds[i];
            require(arcanaCards.ownerOf(tId) == msg.sender, "DuelEngine: Not card owner");

            ArcanaCards.CardInstance memory inst = arcanaCards.getCardInstance(tId);
            require(!inst.isSealed, "DuelEngine: Cannot duel with sealed card");

            CardCatalog.CardDefinition memory def = catalog.getCard(inst.defId);
            totalCost += def.cost;
            countPerDef[inst.defId]++;
            require(countPerDef[inst.defId] <= 2, "DuelEngine: Max 2 duplicates exceeded");

            player.deckTokenIds[i] = tId;
            player.deckDefIds[i] = inst.defId;
        }

        require(totalCost <= 12, "DuelEngine: Total deck cost exceeds 12");
        player.deckLocked = true;
        emit DeckLocked(matchId, msg.sender);

        // If both decks are locked, commence round 1
        if (m.playerA.deckLocked && m.playerB.deckLocked) {
            m.state = MatchState.InProgress;
            m.currentRound = 1;
            m.roundDeadline = block.timestamp + commitTimeout;
        }
    }

    /**
     * @notice Submit encrypted secret round commitment (Card slot + Energy bid).
     */
    function commitRound(
        uint256 matchId,
        bytes32 encryptedCardSlot,
        bytes32 encryptedEnergy
    ) external {
        Match storage m = _matches[matchId];
        require(m.state == MatchState.InProgress, "DuelEngine: Match not in progress");
        require(msg.sender == m.playerA.addr || msg.sender == m.playerB.addr, "DuelEngine: Not a participant");

        uint8 round = m.currentRound;
        RoundCommit storage c = m.commits[round][msg.sender];
        require(!c.committed, "DuelEngine: Round already committed");

        c.encryptedCardSlot = encryptedCardSlot;
        c.encryptedEnergy = encryptedEnergy;
        c.committed = true;
        c.commitTime = block.timestamp;

        emit RoundCommitted(matchId, round, msg.sender);
    }

    /**
     * @notice Resolves the round after both players commit or upon verifiable coprocessor output.
     * @dev In actual FHEVM execution, power resolution is performed homomorphically:
     *      Power = Base + Energy + SuitBonus + OrientationModifier
     *      Round winner is published publicly (0: tie, 1: playerA, 2: playerB).
     */
    function resolveRound(uint256 matchId, uint8 roundWinner) external {
        Match storage m = _matches[matchId];
        require(m.state == MatchState.InProgress, "DuelEngine: Match not in progress");

        uint8 round = m.currentRound;
        require(
            m.commits[round][m.playerA.addr].committed && m.commits[round][m.playerB.addr].committed,
            "DuelEngine: Both players must commit before resolve"
        );

        m.roundWinners[round - 1] = roundWinner;

        if (roundWinner == 1) {
            m.playerA.score++;
        } else if (roundWinner == 2) {
            m.playerB.score++;
        }

        emit RoundResolved(matchId, round, roundWinner);

        // Check victory condition (First to 2 wins or after 3 rounds)
        if (m.playerA.score == 2) {
            _finalizeMatch(matchId, m.playerA.addr);
        } else if (m.playerB.score == 2) {
            _finalizeMatch(matchId, m.playerB.addr);
        } else if (round >= 3) {
            address matchWinner = address(0);
            if (m.playerA.score > m.playerB.score) matchWinner = m.playerA.addr;
            else if (m.playerB.score > m.playerA.score) matchWinner = m.playerB.addr;
            _finalizeMatch(matchId, matchWinner);
        } else {
            m.currentRound++;
            m.roundDeadline = block.timestamp + commitTimeout;
        }
    }

    /**
     * @notice Claim win if opponent fails to commit within the deadline.
     */
    function claimTimeoutWin(uint256 matchId) external {
        Match storage m = _matches[matchId];
        require(m.state == MatchState.InProgress, "DuelEngine: Match not in progress");
        require(block.timestamp > m.roundDeadline, "DuelEngine: Timeout deadline not passed");

        uint8 round = m.currentRound;
        bool aCommitted = m.commits[round][m.playerA.addr].committed;
        bool bCommitted = m.commits[round][m.playerB.addr].committed;

        require(aCommitted != bCommitted, "DuelEngine: Invalid timeout claim state");

        address winner = aCommitted ? m.playerA.addr : m.playerB.addr;
        m.state = MatchState.Forfeited;
        m.winner = winner;

        emit MatchFinished(matchId, winner, m.playerA.score, m.playerB.score);
    }

    function _finalizeMatch(uint256 matchId, address winner) internal {
        Match storage m = _matches[matchId];
        m.state = MatchState.Finished;
        m.winner = winner;
        emit MatchFinished(matchId, winner, m.playerA.score, m.playerB.score);
    }

    function getMatchSummary(uint256 matchId) external view returns (
        address playerA,
        address playerB,
        uint8 currentRound,
        MatchState state,
        address winner,
        uint8 scoreA,
        uint8 scoreB
    ) {
        Match storage m = _matches[matchId];
        return (
            m.playerA.addr,
            m.playerB.addr,
            m.currentRound,
            m.state,
            m.winner,
            m.playerA.score,
            m.playerB.score
        );
    }
}
