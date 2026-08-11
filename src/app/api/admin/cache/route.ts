import { NextResponse } from 'next/server';
import globalStore from '@/lib/store';

export async function POST() {
  globalStore.clearCache();
  return NextResponse.json({
    success: true,
    message: 'Cache du serveur réinitialisé avec succès'
  });
}
