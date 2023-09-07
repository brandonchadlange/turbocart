import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "react-query";
import { StrategyStateProvider } from "@/frontend/providers/strategy";
import { OrdersDisabled } from "@/components/orders-disabled";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <StrategyStateProvider>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: "light",
          }}
        >
          <Notifications position="top-left" />
          <OrdersDisabled />
          {/* <Component {...pageProps} /> */}
        </MantineProvider>
      </StrategyStateProvider>
    </QueryClientProvider>
  );
}
