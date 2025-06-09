import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req) {
    const { access_token, refresh_token } = await req.json();
    const cookieStore = await cookies();
    const sixMonthsInSeconds = 60 * 60 * 24 * 30 * 12;

    cookieStore.set('sb-access-token', access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
        maxAge: sixMonthsInSeconds,
        path: '/',
    });

    cookieStore.set('sb-refresh-token', refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
        maxAge: sixMonthsInSeconds,
        path: '/',
    });

    return NextResponse.json({ success: true });
}
