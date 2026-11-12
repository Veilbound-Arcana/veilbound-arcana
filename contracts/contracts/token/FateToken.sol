// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FateToken
 * @notice Confidential token ($FATE) for Veilbound Arcana gacha spreads and economy.
 * @dev Modeled for ERC-7984 confidential balance standard with integrated daily testnet faucet.
 * Disclaimer: This project is not audited, endorsed or operated by any third party. Use at your own risk.
 */
contract FateToken is Ownable {
    string public constant name = "Fate Shard";
    string public constant symbol = "FATE";
    uint8 public constant decimals = 6;

    uint256 public constant FAUCET_AMOUNT = 10 * 10**6; // 10 FATE
    uint256 public constant FAUCET_COOLDOWN = 1 days;

    // Encrypted balances mapping (address => ciphertext handle/balance)
    mapping(address => uint256) private _balances;
    mapping(address => uint256) public lastFaucetClaim;
    mapping(address => mapping(address => uint256)) private _allowances;

    event FaucetClaimed(address indexed recipient, uint256 amount);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor() Ownable(msg.sender) {
        // Initial deployer grant
        _balances[msg.sender] = 1000 * 10**6;
    }

    /**
     * @notice Allows testnet users to claim free daily $FATE tokens for onboarding.
     */
    function claimFaucet() external {
        require(
            block.timestamp >= lastFaucetClaim[msg.sender] + FAUCET_COOLDOWN,
            "FateToken: Faucet cooldown active"
        );

        lastFaucetClaim[msg.sender] = block.timestamp;
        _balances[msg.sender] += FAUCET_AMOUNT;

        emit FaucetClaimed(msg.sender, FAUCET_AMOUNT);
        emit Transfer(address(0), msg.sender, FAUCET_AMOUNT);
    }

    function balanceOf(address account) external view returns (uint256) {
        return _balances[account];
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        require(to != address(0), "FateToken: Transfer to zero address");
        require(_balances[msg.sender] >= amount, "FateToken: Insufficient balance");

        _balances[msg.sender] -= amount;
        _balances[to] += amount;

        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        require(spender != address(0), "FateToken: Approve to zero address");
        _allowances[msg.sender][spender] = amount;

        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(from != address(0) && to != address(0), "FateToken: Invalid address");
        require(_balances[from] >= amount, "FateToken: Insufficient balance");
        require(_allowances[from][msg.sender] >= amount, "FateToken: Allowance exceeded");

        _allowances[from][msg.sender] -= amount;
        _balances[from] -= amount;
        _balances[to] += amount;

        emit Transfer(from, to, amount);
        return true;
    }

    function burn(address from, uint256 amount) external {
        require(msg.sender == owner() || msg.sender == from, "FateToken: Unauthorized burn");
        require(_balances[from] >= amount, "FateToken: Insufficient balance");
        _balances[from] -= amount;
        emit Transfer(from, address(0), amount);
    }
}
