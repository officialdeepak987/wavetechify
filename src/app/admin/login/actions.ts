
'use server'
 
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
 
const secretKey = process.env.SESSION_SECRET || 'your-default-secret-key'
const key = new TextEncoder().encode(secretKey)
 
export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d') // Session expires in one day
    .sign(key)
}
 
export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    // This can happen if the token is expired or invalid
    return null
  }
}

export async function login(prevState: { error: string | undefined }, formData: FormData) {
  const username = formData.get('username')
  const password = formData.get('password')

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    // Create the session
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    const session = await encrypt({ userId: 'admin', expires })
 
    // Save the session in a cookie
    cookies().set('session', session, { expires, httpOnly: true })

    redirect('/admin')
  }

  return { error: 'Invalid username or password' }
}
 
export async function logout() {
  // Destroy the session
  cookies().set('session', '', { expires: new Date(0) })
  redirect('/admin/login')
}
