import React, { useLayoutEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Divider,
} from "@mui/material";
import Refresh from "@mui/icons-material/Refresh";
import { Notes, ExpandMore, WarningRounded } from "@mui/icons-material";

NProgress.configure({ showSpinner: false });

type Factory<T> = () => Promise<{ default: React.ComponentType<T> }>;

type FallbackProps = {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
};

export const lazy = <T extends {}>(factory: Factory<T>) => {
  return React.lazy(() => factory().catch(importErrorHandler));
};

function importErrorHandler(err: Error): { default: React.FC } {
  const timeStr = sessionStorage.getItem("last-reload");
  const time = timeStr ? Number(timeStr) : null;
  const now = Date.now();

  if (!time || time + 100_000 < now) {
    console.log("New version for this module found. Reloading...");
    sessionStorage.setItem("last-reload", String(now));
    window.location.reload();
    return { default: () => null };
  }
  console.info(err);
  throw new Error(err.message);
}

type LoaderProps = {
  onLoad?: () => void;
  onComplete?: () => void;
  children: React.ReactNode;
};

function Loader({ onLoad, onComplete, children }: LoaderProps) {
  if (onLoad) {
    onLoad();
  }

  useLayoutEffect(() => {
    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);

  return <>{children}</>;
}

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
};

type ErrorBoundaryProps = {
  fallback: React.ComponentType<FallbackProps>;
  children: React.ReactNode;
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error(error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render(): React.ReactNode {
    const { fallback: Fallback } = this.props;
    const { hasError, error, errorInfo } = this.state;

    if (hasError && Fallback) {
      return <Fallback error={error} errorInfo={errorInfo} />;
    }

    return this.props.children;
  }
}

type AsyncComponentProps<T> = T & {
  onLoad?: () => void;
  onComplete?: () => void;
};

export default function asyncComponent<T>(importComponent: Factory<T>): React.FC<AsyncComponentProps<T>> {
  const AsyncComponent: React.FC<AsyncComponentProps<T>> = (props) => {
    const { onLoad, onComplete, ...rest } = props;

    const Component = lazy(importComponent);

    return (
      <React.Suspense
        fallback={
          <div className="loader-view" style={{ height: "calc(100vh - 200px)" }}>
            <CircularProgress />
          </div>
        }
      >
        <Loader onLoad={onLoad} onComplete={onComplete}>
          <ErrorBoundary
            fallback={({ error, errorInfo }) => (
              <div
                className="loader-view"
                style={{ height: "calc(100vh - 200px)" }}
              >
                <h2 className="mb-3">
                  <WarningRounded
                    color="error"
                    fontSize="large"
                    className="mx-2"
                  />
                  خطایی رخ داده است. لطفا صفحه را رفرش کنید.
                </h2>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => window.location.reload()}
                  startIcon={<Refresh />}
                  size="large"
                >
                  تازه سازی صفحه
                </Button>
                <Accordion
                  variant="outlined"
                  style={{ whiteSpace: "pre-wrap" }}
                  sx={{
                    maxWidth: {
                      sm: "90vw",
                      md: "80vw",
                    },
                  }}
                  className="my-3"
                >
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Notes className="mx-2" /> جزئیات خطا
                  </AccordionSummary>
                  <AccordionDetails
                    style={{
                      maxHeight: "40vh",
                      overflow: "auto",
                      textAlign: "left",
                      fontFamily: "monospace, system-ui",
                      fontSize: "0.85em",
                    }}
                  >
                    <strong>{error?.message}</strong>
                    <div>{error?.stack}</div>
                    <Divider className="mt-3" />
                    <div>{errorInfo?.componentStack}</div>
                  </AccordionDetails>
                </Accordion>
              </div>
            )}
          >
            <Component {...(rest as T)} />
          </ErrorBoundary>
        </Loader>
      </React.Suspense>
    );
  };

  return AsyncComponent;
}
