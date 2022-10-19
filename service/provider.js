import axios from "axios";
import "dotenv/config";

class DataProvider {
  async fetchData() {
    try {
      const response = await axios.get(process.env.AIRTABLE_URI, {
        params: {
          maxRecords: "3",
          view: "Grid view",
        },
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        },
      });

      const data = response.data.records;

      return data;
    } catch (error) {
      console.log(error);
    }
  }
}

export default new DataProvider();
