'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { signIn } from '@/utils/auth';

export default function SignIn() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        setIsSubmitting(false);
        await signIn(formData);
    }

    return (
        <div className="w-screen h-screen p-0 m-0 flex justify-center items-center">
            <div className='flex flex-col justify-center items-center w-[90%] md:w-1/3 p-8 border-gray-300 border-2 rounded-lg'>
                <section className='w-full flex flex-col justify-center items-center pb-8 mb-8 border-b-2 border-b-gray-300'>
                    <h1 className="text-4xl font-bold w-full text-center my-8">Bienvenido</h1>
                    <p className="text-muted-foreground w-full text-center text-lg">
                        Introduce tu email y contraseña
                    </p>
                </section>
                <section className='w-full flex flex-col justify-center items-center p-0'>
                    <form noValidate className="flex flex-col justify-center items-center w-full gap-y-8 px-12" onSubmit={handleSubmit}>
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
                            <label htmlFor="password">Contraseña</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="password"
                                autoCapitalize="none"
                                autoCorrect="off"
                                required
                                className='h-12 border-gray-200 border-2 rounded-lg p-4'
                            />
                        </div>
                        <button type="submit" className="w-full h-12 bg-blue-600 rounded-lg text-white font-bold" disabled={isSubmitting}>
                            {isSubmitting ? 'Cargando' : 'Iniciar Sesion'}
                        </button>
                    </form>
                </section>
                <section className='flex flex-col gap-y-2 mt-4 justify-center items-center w-full p-0'>
                    <p className="text-center text-sm">
                        ¿Olvidaste la Contraseña?{' '}
                        <Link href="/signinWithCode" className="underline">
                            Iniciar con Codigo
                        </Link>
                    </p>
                    <p className="text-center text-sm">
                        ¿No tienes una cuenta?{' '}
                        <Link href="/signup" className="underline">
                            Regístrate
                        </Link>
                    </p>
                </section>
            </div>
        </div>
    );
}
