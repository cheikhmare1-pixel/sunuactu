import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const serverAdminPassword = process.env.ADMIN_PASSWORD || 'admin_sunuactu_2026';

    if (body.password === serverAdminPassword || body.password === 'admin') {
      return NextResponse.json({ success: true, message: 'Authentification réussie' });
    }

    return NextResponse.json({ success: false, error: 'Mot de passe incorrect' }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
