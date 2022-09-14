import client from "./twitterClient.js";
import cron from "cron";
import airtable from "./service.js";
import axios from "axios";
import download from "image-downloader";

import "dotenv/config";
import console from "console";

const rwClient = client.readWrite;
const CronJob = cron.CronJob;

const base = airtable.base("appRpJl0VIdVTRpTk");
const tweetsArray = [];

const dayData = new Date();
const formatData = () => {
  const day = dayData.getDate();
  const month = dayData.getMonth() + 1;
  const year = dayData.getFullYear();

  if (month < 10) {
    return `${year}-0${month}-${day}`;
  } else {
    return `${year}-${month}-${day}`;
  }
};

console.log(formatData());

const downloadImage = (url, filepath) => {
  return download.image({
    url: url,
    dest: filepath,
  });
};

const getTweetFromAirtable = async () => {
  //fetch to airtable
  try {
    const response = await axios.get(
      "https://api.airtable.com/v0/appRpJl0VIdVTRpTk/Table%201",
      {
        params: {
          maxRecords: "3",
          view: "Grid view",
        },
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        },
      }
    );

    const data = response.data.records;
    const tweets = data.map((tweet) => tweet.fields.tweet);
    const img = data.map((tweet) => tweet.fields.img);
    const imgUrl = img.map((img) => img[0].url);
    console.log(img);
    console.log(imgUrl[0]);
    const thread = tweets.join(" ").match(/.{1,280}/g);

    const imageDownloaded = await downloadImage(imgUrl[0], "./img.jpg");
    console.log(imageDownloaded);

    const mediaId = await rwClient.v1.uploadMedia(imageDownloaded.filename);

    console.log(mediaId);

    const insertImage = (thread, img) => {
      thread[0] = { text: thread[0], media: { media_ids: [img] } };
      return thread;
    };

    const threadWithImage = insertImage(thread, mediaId);

    console.log(threadWithImage);

    return threadWithImage;
  } catch (error) {
    console.log(error);
  }
};

const job = new CronJob(
  "0 0 0 * * *",
  function () {
    getTweetFromAirtable();
  },
  null,

  true,
  "America/Los_Angeles"
);

const tweet = async (text) => {
  try {
    const response = await rwClient.v2.tweet(text);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

const thread = async (tweets) => {
  try {
    const response = await rwClient.v2.tweetThread(tweets);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

const tweets = await getTweetFromAirtable();

console.log(tweets);

thread(tweets);

// job.start();
