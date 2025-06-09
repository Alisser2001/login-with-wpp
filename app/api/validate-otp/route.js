import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { email, code } = await req.json();
        if (!email || !code) {
            console.log('Correo y codigo requeridos');
            return NextResponse.json({ error: 'Correo y codigo requeridos' }, { status: 400 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY
        )

        const { data: user, error: userError } = await supabase
            .from('udea_user')
            .select('id')
            .eq('email', email)
            .single();

        if (userError || !user) {
            console.log('Usuario no encontrado');
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        const { id: user_id } = user;

        const { data: otpRecord, error: otpError } = await supabase
            .from('otp_codes')
            .select('*')
            .eq('user_id', user_id)
            .eq('code', code)
            .eq('used', false)
            .gt('expires_at', new Date().toISOString())
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (otpError || !otpRecord) {
            console.log('Código inválido o expirado');
            return NextResponse.json({ error: 'Código inválido o expirado' }, { status: 400 });
        }

        const { error: updateError } = await supabase
            .from('otp_codes')
            .update({ used: true })
            .eq('id', otpRecord.id);

        if (updateError) {
            console.log('Error al actualizar el estado del código');
            return NextResponse.json({ error: 'Error al actualizar el estado del código' }, { status: 500 });
        }

        const { data: magicLink } = await supabaseAdmin.auth.admin.generateLink({
            type: "magiclink",
            email,
            options: {
                redirectTo: 'http://localhost:3000/',
            }
        });

        return NextResponse.json({ success: true, session: magicLink?.properties?.hashed_token });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error validando codigo' }, { status: 500 });
    }
}
