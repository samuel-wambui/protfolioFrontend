"use client";

import { Bot, Loader2, Send, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import { apiFetch } from "@/lib/api-client";

type PortfolioAskPanelProps = {
  portfolioId: string;
  profileName: string;
};

type PortfolioAgentSearchResult = {
  sourceType?: string;
  sourceId?: string;
  chunkKey?: string;
  title?: string;
  section?: string;
  content?: string;
  metadata?: unknown;
  similarity?: number;
};

type PortfolioAgentSearchResponse = {
  portfolioId?: string;
  profileName?: string;
  facts?: unknown;
  query?: string;
  embeddingModel?: string;
  results?: PortfolioAgentSearchResult[];
  context?: string;
};

export function PortfolioAskPanel({ portfolioId, profileName }: PortfolioAskPanelProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "asking" | "answered" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedQuestion = question.trim();

    if (!normalizedQuestion) {
      return;
    }

    setStatus("asking");
    setAnswer("");
    console.info("[portfolio-agent] asking", { portfolioId, question: normalizedQuestion });

    try {
      const response = await apiFetch<PortfolioAgentSearchResponse>("/portfolio-agent/search", {
        method: "POST",
        auth: false,
        body: {
          portfolioId,
          query: normalizedQuestion,
        },
      });

      const responseText =
        response.context?.trim() ||
        (response.results && response.results.length > 0
          ? response.results
              .map((result, index) =>
                `Result ${index + 1}${result.section ? ` (${result.section})` : ""}: ${result.content ?? "No content"}`,
              )
              .join("\n\n")
          : "No portfolio agent results found.");

      setAnswer(responseText);
      setStatus("answered");
      console.info("[portfolio-agent] answered", { portfolioId, response: responseText });
    } catch (error) {
      const message = error instanceof Error ? error.message : "The portfolio agent is not available right now.";
      setAnswer(message);
      setStatus("error");
      console.error("[portfolio-agent] error", { error, portfolioId });
    }
  }

  return (
    <section className="rounded-lg border border-teal-300/25 bg-[#06111f]/90 p-4 shadow-2xl shadow-black/20">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-teal-300/30 bg-teal-300/10 text-teal-200">
          <Bot className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-teal-300">
            <Sparkles className="h-3.5 w-3.5" />
            Ask Anything About {firstName(profileName)}
          </p>
          <form className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]" onSubmit={handleSubmit}>
            <input
              className="focus-ring min-h-11 rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm text-white placeholder:text-slate-500"
              onChange={(event) => setQuestion(event.target.value)}
              placeholder={`Ask about ${profileName}`}
              value={question}
            />
            <button
              className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-teal-300 bg-teal-300 px-4 text-sm font-bold text-[#031017] transition hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={status === "asking"}
              type="submit"
            >
              {status === "asking" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Ask
            </button>
          </form>
          {answer ? (
            <div
              className={`mt-4 rounded-md border p-4 text-sm leading-7 ${
                status === "error"
                  ? "border-red-400/30 bg-red-500/10 text-red-100"
                  : "border-white/10 bg-white/[0.04] text-slate-200"
              }`}
            >
              {answer}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function firstName(value: string): string {
  return value.trim().split(/\s+/)[0] || "Samuel";
}
