import { createOptimizedContext } from "@/shared/lib";

interface IAppContextData {
  dialogStack: string[];
}

export const { Provider: AppProvider, useSelector, useUpdate } = createOptimizedContext<IAppContextData>();