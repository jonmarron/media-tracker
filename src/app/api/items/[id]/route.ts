import { NextRequest, NextResponse } from 'next/server';
import { findItem, updateItemInStore, deleteItemFromStore } from '@/data/serverStore';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const body = await request.json();

  if (body.title !== undefined && !body.title?.trim()) {
    return NextResponse.json({ error: 'Title cannot be empty' }, { status: 400 });
  }

  const updated = updateItemInStore(id, body);
  if (!updated) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;

  if (!findItem(id)) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }

  deleteItemFromStore(id);
  return new NextResponse(null, { status: 204 });
}
