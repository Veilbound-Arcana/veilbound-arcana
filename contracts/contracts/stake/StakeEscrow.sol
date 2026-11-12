// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "../cards/ArcanaCards.sol";
import "../cards/CardCatalog.sol";

/**
 * @title StakeEscrow
 * @notice Optional Ante-mode staking escrow for wagering 1 NFT per duel with tier matching.
 * @dev Disclaimer: This project is not audited, endorsed or operated by any third party. Use at your own risk.
 */
contract StakeEscrow is Ownable, IERC721Receiver {
    ArcanaCards public immutable arcanaCards;
    CardCatalog public immutable catalog;
    address public duelEngine;
    bool public stakeEnabled = true;

    struct StakeRecord {
        uint256 matchId;
        address playerA;
        address playerB;
        uint256 tokenA;
        uint256 tokenB;
        bool locked;
        bool settled;
    }

    mapping(uint256 => StakeRecord) private _stakes;

    event StakeDeposited(uint256 indexed matchId, address indexed player, uint256 tokenId);
    event StakeSettled(uint256 indexed matchId, address indexed winner, uint256 tokenWon);
    event StakeRefunded(uint256 indexed matchId);

    modifier onlyDuelEngine() {
        require(msg.sender == duelEngine || msg.sender == owner(), "StakeEscrow: Unauthorized");
        _;
    }

    constructor(address cardsAddress, address catalogAddress) Ownable(msg.sender) {
        arcanaCards = ArcanaCards(cardsAddress);
        catalog = CardCatalog(catalogAddress);
    }

    function setDuelEngine(address _duelEngine) external onlyOwner {
        duelEngine = _duelEngine;
    }

    function setStakeEnabled(bool enabled) external onlyOwner {
        stakeEnabled = enabled;
    }

    /**
     * @notice Deposit an NFT card into Ante stake escrow.
     */
    function depositStake(uint256 matchId, uint256 tokenId) external {
        require(stakeEnabled, "StakeEscrow: Staking is disabled");
        require(arcanaCards.ownerOf(tokenId) == msg.sender, "StakeEscrow: Not token owner");

        ArcanaCards.CardInstance memory card = arcanaCards.getCardInstance(tokenId);
        require(!card.isSealed, "StakeEscrow: Cannot stake sealed card");

        StakeRecord storage s = _stakes[matchId];
        require(!s.locked, "StakeEscrow: Stake already locked");

        if (s.playerA == address(0)) {
            s.matchId = matchId;
            s.playerA = msg.sender;
            s.tokenA = tokenId;
        } else if (s.playerB == address(0)) {
            require(s.playerA != msg.sender, "StakeEscrow: Cannot play against yourself");

            // Tier matching guard (Max 1 rarity difference)
            ArcanaCards.CardInstance memory cardA = arcanaCards.getCardInstance(s.tokenA);
            CardCatalog.CardDefinition memory defA = catalog.getCard(cardA.defId);
            CardCatalog.CardDefinition memory defB = catalog.getCard(card.defId);

            uint8 tierA = uint8(defA.rarity);
            uint8 tierB = uint8(defB.rarity);
            uint8 diff = tierA > tierB ? tierA - tierB : tierB - tierA;
            require(diff <= 1, "StakeEscrow: Rarity tier difference exceeds 1");

            s.playerB = msg.sender;
            s.tokenB = tokenId;
            s.locked = true;
        } else {
            revert("StakeEscrow: Stake slot full");
        }

        arcanaCards.safeTransferFrom(msg.sender, address(this), tokenId);
        emit StakeDeposited(matchId, msg.sender, tokenId);
    }

    /**
     * @notice Settle the stake escrow based on duel outcome.
     */
    function settleStake(uint256 matchId, address winner) external onlyDuelEngine {
        StakeRecord storage s = _stakes[matchId];
        require(s.locked && !s.settled, "StakeEscrow: Invalid stake state");
        s.settled = true;

        if (winner == s.playerA) {
            arcanaCards.safeTransferFrom(address(this), s.playerA, s.tokenA);
            arcanaCards.safeTransferFrom(address(this), s.playerA, s.tokenB);
            emit StakeSettled(matchId, s.playerA, s.tokenB);
        } else if (winner == s.playerB) {
            arcanaCards.safeTransferFrom(address(this), s.playerB, s.tokenA);
            arcanaCards.safeTransferFrom(address(this), s.playerB, s.tokenB);
            emit StakeSettled(matchId, s.playerB, s.tokenA);
        } else {
            // Tie or Draw: Refund both cards
            arcanaCards.safeTransferFrom(address(this), s.playerA, s.tokenA);
            arcanaCards.safeTransferFrom(address(this), s.playerB, s.tokenB);
            emit StakeRefunded(matchId);
        }
    }

    function onERC721Received(address, address, uint256, bytes calldata) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
