import {API_KEY} from 'react-native-dotenv';

const baseApiUrl = 'https://www.alphavantage.co/query?function=';
const apiKey = API_KEY;
const symbolSearchFunc = 'SYMBOL_SEARCH&keywords=';
const timeSeriesDailyFunc = 'TIME_SERIES_DAILY&symbol=';

export {baseApiUrl, apiKey, symbolSearchFunc, timeSeriesDailyFunc};
