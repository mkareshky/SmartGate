'use client'

import { Button } from '@/components/ui/button'
import { createUser, State } from '@/lib/actions/user.actions'
import { UserField } from '@/types'
import { AtSign, CheckIcon, ClockIcon, UserCircleIcon } from 'lucide-react'
import Link from 'next/link'
import { useActionState } from 'react'

export default function RegisterForm({ users }: { users: UserField[] }) {
    const initialState: State = { message: null, errors: {} }
    const [state, formAction] = useActionState(createUser, initialState)

    return (
        <form action={formAction}>
            <div className="rounded-md  p-4 md:p-6">

                {/* User Name */}
                <div className="mb-4">
                    <label htmlFor="user" className="mb-2 block text-sm font-medium">
                        User Name
                    </label>
                    <div className="relative">
                        <input
                            id="user"
                            name="name"
                            type="text"
                            className="peer block w-full rounded-md border  py-2 pl-10 text-sm outline-2 "
                            placeholder="Enter user name"
                            required
                        />
                        <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 " />
                    </div>

                    <div id="user-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.name &&
                            state.errors.name.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* User Email */}
                <div className="mb-4">
                    <label htmlFor="email" className="mb-2 block text-sm font-medium">
                        Enter email
                    </label>
                    <div className="relative">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="peer block w-full rounded-md border  py-2 pl-10 text-sm outline-2 "
                            placeholder="Enter email"
                            required
                        />
                        <AtSign className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 " />
                    </div>

                    <div id="email-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.email &&
                            state.errors.email.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* User Password */}
                <div className="mb-4">
                    <label htmlFor="password" className="mb-2 block text-sm font-medium">
                        Enter password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className="peer block w-full rounded-md border  py-2 pl-10 text-sm outline-2 "
                            placeholder="Enter password"
                            required
                            minLength={6}
                        />
                        <ClockIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 " />
                    </div>

                    <div id="password-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.password &&
                            state.errors.password.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Retype Password */}
                <div className="mb-4">
                    <label htmlFor="retype-password" className="mb-2 block text-sm font-medium">
                        Retype password
                    </label>
                    <div className="relative">
                        <input
                            id="retype-password"
                            name="retypePassword"
                            type="password"
                            className="peer block w-full rounded-md border py-2 pl-10 text-sm outline-2"
                            placeholder="Retype password"
                            required
                            minLength={6}
                            onChange={(e) => {
                                const retypePassword = e.target.value;
                                const password = (document.getElementById('password') as HTMLInputElement)?.value;
                                const errorDiv = document.getElementById('retype-password-error');

                                if (errorDiv) {
                                    if (retypePassword !== password) {
                                        errorDiv.innerHTML = '<p className="mt-2 text-sm text-red-500">Passwords do not match</p>';
                                    } else {
                                        errorDiv.innerHTML = '';
                                    }
                                }
                            }}
                        />
                        <CheckIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
                    </div>

                    {/* New and retype passwords should match */}
                    <div id="retype-password-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.password &&
                            state.errors.password.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                <div aria-live="polite" aria-atomic="true">
                    {state.message ? (
                        <p className="mt-2 text-sm text-red-500">{state.message}</p>
                    ) : null}
                </div>

            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Button asChild>
                    <Link href="/login">Back To Login</Link>
                </Button>

                <Button type="submit">Register</Button>
            </div>
        </form>
    )
}
