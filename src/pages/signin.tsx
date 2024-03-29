'use client'
import { useSession, signIn } from "next-auth/react"
import { GoogleLoginButton,GithubLoginButton } from "react-social-login-buttons";

export default function Signin() {
  const { data: session,status } = useSession()

return (
  <div className="h-fit">

    <div className='w-fit  p-6 rounded-lg sm:h-72 sm:border text-3xl block mx-auto my-[25%] sm:my-[15%]  text-center'>
    <h1 className="text-3xl font-semibold">Welcome to ThoughtBook</h1>
    <div className="flex flex-col items-center gap-4 my-8">
     <GoogleLoginButton onClick={() => signIn("google",{callbackUrl: sessionStorage.getItem("url") || '/home'})}></GoogleLoginButton>
     <GithubLoginButton onClick={() => signIn("github",{callbackUrl:"/home"})}> </GithubLoginButton>
     </div>
    </div>
    
    </div>
)

}
