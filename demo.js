const { MongoClient } = require('mongodb')
require('dotenv').config()

async function main() {
    const uri = process.env.MONGODB_URI
    const client = new MongoClient(uri)

    try {
        await client.connect()
        
        await deleteListingsScrapedBeforeDate(client, new Date("2024-11-01"))

    } catch (error) {
        console.error(error.message)
    } finally {
        await client.close()
    }
}

async function listDatabases(client) {
    const databaseList = await client.db().admin().listDatabases();
    
    console.log("databaseList: ")
    databaseList.databases.forEach(db => {
        console.log(`- ${db.name}`)
    })
}

async function createListing(client, newListing) {
    const result = await client.db("sambple_air_bnb").collection("listingAndReviews").insertOne(newListing);

    console.log(`New listing created with the following id: ${result.insertedId}`);
}

async function createMultipleListings(client, newListings) {
    const result = await client.db("sambple_air_bnb").collection("listingAndReviews").insertMany(newListings)

    console.log(`${result.insertedCount} new listings created with the following id(s):`)
    console.log(result.insertedIds)
}

async function findOneListingByName(client, nameOfListing) {
    const result = await client.db("sambple_air_bnb").collection("listingAndReviews").findOne({
        name: nameOfListing
    })

    if (result) {
        console.log(`Found a listing in the collection with the name '${nameOfListing}'`)
        console.log(result)
    } else {
        console.log(`No listing found with the name '${nameOfListing}'`)
    }
}

async function findListingsWithMinBedroomsBathroomsAndMostRecentReviews(client, {
    minimumNumberOfBedrooms = 0,
    minimumNumberOfBathrooms = 0,
    maximumNumberOfResults = Number.MAX_SAFE_INTEGER
} = {}) {
    const cursor = await client.db("sambple_air_bnb").collection("listingAndReviews").find(
        {
            bedrooms: { $gte: minimumNumberOfBedrooms },
            bathrooms: { $gte: minimumNumberOfBathrooms},
        }
    ).sort({ last_review: -1}).limit(maximumNumberOfResults)

    const results = await cursor.toArray()

    if (results.length > 0) {
        console.log(`Found listing(s) with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms:`)
        results.forEach((result, i) => {
            date = new Date(result.last_review).toDateString();
            console.log();
            console.log(`${i + 1}. name: ${result.name}`)
            console.log(`   _id: ${result._id}`)
            console.log(`   bedrooms: ${result.bedrooms}`)
            console.log(`   bathrooms: ${result.bathrooms}`)
            console.log(`   most recent review date: ${new Date(result.last_review).toDateString()}`)
        })
    }
}

async function updateListingByName(client, nameOfListing, updatedListing) {
    const result = await client.db("sambple_air_bnb").collection("listingAndReviews").updateOne({ name: nameOfListing }, { $set: updatedListing})

    console.log(`${result.matchedCount} document(s) matched the query criteria`)
    console.log(`${result.modifiedCount} document(s) was/were updated`)
}

async function upsertListingByName(client, nameOfListing, updatedListing) {
    const result = await client.db("sambple_air_bnb").collection("listingAndReviews").updateOne({name: nameOfListing}, { $set: updatedListing}, { upsert: true})

    console.log(`${result.matchedCount} document(s) matched the query criteria`);

    if (result.upsertedCount > 0) {
        console.log(`One document was inserted with the id ${result.upsertedId}`);
    } else {
        console.log(`${result.modifiedCount} document(s) was/were updated`)
    }
}

async function updateAllListingsToHavePropertyType(client) {
    const result = await client.db("sambple_air_bnb").collection("listingAndReviews").updateMany({ property_type: {$exists: false} }, {$set: { property_type: "Unknown" }})

    console.log(`${result.matchedCount} document(s) matched the query criteria`)
    console.log(`${result.modifiedCount} document(s) was/were updated`)
}

async function deleteListingByName(client, nameOfListing) {
    const result = await client.db("sambple_air_bnb").collection("listingAndReviews").deleteOne({ name: nameOfListing})

    console.log(`${result.deletedCount} document(s) was/were deleted`)

}

async function deleteListingsScrapedBeforeDate(client, date) {
    const result = await client.db("sambple_air_bnb").collection("listingAndReviews").deleteMany({
        "last_scraped": { $lt: date}
    })
    
    console.log(`${result.deletedCount} document(s) was/were deleted`)
}

main().catch(console.error)