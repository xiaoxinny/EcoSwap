import React, { useState } from 'react';
import '../../styles/Rewards.css';

const Rewards = () => {
  const [ecoPoints, setEcoPoints] = useState(940);
  const [claimedTasks, setClaimedTasks] = useState({
    checkIn: false,
    createListing: false,
    shareListing: false,
    inviteFriend: false,
  });

  const [activities, setActivities] = useState([
    { task: 'Placeholder to check', points: 10, date: '23/05/2024' },
    { task: 'Placeholder', points: 10, date: '23/05/2024' },
    { task: 'Placeholder', points: 10, date: '23/05/2024' },
    { task: 'Placeholder', points: 10, date: '23/05/2024' },
  ]);

  const [activeTab, setActiveTab] = useState('tasks');

  const taskDisplayNames = {
    checkIn: 'Check In',
    createListing: 'Created a Listing',
    shareListing: 'Shared a Listing',
    inviteFriend: 'Invited a Friend',
  };

  const handleClaim = (task, points) => {
    if (!claimedTasks[task]) {
      setEcoPoints(ecoPoints + points);
      setClaimedTasks({ ...claimedTasks, [task]: true });
      setActivities([{ task: taskDisplayNames[task], points, date: new Date().toLocaleDateString() }, ...activities]);
    }
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  const handleVoucherClick = (pointsRequired, description) => {
    if (ecoPoints >= pointsRequired) {
      if (window.confirm(`Do you want to redeem ${description} for ${pointsRequired} EcoPoints?`)) {
        setEcoPoints(ecoPoints - pointsRequired);
        setActivities([{ task: `Redeemed ${description}`, points: -pointsRequired, date: new Date().toLocaleDateString() }, ...activities]);
      }
    } else {
      alert('You do not have enough EcoPoints to redeem this voucher.');
    }
  };

  return (
    <div className="eco-points-container">
      <div className="points-summary">
        <h1>My <span className="eco">Eco</span>Points</h1>
        <div className="points-total">
          {ecoPoints} <img src="public/images/CoinIcon.png" alt="Coin Icon" className="coin-icon" />
        </div>
        <hr />
        <div className="activity-list">
          {activities.map((activity, index) => (
            <div className="activity-item" key={index}>
              <span>{activity.task}</span>
              <span className="points">{activity.points} <img src="public/images/CoinIcon.png" alt="Coin Icon" className="coin-icon small-coin-icon" /></span>
              <span className="date">{activity.date}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="tasks-rewards">
        <div className="tabs">
          <button className={`tab ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => handleTabSwitch('tasks')}>Tasks</button>
          <button className={`tab ${activeTab === 'rewards' ? 'active' : ''}`} onClick={() => handleTabSwitch('rewards')}>Rewards</button>
          <button className={`tab ${activeTab === 'luckyDraw' ? 'active' : ''}`} onClick={() => handleTabSwitch('luckyDraw')}>Lucky Draw</button>
        </div>
        {activeTab === 'tasks' && (
          <div className="tasks-list">
            <div className="task-item">
              <img src="public/images/CheckInIcon.png" alt="Check In" className="task-icon" />
              <div>
                <span className="task-title">Check In  </span>
                <span className="task-reward">Upon completion, +10 <img src="public/images/CoinIcon.png" alt="Coin Icon" className="coin-icon small-coin-icon" /></span>
              </div>
              <button 
                className={`claim-button ${claimedTasks.checkIn ? 'claimed' : ''}`} 
                onClick={() => handleClaim('checkIn', 10)}
                disabled={claimedTasks.checkIn}
              >
                {claimedTasks.checkIn ? 'Claimed' : 'Claim'}
              </button>
            </div>
            <div className="task-item">
              <img src="public/images/CreateListingIcon.png" alt="Create a Listing" className="task-icon" />
              <div>
                <span className="task-title">Create a Listing  </span>
                <span className="task-reward">Upon completion, +25 <img src="public/images/CoinIcon.png" alt="Coin Icon" className="coin-icon small-coin-icon" /></span>
              </div>
              <button 
                className={`claim-button ${claimedTasks.createListing ? 'claimed' : ''}`} 
                onClick={() => handleClaim('createListing', 25)}
                disabled={claimedTasks.createListing}
              >
                {claimedTasks.createListing ? 'Claimed' : 'Claim'}
              </button>
            </div>
            <div className="task-item">
              <img src="public/images/ShareIcon.png" alt="Share a Listing" className="task-icon" />
              <div>
                <span className="task-title">Share a Listing  </span>
                <span className="task-reward">Upon completion, +10 <img src="public/images/CoinIcon.png" alt="Coin Icon" className="coin-icon small-coin-icon" />, (0/3)</span>
              </div>
              <button 
                className={`claim-button ${claimedTasks.shareListing ? 'claimed' : ''}`} 
                onClick={() => handleClaim('shareListing', 10)}
                disabled={claimedTasks.shareListing}
              >
                {claimedTasks.shareListing ? 'Claimed' : 'Claim'}
              </button>
            </div>
            <div className="task-item">
              <img src="public/images/InviteIcon.png" alt="Invite a Friend" className="task-icon" />
              <div>
                <span className="task-title">Invite a Friend  </span>
                <span className="task-reward">Upon completion, +250 <img src="public/images/CoinIcon.png" alt="Coin Icon" className="coin-icon small-coin-icon" />, Unlimited</span>
              </div>
              <button 
                className={`claim-button ${claimedTasks.inviteFriend ? 'claimed' : ''}`} 
                onClick={() => handleClaim('inviteFriend', 250)}
                disabled={claimedTasks.inviteFriend}
              >
                {claimedTasks.inviteFriend ? 'Claimed' : 'Claim'}
              </button>
            </div>
          </div>
        )}
        {activeTab === 'rewards' && (
          <div className="rewards-list">
            <div className="reward-item" onClick={() => handleVoucherClick(1000, '$5 Fairprice Voucher')}>
              <img src="public/images/FairpriceVoucher.png" alt="Fairprice Voucher" className="reward-icon" />
              <span className="reward-description">$5 Fairprice Voucher</span>
              <span className="reward-points">1000 EcoPoints <img src="public/images/CoinIcon.png" alt="Coin Icon" className="coin-icon small-coin-icon" /></span>
            </div>
            <div className="reward-item" onClick={() => handleVoucherClick(1000, '$5 Giant Voucher')}>
              <img src="public/images/GiantVoucher.jpg" alt="Giant Voucher" className="reward-icon" />
              <span className="reward-description">$5 Giant Voucher</span>
              <span className="reward-points">1000 EcoPoints <img src="public/images/CoinIcon.png" alt="Coin Icon" className="coin-icon small-coin-icon" /></span>
            </div>
            <div className="reward-item" onClick={() => handleVoucherClick(1500, '$5 Grab Voucher')}>
              <img src="public/images/GrabVoucher.png" alt="Grab Voucher" className="reward-icon" />
              <span className="reward-description">$5 Grab Voucher</span>
              <span className="reward-points">1500 EcoPoints <img src="public/images/CoinIcon.png" alt="Coin Icon" className="coin-icon small-coin-icon" /></span>
            </div>
            <div className="reward-item" onClick={() => handleVoucherClick(500, '$2 LiHO Gift Card')}>
              <img src="public/images/LiHOGiftCard.png" alt="LiHO Gift Card" className="reward-icon" />
              <span className="reward-description">$2 LiHO Gift Card</span>
              <span className="reward-points">500 EcoPoints <img src="public/images/CoinIcon.png" alt="Coin Icon" className="coin-icon small-coin-icon" /></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Rewards;