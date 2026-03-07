import { Actor } from 'apify';

await Actor.init();

const dataset = await Actor.openDataset();

// === Followers / Following ===
const followers = ["user1", "user2", "user3"];
const following = ["user1", "user2", "user3", "user4", "user5"];

const notFollowingBack = following.filter(
  user => !followers.includes(user)
);

for (const user of notFollowingBack) {
  await dataset.pushData({
    username: user,
    type: "not_following_back",
    action: "review"
  });
}

// === Suggested accounts to follow ===
const suggestedAccounts = [
  { username: "creator1", followers: 1200, niche: "football" },
  { username: "creator2", followers: 800, niche: "ai" },
  { username: "creator3", followers: 500, niche: "motivation" }
];

for (const user of suggestedAccounts) {
  await dataset.pushData({
    username: user.username,
    followers: user.followers,
    niche: user.niche,
    type: "suggested_follow",
    action: "review"
  });
}

await Actor.exit();