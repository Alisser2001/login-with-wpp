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

        const { data: otpRecord, error: otpError } = await supabase
            .from('register_otp_codes')
            .select('*')
            .eq('email', email)
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
            .from('register_otp_codes')
            .update({ used: true })
            .eq('id', otpRecord.id);

        if (updateError) {                                  
            console.log('Error al actualizar el estado del código');
            return NextResponse.json({ error: 'Error al actualizar el estado del código' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error validando codigo' }, { status: 500 });
    }
}
