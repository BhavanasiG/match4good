'use server'
import { NextResponse } from "next/server";
// import { PrismaClient, Prisma } from '@prisma/client'
import prisma from "@/lib/prisma";


interface CreateOpportunityFormState  {
    opp_name: string;
    opp_description: string;
    opp_start_date: string;
    opp_end_date: string;
  }

// Prevent multiple instances of PrismaClient in development mode
// const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// export const prisma = globalForPrisma.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;


// export async function POST(request:Request){
//     const data = await request.json();

//     try {
//         const newOpportunity = await prisma.opportunity.create({
//           data: {
//             opp_name: data.opp_name,
//             opp_description: data.opp_description,
//             opp_start_date: new Date(data.opp_start_date),
//             opp_end_date: new Date(data.opp_end_date),
//           },
//         });

//         return NextResponse.json(newOpportunity);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ message: "Error saving data" }, { status: 500 });
//   }
// }

// export async function createOpp(formData: any){
//     const opp_name = formData.get('opp_name')
//     const opp_desc = formData.get('opp_description')
//     const start_date = formData.get('opp_start_date')
//     const end_date = formData.get('opp_end_data')

//     const opp =  await prisma.opportunity.create({data:{
//         opp_name : opp_name,
//         opp_description : opp_desc,
//         opp_start_date : start_date,
//         opp_end_date : end_date
//         }, 
//     });
//     const json = await res.json()

//     if (!res.ok) {
//         return { message: 'Failed to create opportunity' };
//     } else{
//         return res
//     }
// }

export async function createOpp(formData: FormData){
    const opp_name = formData.get("opp_name") as string;
    const opp_desc = formData.get("opp_description") as string;
    // const start_date = formData.get("opp_start_date") as string
    // const end_date = formData.get("opp_end_date") as string
    const start_date =  new Date(formData.get("opp_start_date") as string)
    const end_date = new Date(formData.get("opp_end_date") as string)
    // start_date: new Date().toISOString().split("T")[0],
    // end_date: new Date().toISOString().split("T")[0]
    
    const opp =  await prisma.opportunity.create({data:{
        opp_name : opp_name,
        opp_description : opp_desc,
        opp_start_date : start_date,
        opp_end_date : end_date
        }, 
    });


    // return opp;

    // try {
    //     const opp = await prisma.opportunity.create({
    //         data: {
    //             opp_name: formData.opp_name,
    //             opp_description: formData.opp_description,
    //             opp_start_date: new Date(formData.opp_start_date),
    //             opp_end_date: new Date(formData.opp_end_date),
    //         },
    //     });

    //     return opp; // Return the created opportunity
    // } catch (error) {
    //     console.error("Error creating opportunity:", error);
    //     throw new Error("Failed to create opportunity");
    // }
}

//     try {
//         const newOpp = await prisma.opportunity.create({data:{
//             opp_name : opp_name,
//             opp_description : opp_desc,
//             opp_start_date : start_date,
//             opp_end_date : end_date
//         }, 
//     });
//     return NextResponse.json(newOpp);
//     } catch (error) {
//         console.error(error);
//         return NextResponse.json({ message: "Error saving data" }, { status: 500 });
//     }
// }

export async function createOpp1(formData: CreateOpportunityFormState){
    const opp_name = formData.opp_name as string;
    const opp_desc = formData.opp_description as string;
    // const start_date = formData.get("opp_start_date") as string
    // const end_date = formData.get("opp_end_date") as string
    const start_date =  new Date(formData.opp_start_date as string)
    const end_date = new Date(formData.opp_end_date as string)
    // start_date: new Date().toISOString().split("T")[0],
    // end_date: new Date().toISOString().split("T")[0]
    
    const opp =  await prisma.opportunity.create({data:{
        opp_name : opp_name,
        opp_description : opp_desc,
        opp_start_date : start_date,
        opp_end_date : end_date
        }, 
    });
}