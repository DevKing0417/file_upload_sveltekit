import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { UPLOAD_DIR } from '$env/static/private';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const resources = await prisma.resource.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return json(resources);
  } catch (error) {
    return json({ error: 'Failed to fetch resources' }, { status: 500 });
  }
}

export async function POST({ request }: RequestEvent) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const language = formData.get('language') as string;
    const provider = formData.get('provider') as string;
    const roles = JSON.parse(formData.get('roles') as string) as string[];
    const file = formData.get('file') as File;

    if (!file) {
      return json({ error: 'No file uploaded' }, { status: 400 });
    }

    const fileName = file.name;
    const fileType = file.type;
    const filePath = join(UPLOAD_DIR, fileName);

    // Save file to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    // Create resource in database
    const resource = await prisma.resource.create({
      data: {
        title,
        description,
        category,
        language,
        provider,
        roles,
        fileName,
        fileType,
        filePath,
        uploadedBy: 'Current User', // Replace with actual user info when auth is implemented
      }
    });

    return json(resource);
  } catch (error) {
    console.error('Error uploading resource:', error);
    return json({ error: 'Failed to upload resource' }, { status: 500 });
  }
} 