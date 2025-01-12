"use client";

import { useState } from 'react';
import { authClient } from "src/lib/auth-client";

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    // const [image, setImage] = useState<File | null>(null);

    const signUp = async () => {
        const { data, error } = await authClient.signUp.email({
            email,
            password,
            name,
            // image: image ? convertImageToBase64(image) : undefined,
        }, {
            onRequest: (ctx) => {
                //show loading
            },
            onSuccess: (ctx) => {
                //redirect to the dashboard
            },
            onError: (ctx) => {
                alert(ctx.error.message);
            },
        });
    };

    return (
        <div>
            <label htmlFor="name">Name</label>
            <input id="name" type="text" value={name} placeholder="Enter your name" onChange={(e) => setName(e.target.value)} />
            <label htmlFor="password">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <label htmlFor="email">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            {/* <input type="file" onChange={(e) => setImage(e.target.files?.[0])} /> */}
            <button type="submit" onClick={signUp}>Sign Up</button>
        </div>
    );
}
