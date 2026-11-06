import { CopyButton } from "@/components/copy-button";
import { TWEET_MAX, tweetLength, type GeneratedContent } from "@/lib/generation";

// Affichage simple du contenu généré (le design des slides arrive à l'étape 4).
export function GeneratedContentView({ content }: { content: GeneratedContent }) {
  if (content.type === "thread") {
    const all = content.tweets.map((t, i) => `${t}\n\n${i + 1}/${content.tweets.length}`).join("\n\n---\n\n");
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-600">{content.tweets.length} tweets</p>
          <CopyButton text={all} label="Copier tout le thread" />
        </div>
        <ol className="space-y-3">
          {content.tweets.map((tweet, i) => {
            const length = tweetLength(tweet);
            return (
              <li key={i} className="rounded-xl border border-zinc-200 bg-white p-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                    {i + 1}
                  </span>
                  <p className="flex-1 whitespace-pre-line text-zinc-800">{tweet}</p>
                  <CopyButton text={tweet} />
                </div>
                <p className={`mt-2 text-right text-xs tabular-nums ${length > TWEET_MAX ? "text-red-700" : "text-zinc-400"}`}>
                  {length} / {TWEET_MAX}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-zinc-600">{content.slides.length} slides</p>
      <ol className="grid gap-4 sm:grid-cols-2">
        {content.slides.map((slide, i) => (
          <li
            key={i}
            className="flex aspect-[4/5] flex-col rounded-2xl border border-zinc-200 bg-gradient-to-br from-white to-violet-50 p-6 shadow-sm"
          >
            <span className="text-xs font-semibold text-violet-700">
              {i + 1} / {content.slides.length}
            </span>
            <div className="flex flex-1 flex-col justify-center">
              <h3 className="text-xl font-bold leading-snug text-zinc-900">{slide.titre}</h3>
              <p className="mt-3 text-zinc-700">{slide.texte}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
