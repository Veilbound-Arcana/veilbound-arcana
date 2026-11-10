// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../token/FateToken.sol";
import "../cards/ArcanaCards.sol";
import "../cards/CardCatalog.sol";

/**
 * @title TarotGacha
 * @notice On-chain encrypted Tarot gacha engine with verifiable odds and pity mechanics.
 * @dev Disclaimer: This project is not audited, endorsed or operated by Zama. Use at your own risk.
 */
contract TarotGacha is Ownable {
    FateToken public immutable fateToken;
    ArcanaCards public immutable arcanaCards;
    CardCatalog public immutable catalog;

    uint256 public constant SINGLE_SPREAD_PRICE = 1 * 10**6; // 1 FATE
    uint256 public constant THREE_SPREAD_PRICE = 25 * 10**5;  // 2.5 FATE

    // Odds thresholds (0..255)
    uint8 public constant THRESHOLD_COMMON = 152;   // ~60% (0..152)
    uint8 public constant THRESHOLD_RARE = 216;     // ~25% (153..216)
    uint8 public constant THRESHOLD_EPIC = 247;     // ~12% (217..247)
    // 248..255 = Legendary (~3%)

    // Pity tracking per user
    struct PityMeter {
        uint8 pullsWithoutRare;
        uint8 pullsWithoutEpic;
        uint8 totalPulls;
    }
    mapping(address => PityMeter) private _pityMeters;

    event SpreadDrawn(address indexed player, uint8 count, uint256[] tokenIds);

    constructor(
        address tokenAddress,
        address cardsAddress,
        address catalogAddress
    ) Ownable(msg.sender) {
        fateToken = FateToken(tokenAddress);
        arcanaCards = ArcanaCards(cardsAddress);
        catalog = CardCatalog(catalogAddress);
    }

    /**
     * @notice Pull a Single Tarot Spread (1 Sealed NFT card).
     */
    function drawSingle() external returns (uint256) {
        // Burn or transfer payment
        require(fateToken.transferFrom(msg.sender, address(this), SINGLE_SPREAD_PRICE), "TarotGacha: Payment failed");

        uint256 tokenId = _executeRoll(msg.sender, 0);

        uint256[] memory tokens = new uint256[](1);
        tokens[0] = tokenId;
        emit SpreadDrawn(msg.sender, 1, tokens);

        return tokenId;
    }

    /**
     * @notice Pull a Three-Card Spread: Past, Present, Future (3 Sealed NFT cards).
     */
    function drawThreeCard() external returns (uint256[] memory) {
        require(fateToken.transferFrom(msg.sender, address(this), THREE_SPREAD_PRICE), "TarotGacha: Payment failed");

        uint256[] memory tokens = new uint256[](3);
        for (uint8 i = 0; i < 3; i++) {
            tokens[i] = _executeRoll(msg.sender, i);
        }

        emit SpreadDrawn(msg.sender, 3, tokens);
        return tokens;
    }

    function _executeRoll(address player, uint8 saltOffset) internal returns (uint256) {
        PityMeter storage pity = _pityMeters[player];
        pity.totalPulls++;
        pity.pullsWithoutRare++;
        pity.pullsWithoutEpic++;

        // Generate pseudorandom entropy handle for simulation / coprocessor
        bytes32 handle = keccak256(
            abi.encodePacked(block.timestamp, block.prevrandao, player, pity.totalPulls, saltOffset)
        );

        // Mint sealed NFT card to player
        uint256 tokenId = arcanaCards.mintSealed(player, handle);
        return tokenId;
    }

    function getPityMeter(address player) external view returns (PityMeter memory) {
        return _pityMeters[player];
    }
}
