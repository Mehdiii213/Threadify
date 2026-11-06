"use client";

import { useEffect, useState, useTransition } from "react";
import { saveThread } from "@/app/creations/[id]/actions";
import { CopyButton } from "@/components/copy-button";
import { TWEETS_MAX, TWEET_MAX, tweetLength } from "@/lib/content";

export function ThreadEditor({ creationId, initialTweets }: { creationId: string; initialTweets: string[] }) {
  const [tweets, setTweets] = useState(initialTweets);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [saving, startSaving] = useTransition();

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function update(next: string[]) {
    setTweets(next);
    setDirty(true);
    setStatus(null);
  }
  function move(i: number, delta: -1 | 1) {
    const next = [...tweets];
    [next[i], next[i + delta]] = [next[i + delta], next[i]];
    update(next);
  }

  const tooLong = tweets.some((t) => tweetLength(t) > TWEET_MAX);
  const all = tweets.map((t, i) => `${t}\n\n${i + 1}/${tweets.length}`).join("\n\n---\n\n");

  function save() {
    startSaving(async () => {
      const result = await saveThread(creationId, { tweets });
      if (result.ok) {
        setDirty(false);
        setStatus({ ok: true, message: "✓ Modifications enregistrées" });
      } else {
        setStatus({ ok: false, message: result.error });
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-zinc-600">
          {tweets.length} tweets ·{" "}
          <span
            role="status"
            className={status ? (status.ok ? "text-emerald-700" : "text-red-700") : tooLong ? "text-red-700" : ""}
          >
            {status
              ? status.message
              : tooLong
                ? `Un tweet dépasse ${TWEET_MAX} caractères`
                : dirty
                  ? "Modifications non enregistrées"
                  : "Tout est enregistré"}
          </span>
        </p>
        <div className="flex gap-2">
          <CopyButton text={all} label="Copier tout le thread" />
          <button
            type="button"
            onClick={save}
            disabled={saving || !dirty || tooLong}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </div>

      <ol className="space-y-3">
        {tweets.map((tweet, i) => {
          const length = tweetLength(tweet);
          return (
            <li key={i} className="rounded-xl border border-zinc-200 bg-white p-4">
              <div className="flex items-start gap-3">
                <span className="mt-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                  {i + 1}
                </span>
                <textarea
                  value={tweet}
                  onChange={(e) => update(tweets.map((t, j) => (j === i ? e.target.value : t)))}
                  rows={3}
                  aria-label={`Tweet ${i + 1}`}
                  className="min-w-0 flex-1 resize-y rounded-lg border border-zinc-200 px-3 py-2 text-zinc-800 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                />
              </div>
              <div className="mt-2 flex items-center justify-between gap-2 pl-9">
                <div className="flex gap-1">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Monter le tweet ${i + 1}`} className="rounded-md border border-zinc-300 px-2 py-0.5 text-xs hover:bg-zinc-100 disabled:opacity-30">↑</button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === tweets.length - 1} aria-label={`Descendre le tweet ${i + 1}`} className="rounded-md border border-zinc-300 px-2 py-0.5 text-xs hover:bg-zinc-100 disabled:opacity-30">↓</button>
                  <button type="button" onClick={() => update(tweets.filter((_, j) => j !== i))} disabled={tweets.length <= 1} className="rounded-md border border-red-200 px-2 py-0.5 text-xs text-red-700 hover:bg-red-50 disabled:opacity-30">Supprimer</button>
                  <CopyButton text={tweet} />
                </div>
                <span className={`text-xs tabular-nums ${length > TWEET_MAX ? "font-semibold text-red-700" : "text-zinc-400"}`}>
                  {length} / {TWEET_MAX}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
      <button
        type="button"
        onClick={() => update([...tweets, ""])}
        disabled={tweets.length >= TWEETS_MAX}
        className="w-full rounded-2xl border-2 border-dashed border-zinc-300 py-3 text-sm font-semibold text-zinc-600 hover:border-violet-400 hover:text-violet-700 disabled:opacity-40"
      >
        + Ajouter un tweet
      </button>
    </div>
  );
}
