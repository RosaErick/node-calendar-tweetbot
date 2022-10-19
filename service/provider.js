import axios from "axios";
import "dotenv/config";

class DataProvider {
  async fetchData() {
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
      console.log(data);
      
      return data;
    } catch (error) {
      console.log(error);
    }
  }
}

export default new DataProvider();
