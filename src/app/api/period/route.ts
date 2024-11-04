import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { parseStringPromise } from 'xml2js';

export async function GET() {
  const prisma = new PrismaClient();
  
  try {
    const periods = await prisma.period.findMany();

    return NextResponse.json(periods);
  } catch (error) {
    console.error("Error fetching periods:", error);
    return NextResponse.json({ error: "Error fetching periods" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
    const prisma = new PrismaClient();
    
    try {
        const contentType = request.headers.get("content-type") || "";
        
        // Handle JSON input to retrieve the "id" field
        let id;
        let xmlData;
        
        if (contentType.includes("multipart/form-data")) {
            // Assume the XML is part of form-data
            const formData = await request.formData();
            id = formData.get("id") as string;
            
            // Retrieve XML file from form-data
            const xmlFile = formData.get("file"); // Replace 'file' with your XML field name
            if (xmlFile && typeof xmlFile === 'object' && xmlFile instanceof File) {
                const xmlText = await xmlFile.text();
                
                // Parse XML data
                xmlData = await parseStringPromise(xmlText);

                console.log(xmlData);
            }
        } else if (contentType.includes("application/json")) {
            // Handle pure JSON request
            const jsonData = await request.json();
            id = jsonData.id;
        }

        // Validate ID
        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        // Save data to the database, including parsed XML if required
        /* Temporary disabled
        const newPeriod = await prisma.period.create({
            data: {
                id: Number(id),
            },
        });
        */
        
        return NextResponse.json(
            //newPeriod,
            {},
            { status: 201 }
        );

    } catch (error) {
        console.error("Error creating period:", error);
        return NextResponse.json({ error: "Error creating period" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}