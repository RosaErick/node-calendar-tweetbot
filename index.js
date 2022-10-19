import client from "./service/twitterClient.js";
import cron from "cron";
import download from "image-downloader";
import "dotenv/config";
import DataProvider from "./service/provider.js";

const rwClient = client.readWrite;
const CronJob = cron.CronJob;

const formatedData = () => {
  const dayData = new Date();
  const day = dayData.getDate();
  const month = dayData.getMonth() + 1;
  const year = dayData.getFullYear();

  if (month < 10) {
    return `${year}-0${month}-${day}`;
  } else {
    return `${year}-${month}-${day}`;
  }
};

const fetchAirtable = async () => {
  try {
    const data = await DataProvider.fetchData();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const downloadImage = (url, filepath) => {
  return download.image({
    url: url,
    dest: filepath,
  });
};

const insertImage = (thread, img) => {
  thread[0] = { text: thread[0], media: { media_ids: [img] } };
  return thread;
};

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

const filterDataByDate = (data) => {
  const formatedDate = formatedData();
  const filteredData = data.filter((item) => {
    return item.fields.data === formatedDate;
  });
  return filteredData;
};



const data = await fetchAirtable();
const filteredData = filterDataByDate(data);
const tweets = filteredData.map((tweet) => tweet.fields.tweet);
const imgs = [...filteredData[0].fields.img];


const imgUrl = imgs[0].url;
const imageDownloaded = await downloadImage(imgUrl, "./img.jpg");

const threadMount = tweets.join(" ").match(/.{1,280}/g);
const mediaId = await rwClient.v1.uploadMedia(imageDownloaded.filename);
const threadWithImage = insertImage(threadMount, mediaId);

console.log({ threadWithImage });

const job = new CronJob(
  "0 0 0 * * *",
  function () {
    thread(threadWithImage);
  },
  null,
  true,
  "America/Los_Angeles"
);

thread(threadWithImage);

// job.start();
