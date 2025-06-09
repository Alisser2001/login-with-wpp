'use server';

import { createClient } from "./supabase/server";
import { redirect } from 'next/navigation';

export async function signIn(formData) {
    const supabase = await createClient();
    const email = (formData.get('email') || '').trim();
    const password = (formData.get('password') || '').trim();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    if (error) {
        console.log(error);
        redirect('/signin');
    }
    redirect('/');
}

export async function signUp(formData) {
    const supabase = await createClient();
    const email = (formData.get('email') || '').trim();
    const password = (formData.get('password') || '').trim();
    const phone_number = (formData.get('phone') || '').trim().split(' ').join('');

    const { error, data } = await supabase.auth.signUp({
        email,
        password
    });

    if (error) {
        console.log(error);
        redirect('/signup');
    }

    await supabase.from('udea_user').insert([
        {
            id: data.user.id,
            email: data.user.email,
            phone: phone_number
        },
    ]);

    redirect('/');
}

export async function signOut() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.log(error);
    }
    redirect('/');
}