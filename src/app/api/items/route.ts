import { NextRequest, NextResponse } from 'next/server';
import { MediaType } from '@/types';
import { getAllItems, createItem } from '@/data/serverStore';

export function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get('type') as MediaType | null;
  const items = getAllItems(type ?? undefined);
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.title?.trim()) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  const item = createItem(body);
  return NextResponse.json(item, { status: 201 });
}
