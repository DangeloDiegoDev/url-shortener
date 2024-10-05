'use client'
import { providerMap } from "@/app/auth"
import Signup from "../components/auth/Signup"
import Login from "../components/auth/Login"
import { useRef, useState } from "react"
import { handleFormSubmit } from "../actions/auth"
import './styles.css'

export default function SignInPage() {
  const [switcher, setSwitcher] = useState(true);
  const credentialsLogin = useRef<HTMLDivElement>(null);
  const credentialsSignup = useRef<HTMLDivElement>(null);
  const [optionsShown, setOptionsShown] = useState<boolean>(false);

  function switchSwitcher() {
    switcher ? setSwitcher(false) : setSwitcher(true)
  }

  function setOptionsBoolean() {
    optionsShown ? setOptionsShown(false) : setOptionsShown(true)
  }

  function toggleOptions() {
      if (optionsShown) {
        !credentialsLogin.current ? null : credentialsLogin.current!.style.animation = "slideOut 1s ease-in-out forwards"
        !credentialsSignup.current ? null : credentialsSignup.current!.style.animation = "slideOut 1s ease-in-out forwards"
      } else {
        !credentialsLogin.current ? null : credentialsLogin.current!.style.animation = "slideIn 1s ease-in-out forwards"
        !credentialsSignup.current ? null : credentialsSignup.current!.style.animation = "slideIn 1s ease-in-out forwards"
      }
  }

  return (
    <div className="bg-slate-950 min-h-screen flex justify-center text-white">
      <div className="w-2/4 my-5 ring-2 ring-red-500 rounded-md">
        <div className="h-full flex flex-col items-center gap-10">
          <h1 className="border-b-2 border-red-500 w-full text-center py-5 text-3xl">SIGN IN</h1>
          {switcher ? <button onClick={toggleOptions} className="hover:text-red-500">Log in with credentials</button> : <button onClick={toggleOptions} className="hover:text-red-500">Register with credentials</button>}
          {switcher ?
            <div onAnimationEnd={setOptionsBoolean} ref={credentialsLogin} className="h-0 overflow-y-clip">
              <Login />
            </div> : <div onAnimationEnd={setOptionsBoolean} ref={credentialsSignup} className="h-0 overflow-y-clip">
              <Signup />
            </div>
          }
          <div className="text-center">
            {switcher ? <button onClick={switchSwitcher} className="hover:text-red-500">No account? register!</button> : <button onClick={switchSwitcher} className="hover:text-red-500">Already have an account? log in!</button>}
          </div>
          <div className="flex mb-10">
            {Object.values(providerMap).map((provider, index) => (
              <form key={index} action={() => handleFormSubmit(provider.id)}>
                <button type="submit" className="hover:text-red-500">
                  <span>Sign in with {provider.name}</span>
                </button>
              </form>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}