// SPDX-License-Identifier: GPL-3.0-only

pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {DataTypes as dt} from "./DataTypes.sol";
import "../safeguard/Pauser.sol";
import "./Staking.sol";

/**
 * @title A contract to hold and distribute XQST staking rewards.
 */
contract StakingReward is ReentrancyGuard, Pauser {
    using SafeERC20 for IERC20;

    Staking public immutable staking;

    // recipient => XQST reward amount
    mapping(address => uint256) public claimedRewardAmounts;

    event StakingRewardClaimed(address indexed recipient, uint256 reward);
    event StakingRewardContributed(address indexed contributor, uint256 contribution);

    constructor(Staking _staking) {
        staking = _staking;
    }

    /**
     * @notice Claim reward
     * @dev Here we use cumulative reward to make claim process idempotent
     * @param _rewardRequest reward request bytes coded in protobuf
     * @param _sigs list of validator signatures
     */
    function claimReward(bytes calldata _rewardRequest, bytes[] calldata _sigs) external nonReentrant whenNotPaused {
        bytes32 domain = keccak256(abi.encodePacked(block.chainid, address(this), "StakingReward"));
        staking.verifySignatures(abi.encodePacked(domain, _rewardRequest), _sigs);
        PbStaking.StakingReward memory reward = PbStaking.decStakingReward(_rewardRequest);

        uint256 cumulativeRewardAmount = reward.cumulativeRewardAmount;
        uint256 newReward = cumulativeRewardAmount - claimedRewardAmounts[reward.recipient];
        require(newReward > 0, "No new reward");
        claimedRewardAmounts[reward.recipient] = cumulativeRewardAmount;
        staking.XQUBESWAP_TOKEN().safeTransfer(reward.recipient, newReward);
        emit StakingRewardClaimed(reward.recipient, newReward);
    }

    /**
     * @notice Contribute XQST tokens to the reward pool
     * @param _amount the amount of XQST token to contribute
     */
    function contributeToRewardPool(uint256 _amount) external nonReentrant whenNotPaused {
        address contributor = msg.sender;
        IERC20(staking.XQUBESWAP_TOKEN()).safeTransferFrom(contributor, address(this), _amount);

        emit StakingRewardContributed(contributor, _amount);
    }

    /**
     * @notice Owner drains XQST tokens when the contract is paused
     * @dev emergency use only
     * @param _amount drained XQST token amount
     */
    function drainToken(uint256 _amount) external whenPaused onlyOwner {
        IERC20(staking.XQUBESWAP_TOKEN()).safeTransfer(msg.sender, _amount);
    }
}
