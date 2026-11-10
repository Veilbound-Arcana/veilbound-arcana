// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "../cards/ArcanaCards.sol";

/**
 * @title Market
 * @notice Atomic 1-to-1 card swap escrow for Veilbound Arcana NFTs.
 * @dev Disclaimer: This project is not audited, endorsed or operated by Zama. Use at your own risk.
 */
contract Market is Ownable, IERC721Receiver {
    ArcanaCards public immutable arcanaCards;

    struct SwapOffer {
        uint256 offerId;
        address initiator;
        uint256 offeredTokenId;
        uint256 desiredTokenId;
        bool active;
    }

    uint256 private _nextOfferId = 1;
    mapping(uint256 => SwapOffer) private _offers;

    event SwapCreated(uint256 indexed offerId, address indexed initiator, uint256 offeredTokenId, uint256 desiredTokenId);
    event SwapAccepted(uint256 indexed offerId, address indexed counterparty);
    event SwapCancelled(uint256 indexed offerId);

    constructor(address cardsAddress) Ownable(msg.sender) {
        arcanaCards = ArcanaCards(cardsAddress);
    }

    function createSwapOffer(uint256 offeredTokenId, uint256 desiredTokenId) external returns (uint256) {
        require(arcanaCards.ownerOf(offeredTokenId) == msg.sender, "Market: Not owner of offered card");
        ArcanaCards.CardInstance memory offered = arcanaCards.getCardInstance(offeredTokenId);
        require(!offered.isSealed, "Market: Cannot trade sealed card");

        uint256 offerId = _nextOfferId++;
        _offers[offerId] = SwapOffer({
            offerId: offerId,
            initiator: msg.sender,
            offeredTokenId: offeredTokenId,
            desiredTokenId: desiredTokenId,
            active: true
        });

        arcanaCards.safeTransferFrom(msg.sender, address(this), offeredTokenId);
        emit SwapCreated(offerId, msg.sender, offeredTokenId, desiredTokenId);
        return offerId;
    }

    function acceptSwapOffer(uint256 offerId) external {
        SwapOffer storage offer = _offers[offerId];
        require(offer.active, "Market: Offer not active");
        require(arcanaCards.ownerOf(offer.desiredTokenId) == msg.sender, "Market: Counterparty lacks required token");

        ArcanaCards.CardInstance memory desired = arcanaCards.getCardInstance(offer.desiredTokenId);
        require(!desired.isSealed, "Market: Cannot trade sealed card");

        offer.active = false;

        // Atomic swap execution
        arcanaCards.safeTransferFrom(msg.sender, offer.initiator, offer.desiredTokenId);
        arcanaCards.safeTransferFrom(address(this), msg.sender, offer.offeredTokenId);

        emit SwapAccepted(offerId, msg.sender);
    }

    function cancelSwapOffer(uint256 offerId) external {
        SwapOffer storage offer = _offers[offerId];
        require(offer.active, "Market: Offer not active");
        require(offer.initiator == msg.sender, "Market: Not offer creator");

        offer.active = false;
        arcanaCards.safeTransferFrom(address(this), msg.sender, offer.offeredTokenId);

        emit SwapCancelled(offerId);
    }

    function onERC721Received(address, address, uint256, bytes calldata) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
