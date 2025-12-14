import { deleteCookie, setCookie } from "cookies-next";
import { create } from "zustand";

type AuthStore = {
   token: string | null
   setToken: (newToken: string | null) => void
}

export const useAuth = create<AuthStore>()(set => ({
   token: null,

   setToken: (newToken: string | null) => set(state => {
      if (newToken) {
         setCookie('token', newToken)
      } else {
         deleteCookie('token')
      }

      return { ...state, token: newToken };
   })
}))