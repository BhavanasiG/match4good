const { PirsmaClient } = require('@prisma/client');
const {User, Organisaton, Listing, Application} = require('./data.js');
import prisma from "@/lib/prisma";

/**
 * Cleans/resets development database ; resets auto increments back to 1
 * ; seeds database with values from data.js
 */
const load = async () => {
    try {
        console.log("Cleaning database")

        // TODO: Delete user records
        console.log("Deleted records in User table")

        // TODO: Delete organization records
        console.log("Deleted records in Organizations table")

        // TODO: Delete listing records
        console.log("Deleted records in Listing table")

        // TODO: Delete application records
        console.log("Deleted records in Application table")


        console.log("Initalising database")
        console.log("Reseting auto increments to 1")

        // TODO: Reset user auto increment to 1
        console.log("reset user auto increment to 1")

        // TODO: Reset organization auto increment to 1
        console.log("reset organization auto increment to 1")

        // TODO: Reset listing auto increment to 1
        console.log("reset listing auto increment to 1")

        // TODO: Reset application auto increment to 1
        console.log("reset application auto increment to 1")


        console.log("Adding data ...")
        
        // TODO: Seed user data
        console.log("added User data")

        // TODO: Seed organization data
        console.log("added Organization data")

        // TODO: Seed listing data
        console.log("added Listing data")

        // TODO: Seed application data
        console.log("added Application data")

        console.log("Databse Initalization complete")

    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
};

load();