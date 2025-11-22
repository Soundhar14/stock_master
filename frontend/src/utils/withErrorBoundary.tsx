// utils/withErrorBoundary.tsx
import React from "react";
import ErrorBoundary from "../components/common/ErrorBoundary";
import { ErrorPageContent } from "../pages/ErrorPage";

const withErrorBoundary = (
  Component: React.ReactNode,
  Fallback = (
    <ErrorPageContent
      error={new Error("Something went wrong")}
      onRefresh={() => {
        window.location.reload();
      }}
    />
  ),
) => <ErrorBoundary fallback={Fallback}>{Component}</ErrorBoundary>;

export default withErrorBoundary;
