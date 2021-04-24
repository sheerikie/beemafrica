var express = require("express");
var app = express();

const request = require("request-promise");
const cheerio = require("cheerio");
const where = require("lodash.where");



const search = (query, res) => {
    // console.log(query)
    main(query, res);
}

async function main(query, res) {

    const result = await request.get("http://mcc-mnc.com");
    const $ = cheerio.load(result);
    const scrapedData = [];
    const tableHeaders = [];
    $("tr").each((index, element) => {
        if (index === 0) {
            const ths = $(element).find("th");
            $(ths).each((i, element) => {
                tableHeaders.push(
                    $(element)
                        .text()
                        .toLowerCase()
                );
            });
            return true;
        }
        const tds = $(element).find("td");
        const tableRow = {};
        $(tds).each((i, element) => {
            tableRow[tableHeaders[i]] = $(element).text();
        });
        scrapedData.push(tableRow);
    });
    let workingdata = [...scrapedData]
    //console.log(scrapedData);
    let results1 = [];
    let results2 = [];
    const { mcc, mnc, country } = query;
    if ('mcc' && 'country' in query) {
        console.log(mcc)
        let filtered1 = where(workingdata, { mcc: mcc } || { country: country });
        filtered1.forEach((value) => {
            //console.log(value.network);
            results1.push({ network: value.network });
            console.log(results1);
            res.json(results1)
            return;
        });
    } else if ('mcc' && 'mnc' in query) {
        let filtered2 = where(workingdata, { mcc: mcc, mnc: mnc });
        filtered2.forEach((value) => {
            //console.log(value.network);
            results2.push({ network: value.network, country: value.country });
            console.log(results2);
            res.json(results2)
            return;


        });
    } else {
        console.log("Parameter not allowed")
        return "Parameter not allowed"
    }



}


app.listen(3000, () => {
    console.log("Server running on port 3000");
});
app.get('/search1', (request, response) => {

    const searchQuery = request.query;

    if (searchQuery != null) {
        search(searchQuery, response)

    } else {
        response.end();
    }
});
