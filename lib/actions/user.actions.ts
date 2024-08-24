'use server'

import { signIn } from '@/auth'
import db from '@/db/drizzle'
import { users } from '@/db/schema'
import { hashSync } from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { AuthError } from 'next-auth'
import { z } from 'zod'

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn('credentials', formData)
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.'
        default:
          return 'Something went wrong.'
      }
    }
    throw error
  }
}

export async function getUser(email: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email as string),
  })
  if (!user) throw new Error('User not found')
  return user
}

const FormSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  password: z.string().min(6),//hashSync(password, 10)
})
const CreateUser = FormSchema.omit({ id: true })

export type State = {
  errors?: {
    name?: string[]
    email?: string[]
    password?: string[]
  }
  message?: string | null
}

export async function createUser(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = CreateUser.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Registration.',
    }
  }

  // Prepare data for insertion into the database
  const { 
    name,
    email,
    password
   } = validatedFields.data
  const hashedPassword = hashSync(password, 10)

  // Insert data into the database
  try {
    await db.insert(users).values({
      name: name,
      email: email,
      password: hashedPassword,
    })
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Registration.',
    }
  }
  // print a message on page saying registration successful
  return {
    message: 'Registration Successful',
  }
  
}
