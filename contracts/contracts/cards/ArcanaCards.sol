// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CardCatalog.sol";

/**
 * @title ArcanaCards
 * @notice ERC-721 NFT contract representing Tarot cards with Sealed and Unsealed lifecycle states.
 * @dev Sealed cards hold confidential identities and cannot be transferred until unsealed by the owner.
 * Disclaimer: This project is not audited, endorsed or operated by Zama. Use at your own risk.
 */
contract ArcanaCards is ERC721, Ownable {
    struct CardInstance {
        uint256 tokenId;
        bool isSealed;
        uint8 defId; // 0 if sealed, 1..20 if unsealed
        uint256 drawnAt;
    }

    uint256 private _nextTokenId = 1;
    CardCatalog public immutable catalog;
    address public gachaContract;

    mapping(uint256 => CardInstance) private _cardInstances;
    // Maps tokenId to encrypted ciphertext handle/hash for off-chain decryption verification
    mapping(uint256 => bytes32) private _sealedHandles;

    event CardDrawn(address indexed owner, uint256 indexed tokenId, bool isSealed);
    event CardUnsealed(address indexed owner, uint256 indexed tokenId, uint8 defId);

    modifier onlyGacha() {
        require(msg.sender == gachaContract || msg.sender == owner(), "ArcanaCards: Unauthorized minter");
        _;
    }

    constructor(address catalogAddress) ERC721("Veilbound Arcana Cards", "ARCANA") Ownable(msg.sender) {
        require(catalogAddress != address(0), "ArcanaCards: Invalid catalog address");
        catalog = CardCatalog(catalogAddress);
    }

    function setGachaContract(address _gachaContract) external onlyOwner {
        require(_gachaContract != address(0), "ArcanaCards: Invalid gacha address");
        gachaContract = _gachaContract;
    }

    /**
     * @notice Mints a new Sealed card NFT directly to the player.
     * @param to Recipient address
     * @param sealedHandle Encrypted handle identifier under FHEVM
     */
    function mintSealed(address to, bytes32 sealedHandle) external onlyGacha returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _cardInstances[tokenId] = CardInstance({
            tokenId: tokenId,
            isSealed: true,
            defId: 0,
            drawnAt: block.timestamp
        });
        _sealedHandles[tokenId] = sealedHandle;

        _safeMint(to, tokenId);
        emit CardDrawn(to, tokenId, true);
        return tokenId;
    }

    /**
     * @notice Unseals a card instance, converting its confidential identity into a public verifiable state.
     * @param tokenId The NFT token ID to unseal
     * @param revealedDefId The decrypted card definition ID (1..20)
     */
    function unseal(uint256 tokenId, uint8 revealedDefId) external {
        require(ownerOf(tokenId) == msg.sender, "ArcanaCards: Not card owner");
        CardInstance storage card = _cardInstances[tokenId];
        require(card.isSealed, "ArcanaCards: Card already unsealed");
        require(revealedDefId >= 1 && revealedDefId <= catalog.TOTAL_CARDS(), "ArcanaCards: Invalid defId");

        card.isSealed = false;
        card.defId = revealedDefId;

        emit CardUnsealed(msg.sender, tokenId, revealedDefId);
    }

    function getCardInstance(uint256 tokenId) external view returns (CardInstance memory) {
        _requireOwned(tokenId);
        return _cardInstances[tokenId];
    }

    function getSealedHandle(uint256 tokenId) external view returns (bytes32) {
        _requireOwned(tokenId);
        return _sealedHandles[tokenId];
    }

    /**
     * @dev Enforces that Sealed cards cannot be transferred to maintain FHE ACL consistency.
     */
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = super._update(to, tokenId, auth);
        if (from != address(0) && to != address(0)) {
            require(!_cardInstances[tokenId].isSealed, "ArcanaCards: Sealed cards cannot be transferred");
        }
        return from;
    }
}
