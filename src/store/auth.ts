import { deleteCookie, setCookie } from "cookies-next";
import { create } from "zustand";

type Store = {
   token: string | null
   setToken: (newToken: string | null) => void
}
export const useAuth = create<Store>()(set => ({
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