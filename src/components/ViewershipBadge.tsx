"use client";

import { ViewershipInfo } from "@/lib/types";

const LEVEL_STYLES: Record<number, string> = {
  5: "bg-red-100 text-red-800 border-red-300",
  4: "bg-orange-100 text-orange-800 border-orange-300",
  3: "bg-yellow-100 text-yellow-800 border-yellow-300",
  2: "bg-green-100 text-green-800 border-green-300",
  1: "bg-gray-100 text-gray-600 border-gray-300",
};

export default function ViewershipBadge({
  viewership,
}: {
  viewership: ViewershipInfo;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full border ${LEVEL_STYLES[viewership.level]}`}
    >
      <span>{viewership.emoji}</span>
      <span>{viewership.label}</span>
    </span>
  );
}
