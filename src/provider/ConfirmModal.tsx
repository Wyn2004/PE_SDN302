"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export interface ConfirmOptions {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive" | "warning" | "info" | "success";
  size?: "sm" | "md" | "lg";
  loadingText?: string;
}

interface ConfirmState {
  isOpen: boolean;
  options: ConfirmOptions;
  resolver?: (value: boolean) => void;
  asyncResolver?: (value: boolean | Promise<void>) => void;
  isLoading: boolean;
}

interface ConfirmContextType {
  confirm: (options?: ConfirmOptions) => Promise<boolean>;
  confirmAsync: (
    asyncAction: () => Promise<any>,
    options?: ConfirmOptions
  ) => Promise<void>;
}

const ConfirmContext = createContext<ConfirmContextType | null>(null);

const defaultOptions: ConfirmOptions = {
  title: "Confirm Action",
  description: "Are you sure you want to proceed?",
  confirmText: "Confirm",
  cancelText: "Cancel",
  variant: "default",
  size: "md",
  loadingText: "Processing...",
};

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ConfirmState>({
    isOpen: false,
    options: defaultOptions,
    isLoading: false,
  });

  const confirm = useCallback(
    (options: ConfirmOptions = {}): Promise<boolean> => {
      return new Promise((resolve) => {
        setState({
          isOpen: true,
          options: { ...defaultOptions, ...options },
          resolver: resolve,
          isLoading: false,
        });
      });
    },
    []
  );

  const confirmAsync = useCallback(
    async (
      asyncAction: () => Promise<any>,
      options: ConfirmOptions = {}
    ): Promise<void> => {
      return new Promise((resolve) => {
        setState({
          isOpen: true,
          options: { ...defaultOptions, ...options },
          asyncResolver: async (confirmed) => {
            if (confirmed) {
              setState((prev) => ({ ...prev, isLoading: true }));
              try {
                await asyncAction();
                setState((prev) => ({
                  ...prev,
                  isOpen: false,
                  isLoading: false,
                }));
                resolve();
              } catch (error) {
                setState((prev) => ({ ...prev, isLoading: false }));
                throw error;
              }
            } else {
              setState((prev) => ({ ...prev, isOpen: false }));
              resolve();
            }
          },
          isLoading: false,
        });
      });
    },
    []
  );

  const handleConfirm = async () => {
    if (state.asyncResolver) {
      await state.asyncResolver(true);
    } else if (state.resolver) {
      state.resolver(true);
      setState((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const handleCancel = () => {
    if (state.asyncResolver) {
      state.asyncResolver(false);
    } else if (state.resolver) {
      state.resolver(false);
    }
    setState((prev) => ({ ...prev, isOpen: false }));
  };

  const getSizeClasses = () => {
    switch (state.options.size) {
      case "sm":
        return "max-w-sm";
      case "lg":
        return "max-w-lg";
      default:
        return "max-w-md";
    }
  };

  return (
    <ConfirmContext.Provider value={{ confirm, confirmAsync }}>
      {children}

      <Dialog
        open={state.isOpen}
        onOpenChange={() => !state.isLoading && handleCancel()}
      >
        <DialogContent className={`${getSizeClasses()} gap-6`}>
          <DialogHeader className="text-center space-y-3">
            <DialogTitle className="text-lg font-semibold">
              {state.options.title}
            </DialogTitle>
            {state.options.description && (
              <DialogDescription className="text-sm text-muted-foreground">
                {state.options.description}
              </DialogDescription>
            )}
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={state.isLoading}
              className="flex-1"
            >
              {state.options.cancelText}
            </Button>
            <Button
              variant={
                state.options.variant === "destructive"
                  ? "destructive"
                  : "default"
              }
              onClick={handleConfirm}
              disabled={state.isLoading}
              className="flex-1"
            >
              {state.isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {state.options.loadingText}
                </>
              ) : (
                state.options.confirmText
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ConfirmContext.Provider>
  );
}

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context;
};
