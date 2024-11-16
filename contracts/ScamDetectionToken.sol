// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ScamDetectionToken is ERC20, Ownable, ReentrancyGuard {
    // Reward amount per successful scam detection (in tokens)
    uint256 public rewardAmount;
    
    // Mapping to track authorized backends that can call reward function
    mapping(address => bool) public authorizedBackends;
    
    // Events
    event RewardIssued(address indexed user, uint256 amount);
    event BackendAuthorized(address indexed backend);
    event BackendDeauthorized(address indexed backend);
    event RewardAmountUpdated(uint256 newAmount);

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint256 _rewardAmount
    ) ERC20(name, symbol) Ownable(msg.sender) {
        _mint(msg.sender, initialSupply * 10 ** decimals());
        rewardAmount = _rewardAmount;
    }

    // Modifier to check if caller is authorized backend
    modifier onlyAuthorizedBackend() {
        require(authorizedBackends[msg.sender], "Caller is not authorized backend");
        _;
    }

    // Function to authorize new backend
    function authorizeBackend(address backend) external onlyOwner {
        require(backend != address(0), "Invalid backend address");
        require(!authorizedBackends[backend], "Backend already authorized");
        authorizedBackends[backend] = true;
        emit BackendAuthorized(backend);
    }

    // Function to deauthorize backend
    function deauthorizeBackend(address backend) external onlyOwner {
        require(authorizedBackends[backend], "Backend not authorized");
        authorizedBackends[backend] = false;
        emit BackendDeauthorized(backend);
    }

    // Function to update reward amount
    function setRewardAmount(uint256 newAmount) external onlyOwner {
        rewardAmount = newAmount;
        emit RewardAmountUpdated(newAmount);
    }

    // Function to reward user for scam detection
    function rewardUser(address user) external nonReentrant onlyAuthorizedBackend {
        require(user != address(0), "Invalid user address");
        require(balanceOf(owner()) >= rewardAmount, "Insufficient reward tokens");
        
        // Transfer reward from contract owner to user
        _transfer(owner(), user, rewardAmount);
        
        emit RewardIssued(user, rewardAmount);
    }

    // Function to recover tokens accidentally sent to contract
    function recoverTokens(IERC20 token) external onlyOwner {
        require(address(token) != address(this), "Cannot recover reward token");
        uint256 balance = token.balanceOf(address(this));
        require(balance > 0, "No tokens to recover");
        token.transfer(owner(), balance);
    }
}