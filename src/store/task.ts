import { create } from "zustand";
import { Task } from "../types/task";
import { api } from "../lib/axios";

type TaskStore = {
   tasks: Task[]
   setTasks: (tasks: Task[]) => void
   getUserTasks: () => Promise<void>
}

export const useTasks = create<TaskStore>()(set => ({
   tasks: [],
   setTasks: (tasks: Task[]) => set({ tasks }),

   getUserTasks: async () => {
      await api.get('/tasks')
         .then(res => {
            set({ tasks: res.data.tasks })
            console.log(res.data.tasks)
         })
   }

}))