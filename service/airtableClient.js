import  AirTable  from "airtable";
import "dotenv/config";



const airtable = new AirTable({
    apiKey: process.env.AIRTABLE_API_KEY,
});

export default airtable;