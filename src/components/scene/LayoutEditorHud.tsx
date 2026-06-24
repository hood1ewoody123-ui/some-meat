"use client";

import { useLayoutEditor } from "@/context/LayoutEditorContext";

export function LayoutEditorHud() {
  const { enabled, confirmedIds, exportAll, clearAll } = useLayoutEditor();

  if (!enabled) return null;

  const copyAll = async () => {
    const text = exportAll();
    await navigator.clipboard?.writeText(text);
    console.info(`[layout] export\n${text}`);
  };

  return (
    <div className="pointer-events-auto fixed left-3 top-3 z-[10000] max-w-xs rounded-lg bg-black/90 p-3 ring-1 ring-[#8DC0FF]/50">
      <p className="text-xs font-medium text-[#8DC0FF]">Layout editor</p>
      <p className="mt-1 text-[10px] leading-snug text-[#8DC0FF]/70">
        У каждого объекта: стрелки, ± размер, ✓ — утвердить (копирует в буфер +
        localStorage). Открой с{" "}
        <code className="text-[#8DC0FF]">?layout=1</code>
      </p>
      <p className="mt-2 text-[10px] text-[#8DC0FF]/60">
        Утверждено: {confirmedIds.size}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded px-2 py-1 text-[10px] text-[#8DC0FF] ring-1 ring-[#8DC0FF]/40 hover:bg-[#8DC0FF]/10"
          onClick={() => void copyAll()}
        >
          Скопировать всё
        </button>
        <button
          type="button"
          className="rounded px-2 py-1 text-[10px] text-[#8DC0FF]/70 ring-1 ring-white/20 hover:bg-white/5"
          onClick={clearAll}
        >
          Сбросить
        </button>
      </div>
    </div>
  );
}
