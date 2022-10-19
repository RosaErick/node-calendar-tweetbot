import airtable from "../service/airtableClient.js";

class AirtableController {
  async index(req, res) {
    try {
      const base = airtable.base("appRpJl0VIdVTRpTk");
      const dayData = new Date();
      const tweet = [];
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
      base("Table 1")
        .select({
          // Selecting the first 3 records in Grid view:

          view: "Grid view",
        })
        .eachPage(
          function page(records, fetchNextPage) {
            // This function (`page`) will get called for each page of records.

            records.forEach(function (record) {
              console.log(record);

              console.log(record.get("tweet"));
              console.log(record.get("tweet").length);
              tweet.push(record.get("tweet"));
              console.log(tweet);
              //tweet(record.get("tweet"));
            });

            // To fetch the next page of records, call `fetchNextPage`.
            // If there are more records, `page` will get called again.
            // If there are no more records, `done` will get called.
          },
          function done(err) {
            if (err) {
              console.error(err);
              return;
            }
          }
        );
      return res.json({ tweet });
    } catch (err) {
      console.log(err);
    }
  }
}

export default new AirtableController();
