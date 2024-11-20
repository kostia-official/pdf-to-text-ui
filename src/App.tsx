import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { PdfToText } from "./containers/PdfToText";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

const queryClient = new QueryClient();

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <Notifications />

        <PdfToText />
      </MantineProvider>
    </QueryClientProvider>
  );
};
