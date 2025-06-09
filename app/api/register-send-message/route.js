import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const TEST_NUMBER = '714880478366566';
const BRAI_NUMBER = '651850731351521';
const HELLO_WORLD_TEMPLATE = 'hello_world';
const VERIFY_CODE_TEMPLATE = 'brai_auth';
const WHATSAPP_API_URL = `https://graph.facebook.com/v22.0/${BRAI_NUMBER}/messages`;
const ACCESS_TOKEN = 'EAAKSDWktdhgBO2L8LlaZAS1k6IhsFw5aGnA1wVfw8GZCymLcHMbpGEuihneeSvFuRbObT0Ry66lERdhcRo0LG9DbLn34mlkxrM13sTyLg1G5wbl36Bt0qqqfX46ihQm14dVqdectlCaG06x6zfRybduIEfEkxGGSZCVbZAMq40VfiRjPF5URdbCsoPZB7ilEX9gZDZD';

export async function POST(req) {
    try {
        const { email, phone } = await req.json();

        if (!email) {
            console.log('Correo requerido');
            return NextResponse.json({ error: 'Correo requerido' }, { status: 400 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
        const { error: insertError } = await supabase.from('register_otp_codes').insert([
            {
                email,
                code: otp,
                expires_at: expiresAt,
            },
        ]);

        if (insertError) {
            console.log('Error al almacenar el código OTP');
            return NextResponse.json({ error: 'Error al almacenar el código OTP' }, { status: 500 });
        }

        const res = await fetch(WHATSAPP_API_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: '57' + phone,
                type: 'template',
                template: {
                    name: VERIFY_CODE_TEMPLATE,
                    language: { code: 'en' },
                    "components": [
                        {
                            "type": "body",
                            "parameters": [
                                {
                                    "type": "text",
                                    "text": otp
                                }
                            ]
                        },
                        {
                            "type": "button",
                            "sub_type": "url",
                            "index": 0,
                            "parameters": [
                                {
                                    "type": "text",
                                    "text": otp
                                }
                            ]
                        }
                    ]
                },
            }),
        });

        if (!res.ok) {
            console.log('Error al enviar el mensaje');
            return NextResponse.json({ error: 'Error al enviar el mensaje' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Error enviando mensaje' }, { status: 500 });
    }
}
