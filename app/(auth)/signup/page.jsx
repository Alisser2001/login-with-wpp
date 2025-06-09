'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { signUp } from '@/utils/auth';

export default function SignUp() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sendCode, setSendCode] = useState(false);

    const handleSubmitCode = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const email = (formData.get('email') || '').trim();
        const phone = (formData.get('phone') || '').trim();
        const res = await fetch('/api/register-send-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, phone }),
        });
        if (res.ok) {
            setSendCode(true);
        }
        setIsSubmitting(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const email = (formData.get('email') || '').trim();
        const code = (formData.get('code') || '').trim();
        const res = await fetch('/api/register-validate-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code }),
        });
        setIsSubmitting(false);
        setSendCode(false);
        if (res.ok) {
            await signUp(formData);
        }
    };
    return (
        <div className="w-screen h-screen p-0 m-0 flex justify-center items-center">
            <div className='flex flex-col justify-center items-center w-[90%] md:w-1/3 p-8 border-gray-300 border-2 rounded-lg'>
                <section className='w-full flex flex-col justify-center items-center pb-8 mb-8 border-b-2 border-b-gray-300'>
                    <h1 className="text-4xl font-bold w-full text-center my-8">Regístrate</h1>
                    <p className="text-muted-foreground w-full text-center text-lg">
                        Introduce el email y telefono para registrar una nueva cuenta
                    </p>
                </section>
                <section className='w-full flex flex-col justify-center items-center p-0'>
                    <form noValidate className="flex flex-col justify-center items-center w-full gap-y-8 px-12" onSubmit={(e) => { sendCode ? handleSubmit(e) : handleSubmitCode(e) }}>
                        <div className="grid gap-2 w-full md:w-2/3 lg:w-full">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="name@example.com"
                                autoCapitalize="none"
                                autoComplete="email"
                                autoCorrect="off"
                                required
                                className='h-12 border-gray-200 border-2 rounded-lg p-4'
                            />
                        </div>
                        <div className="grid gap-2 w-full md:w-2/3 lg:w-full">
                            <label htmlFor="password">Contraseña</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Your Password"
                                autoCapitalize="none"
                                autoCorrect="off"
                                required
                                className='h-12 border-gray-200 border-2 rounded-lg p-4'
                            />
                        </div>
                        <div className="grid gap-2 w-full md:w-2/3 lg:w-full">
                            <label htmlFor="phone">Telefono (+57)</label>
                            <input
                                id="phone"
                                type='tel'
                                name="phone"
                                placeholder="Telefono"
                                pattern="[0-9]{3}?[0-9]{3}?[0-9]{4}"
                                inputMode="numeric"
                                maxLength="12"
                                required
                                className="h-12 border-gray-200 border-2 rounded-lg p-4"
                            />
                        </div>
                        {sendCode &&
                            <div className="grid gap-2 w-full md:w-2/3 lg:w-full">
                                <label htmlFor="code">Confirmar Codigo</label>
                                <input
                                    id="code"
                                    type='text'
                                    name="code"
                                    placeholder="Codigo"
                                    inputMode="numeric"
                                    maxLength="6"
                                    required
                                    className="h-12 border-gray-200 border-2 rounded-lg p-4"
                                />
                            </div>
                        }
                        {sendCode ?
                            <button type="submit" className="w-full h-12 bg-blue-600 rounded-lg text-white font-bold" disabled={isSubmitting}>
                                {isSubmitting ? 'Cargando' : 'Crear Cuenta'}
                            </button> :
                            <button type="submit" className="w-full h-12 bg-blue-600 rounded-lg text-white font-bold" disabled={isSubmitting}>
                                {isSubmitting ? 'Cargando' : 'Enviar Codigo'}
                            </button>
                        }
                    </form>
                </section>
                <section className='flex justify-center items-center w-full mt-2 p-0'>
                    <p className="text-center text-sm">
                        ¿Ya tienes una cuenta?{" "}
                        <Link href="/signin" className="underline">
                            Ingresar
                        </Link>
                    </p>
                </section>
            </div>
        </div>
    );
}
