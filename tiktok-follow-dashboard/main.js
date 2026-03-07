import { Actor } from 'apify';

await Actor.init();

// Get input
const input = await Actor.getInput();
const username = input.username || "lawalneymar10"; // your TikTok username
const hashtags = input.hashtags || ["football", "ai", "motivation"];

// Open dataset
const dataset = await Actor.openDataset();

// ------------------------------
// 1️⃣ Fetch your followers/following
// For demonstration, we are using placeholder arrays
// You will replace this with Apify TikTok scraper later
const followers = ["user1", "user2", "user3"];
const following = ["user1", "user2", "user3", "user4", "user5"];

// Find accounts not following back
const notFollowingBack = following.filter(user => !followers.includes(user));

for (const user of notFollowingBack) {
  await dataset.pushData({
    username: user,
    type: "not_following_back",
    action: "review"
  });
}

// ------------------------------
// 2️⃣ Suggested accounts to follow (from hashtags)
// Placeholder suggested accounts
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