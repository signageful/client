import React from "react";

export interface GlobalStateProps {
  children: React.ReactNode;
}

export const GlobalState: React.FC<GlobalStateProps> = ({ children }) => {
  return <>{children}</>;
};
