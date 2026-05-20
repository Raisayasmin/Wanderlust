const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(() => {
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

async function getCoordinates(location, country){

    const fullLocation = `${location}, ${country}`;


    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fullLocation)}&format=json`,
        {
            headers: {
                "User-Agent": "AirbnbClone/1.0",
                 "Accept": "application/json"
            }
        }
    );
      if(!response.ok){
        console.log(`Failed for ${fullLocation}`);
        return null;
    }

    const data = await response.json();

    if(data.length === 0){
        return null;
    }

    return {
        type: "Point",
        coordinates: [
            parseFloat(data[0].lon),
            parseFloat(data[0].lat)
        ]
    };
}

const initDB = async () => {

    await Listing.deleteMany({});

    for(let listing of initData.data){

        const geometry = await getCoordinates(
            listing.location,
            listing.country
        );

        listing.geometry = geometry;

        listing.owner = "69ddda1d80923b29e0a73054";
        await new Promise(resolve => setTimeout(resolve, 1500));
    }

    console.log(initData.data.length);
    console.log(initData.data[0]);
    await Listing.insertMany(initData.data);

    console.log("Data was initialized");
};

initDB();




// const mongoose = require("mongoose");
// const initData = require("./data.js");
// const Listing = require("../models/listing.js");
// const fetch = require("node-fetch");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"

// main().then(() => {
//     console.log("connected to DB");
// })
// .catch((err) => {
//     console.log(err);
// })

// async function main() {
//     await mongoose.connect(MONGO_URL)
// }

// const initDB = async () => {
//     await Listing.deleteMany({});
//     initData.data = initData.data.map((obj) => ({
//         ...obj,
//         owner: '69ddda1d80923b29e0a73054'
//     }))
//     await Listing.insertMany(initData.data);
//     console.log("Data was initialized");
// };

// initDB();
