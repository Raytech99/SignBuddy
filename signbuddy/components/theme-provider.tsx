import React, { FC, ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

const ThemeProvider: FC<ThemeProviderProps> = ({
  children,
  attribute,
  defaultTheme,
  enableSystem,
  disableTransitionOnChange,
}) => {
  // Implement your theme logic here.
  return <div>{children}</div>;
};

export default ThemeProvider;
