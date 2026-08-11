import { NextResponse } from 'next/server';
import globalStore from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const activeOnly = searchParams.get('active') === 'true';
  const channels = globalStore.getChannels(activeOnly);
  return NextResponse.json({ success: true, count: channels.length, channels });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.channelId) {
      return NextResponse.json({ success: false, error: 'Nom et Channel ID requis' }, { status: 400 });
    }
    const newChannel = globalStore.addChannel({
      name: body.name,
      channelId: body.channelId,
      logo: body.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
      url: body.url || `https://youtube.com/channel/${body.channelId}`,
      description: body.description || '',
      category: body.category || 'Généraliste',
      active: body.active ?? true,
      priority: body.priority || 10
    });
    return NextResponse.json({ success: true, channel: newChannel });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
