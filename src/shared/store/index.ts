import { createOptimizedContext } from "@/shared/lib";

interface AppContextData {
  dialogStack: string[];
}

export const { Provider: AppProvider, useSelector, useUpdate } = createOptimizedContext<AppContextData>();