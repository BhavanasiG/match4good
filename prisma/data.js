const { Prisma } = require('@prisma/client');

const User = [
    {
        user_id: 1,
        username: "Oxfam_CEO"
    },
    {
        user_id: 2,
        username: "Oxfam_Employee 1"
    },
    {
        user_id: 3,
        username: "Oxfam_Employee 2"
    },
];

const Organization = [
    {
        name:"Oxfam",
        description: "",
        owner_id:1,
        members: [
            2, 3
        ]
   },
];

const Listing = [
    {
        name : "Help fundraise for Oxfam!",
        description : "",
        start_datetime: new Date("2025-04-02_08:00"),
        end_datetime : new Date("2025-06-02_17:00"),
        organization_id: 1
    },
];

const Application = [
    {

    },
];
