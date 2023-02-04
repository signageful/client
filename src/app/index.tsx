import { createRoot } from "react-dom/client";
import { App } from "./App";
import { RecoilRoot } from "recoil";
import { NetworkDetector } from "./components/network-status";
import { GlobalState } from "./components/sections/global-state";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const container = document.getElementById("root");

const theme = extendTheme({
  styles: {
    global: {
      "#root, body": {
        height: "100vh",
        width: "100vw",
        minWidth: "100vw",
        minHeight: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      },
    },
  },
});

const root = createRoot(container);
root.render(
  <RecoilRoot>
    <ChakraProvider theme={theme}>
      <NetworkDetector>
        <GlobalState>
          <App />
        </GlobalState>
      </NetworkDetector>
    </ChakraProvider>
  </RecoilRoot>
);
