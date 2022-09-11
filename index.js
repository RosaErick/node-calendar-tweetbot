import client from "./twitterClient.js";
import cron from "cron";
import airtable from "./service.js";

const rwClient = client.readWrite;
const CronJob = cron.CronJob;

const base = airtable.base("appRpJl0VIdVTRpTk");
const tweets = [];

console.log(base);

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

const getTweetFromAirtable = async () => {
  console.log("getTweetFromAirtable");
  base("Table 1")
    .select({
      // Selecting the first 3 records in Grid view:
      maxRecords: 1,
      view: "Grid view",
    })
    .eachPage(
      function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
        try {
          records.forEach(function (record) {
            console.log(record);

            console.log(record.get("tweet"));
            console.log(record.get("tweet").length);
            console.log(record.get("tweet").match(/.{1,280}/g));

            tweets.push(record.get("tweet").match(/.{1,280}/g));

            //tweet(record.get("tweet"));
          });
        } catch (e) {
          console.log("error inside eachPage => ", e);
        }

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        try {
          fetchNextPage();
        }
        catch (e) {
          console.log("error inside fetchNextPage => ", e);
        }
      },
      function done(err) {
        if (err) {
          console.error(err);
          return;
        }
      }
    );
};

getTweetFromAirtable();


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

// job.start();




try { console.log({ tweets }); }
catch (e) {
  console.log(e);
}

