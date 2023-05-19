import { ReactNode, createContext, useContext } from "react";
import { useQuery } from "react-query";
import queries from "../utils/queries";
import strategyMakerMap from "@/strategies";

type StrategyState = {
  strategy: SystemStrategy;
};

const ModuleStateContext = createContext<StrategyState>({} as any);

export const StrategyStateProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const merchantQuery = useQuery("merchant", queries.fetchMerchantDetail);

  if (merchantQuery.isLoading) {
    return <>Loading...</>;
  }

  const merchant = merchantQuery.data!;
  const strategyType = merchant.strategy as SystemStrategyType;
  const strategy = strategyMakerMap[strategyType]();

  return (
    <ModuleStateContext.Provider
      value={{
        strategy,
      }}
    >
      {children}
    </ModuleStateContext.Provider>
  );
};

export const useStrategyState = () => useContext(ModuleStateContext);
