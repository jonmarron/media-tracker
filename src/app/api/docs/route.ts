import { NextResponse } from 'next/server';
import { openApiSpec } from './openapi';

export function GET() {
  return NextResponse.json(openApiSpec);
}
