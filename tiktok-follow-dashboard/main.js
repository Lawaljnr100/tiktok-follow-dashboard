import { Actor } from 'apify';
import { ApifyClient } from '@apify/client';

await Actor.init();

// === 1️⃣ Load input
const input = await Actor.getInput();
const username = input.username || "lawalneymar10";
const hashtags = input.hashtags || ["football", "ai", "motivation"];

// === 2️⃣ Open dataset
const dataset = await Actor.openDataset();

// === 3️⃣ Apify client to call TikTok scraper actor
const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

// Function to scrape followers/following
async function scrapeFollowersAndFollowing(username) {
  const run = await client.actor("clockworks/tiktok-followers-scraper").call({
    input: {
      profiles: [`@${username}`],
      maxFollowersPerProfile: 500,
      maxFollowingPerProfile: 500
    },
    build: "latest"
  });
  
  // Get dataset items from the scraper
  const datasetId = run.defaultDatasetId;
  const results = await client.dataset(datasetId).listItems({ limit: 1000 });
  return results.items;
}

// === 4️⃣ Get real TikTok data
const tiktokData = await scrapeFollowersAndFollowing(username);

const followers = tiktokData
  .filter(i => i.relation === "follower")
  .map(i => i.authorMeta.name);

const following = tiktokData
  .filter(i => i.relation === "following")
  .map(i => i.authorMeta.name);

// === 5️⃣ Find accounts not following back
const notFollowingBack = following.filter(user => !followers.includes(user));

for (const user of notFollowingBack) {
  await dataset.pushData({
    username: user,
    type: "not_following_back",
    action: "review"
  });
}

// === 6️⃣ Suggested accounts (from hashtags)
const suggestedAccounts = [
  // Example: you can replace these later with hashtag scraping
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