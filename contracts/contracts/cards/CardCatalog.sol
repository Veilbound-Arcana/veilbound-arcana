// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title CardCatalog
 * @notice Immutable catalog containing official definitions for Veilbound Arcana's 20 MVP Tarot cards.
 * @dev Disclaimer: This project is not audited, endorsed or operated by any third party. Use at your own risk.
 */
contract CardCatalog {
    enum Suit { None, Wands, Cups, Swords, Pentacles }
    enum Arcana { Minor, Major }
    enum Rarity { Common, Rare, Epic, Legendary }

    struct CardDefinition {
        uint8 id;
        string name;
        Suit suit;
        Arcana arcana;
        Rarity rarity;
        uint8 cost;
        uint8 basePower;
        uint8 abilityId;
    }

    mapping(uint8 => CardDefinition) private _cards;
    uint8 public constant TOTAL_CARDS = 20;

    constructor() {
        _registerCards();
    }

    function getCard(uint8 cardId) external view returns (CardDefinition memory) {
        require(cardId >= 1 && cardId <= TOTAL_CARDS, "CardCatalog: Invalid card ID");
        return _cards[cardId];
    }

    function getCards(uint8[] calldata cardIds) external view returns (CardDefinition[] memory) {
        CardDefinition[] memory result = new CardDefinition[](cardIds.length);
        for (uint256 i = 0; i < cardIds.length; i++) {
            require(cardIds[i] >= 1 && cardIds[i] <= TOTAL_CARDS, "CardCatalog: Invalid card ID");
            result[i] = _cards[cardIds[i]];
        }
        return result;
    }

    function _registerCards() private {
        // Wands (Fire)
        _cards[1] = CardDefinition(1, "Page of Wands", Suit.Wands, Arcana.Minor, Rarity.Common, 1, 2, 0);
        _cards[2] = CardDefinition(2, "Knight of Wands", Suit.Wands, Arcana.Minor, Rarity.Common, 1, 2, 0);
        _cards[3] = CardDefinition(3, "Queen of Wands", Suit.Wands, Arcana.Minor, Rarity.Rare, 2, 3, 0);
        _cards[4] = CardDefinition(4, "King of Wands", Suit.Wands, Arcana.Minor, Rarity.Epic, 3, 4, 0);

        // Cups (Water)
        _cards[5] = CardDefinition(5, "Page of Cups", Suit.Cups, Arcana.Minor, Rarity.Common, 1, 2, 0);
        _cards[6] = CardDefinition(6, "Knight of Cups", Suit.Cups, Arcana.Minor, Rarity.Common, 1, 2, 0);
        _cards[7] = CardDefinition(7, "Queen of Cups", Suit.Cups, Arcana.Minor, Rarity.Rare, 2, 3, 0);
        _cards[8] = CardDefinition(8, "King of Cups", Suit.Cups, Arcana.Minor, Rarity.Epic, 3, 4, 0);

        // Swords (Air)
        _cards[9] = CardDefinition(9, "Page of Swords", Suit.Swords, Arcana.Minor, Rarity.Common, 1, 2, 0);
        _cards[10] = CardDefinition(10, "Knight of Swords", Suit.Swords, Arcana.Minor, Rarity.Common, 1, 2, 0);
        _cards[11] = CardDefinition(11, "Queen of Swords", Suit.Swords, Arcana.Minor, Rarity.Rare, 2, 3, 0);
        _cards[12] = CardDefinition(12, "King of Swords", Suit.Swords, Arcana.Minor, Rarity.Epic, 3, 4, 0);

        // Pentacles (Earth)
        _cards[13] = CardDefinition(13, "Page of Pentacles", Suit.Pentacles, Arcana.Minor, Rarity.Common, 1, 2, 0);
        _cards[14] = CardDefinition(14, "Knight of Pentacles", Suit.Pentacles, Arcana.Minor, Rarity.Common, 1, 2, 0);
        _cards[15] = CardDefinition(15, "Queen of Pentacles", Suit.Pentacles, Arcana.Minor, Rarity.Rare, 2, 3, 0);
        _cards[16] = CardDefinition(16, "King of Pentacles", Suit.Pentacles, Arcana.Minor, Rarity.Epic, 3, 4, 0);

        // Major Arcana (Legendary)
        _cards[17] = CardDefinition(17, "0 - The Fool", Suit.None, Arcana.Major, Rarity.Legendary, 4, 5, 0);
        _cards[18] = CardDefinition(18, "I - The Magician", Suit.None, Arcana.Major, Rarity.Legendary, 4, 5, 0);
        _cards[19] = CardDefinition(19, "II - High Priestess", Suit.None, Arcana.Major, Rarity.Legendary, 4, 5, 0);
        _cards[20] = CardDefinition(20, "XXI - The World", Suit.None, Arcana.Major, Rarity.Legendary, 4, 5, 0);
    }
}
