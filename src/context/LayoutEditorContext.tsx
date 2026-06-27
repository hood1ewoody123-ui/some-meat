"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { allObjects } from "@/data/compositions";
import {
  formatAllOverrides,
  formatObjectSnippet,
  loadLayoutOverrides,
  saveLayoutOverrides,
  type LayoutOverride,
} from "@/lib/layout/storage";
import type { FlatSceneObject } from "@/types/scene";

const POS_STEP = 8;
const SCALE_STEP = 0.05;

type LayoutEditorContextValue = {
  enabled: boolean;
  overrides: Record<string, LayoutOverride>;
  confirmedIds: Set<string>;
  adjust: (id: string, base: FlatSceneObject, delta: Partial<LayoutOverride>) => void;
  confirm: (object: FlatSceneObject) => void;
  getEffective: (object: FlatSceneObject) => LayoutOverride;
  exportAll: () => string;
  clearAll: () => void;
};

const LayoutEditorContext = createContext<LayoutEditorContextValue | null>(null);

function baseValues(object: FlatSceneObject): LayoutOverride {
  return {
    x: object.position.x,
    y: object.position.y,
    scale: object.scale,
  };
}

type ProviderProps = {
  enabled: boolean;
  children: ReactNode;
};

export function LayoutEditorProvider({ enabled, children }: ProviderProps) {
  const [overrides, setOverrides] = useState<Record<string, LayoutOverride>>({});
  const [confirmedIds, setConfirmedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!enabled) return;
    const saved = loadLayoutOverrides();
    if (Object.keys(saved).length > 0) {
      setOverrides(saved);
      setConfirmedIds(new Set(Object.keys(saved)));
    }
  }, [enabled]);

  const getEffective = useCallback(
    (object: FlatSceneObject): LayoutOverride => {
      if (!enabled) return baseValues(object);
      return overrides[object.id] ?? baseValues(object);
    },
    [enabled, overrides],
  );

  const adjust = useCallback(
    (id: string, base: FlatSceneObject, delta: Partial<LayoutOverride>) => {
      setOverrides((prev) => {
        const current = prev[id] ?? baseValues(base);
        const next: LayoutOverride = {
          x: current.x + (delta.x ?? 0),
          y: current.y + (delta.y ?? 0),
          scale: Math.max(0.1, current.scale + (delta.scale ?? 0)),
        };
        return { ...prev, [id]: next };
      });
      setConfirmedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    },
    [],
  );

  const confirm = useCallback((object: FlatSceneObject) => {
    setOverrides((prev) => {
      const value = prev[object.id] ?? baseValues(object);
      const next = { ...prev, [object.id]: value };
      saveLayoutOverrides(next);
      const snippet = formatObjectSnippet(object, value);
      void navigator.clipboard?.writeText(snippet);
      console.info(`[layout] ✓ ${object.id}\n${snippet}`);
      return next;
    });
    setConfirmedIds((prev) => new Set(prev).add(object.id));
  }, []);

  const exportAll = useCallback(() => {
    return formatAllOverrides(allObjects, overrides);
  }, [overrides]);

  const clearAll = useCallback(() => {
    setOverrides({});
    setConfirmedIds(new Set());
    saveLayoutOverrides({});
  }, []);

  const value = useMemo(
    () => ({
      enabled,
      overrides,
      confirmedIds,
      adjust,
      confirm,
      getEffective,
      exportAll,
      clearAll,
    }),
    [
      enabled,
      overrides,
      confirmedIds,
      adjust,
      confirm,
      getEffective,
      exportAll,
      clearAll,
    ],
  );

  return (
    <LayoutEditorContext.Provider value={value}>
      {children}
    </LayoutEditorContext.Provider>
  );
}

export function useLayoutEditor(): LayoutEditorContextValue {
  const ctx = useContext(LayoutEditorContext);
  if (!ctx) {
    return {
      enabled: false,
      overrides: {},
      confirmedIds: new Set(),
      adjust: () => {},
      confirm: () => {},
      getEffective: (object) => baseValues(object),
      exportAll: () => "",
      clearAll: () => {},
    };
  }
  return ctx;
}

export { POS_STEP, SCALE_STEP };
