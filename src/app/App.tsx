import React from "react";
import { Screensaver } from "./components/screensaver/screensaver";
import { useSystemInfo } from "./hooks/use-system-info";
import { useScreensaver } from "./components/screensaver/use-screensaver";
import { Box } from "@chakra-ui/react";

const searchParams = new URLSearchParams(window.location.search);
const target = searchParams.get("target") || "";
const targetURL = new URL(target);
const serialParams = new URLSearchParams(targetURL.search);
const serial = serialParams.get("serial") || "";

export const App: React.FC = () => {
  useSystemInfo(serial);
  const [iframeRef, onLoad] = useScreensaver();

  return (
    <Box position="absolute" inset={0} overflow="hidden">
      <iframe
        title="External"
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        src={target!}
        width="100%"
        height="100%"
        style={{
          border: "none",
        }}
        ref={iframeRef}
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        onLoad={onLoad}
      />
      <Screensaver />
    </Box>
  );
};
