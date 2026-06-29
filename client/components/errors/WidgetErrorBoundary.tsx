"use client";

import { Component, type ReactNode } from "react";

import { reportClientError } from "@/lib/error-reporting";
import WidgetErrorFallback from "./WidgetErrorFallback";

type WidgetErrorBoundaryProps = {
  children: ReactNode;
  context: string;
  fallbackTitle?: string;
  fallbackMessage?: string;
};

type WidgetErrorBoundaryState = {
  hasError: boolean;
};

export default class WidgetErrorBoundary extends Component<
  WidgetErrorBoundaryProps,
  WidgetErrorBoundaryState
> {
  state: WidgetErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): WidgetErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    reportClientError({ error, context: this.props.context });
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <WidgetErrorFallback
          title={this.props.fallbackTitle}
          message={this.props.fallbackMessage}
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}
