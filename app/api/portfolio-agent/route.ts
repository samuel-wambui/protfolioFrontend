import { NextRequest, NextResponse } from "next/server";
import { normalizePortfolioId } from "@/lib/portfolio-id";

const DEFAULT_N8N_WEBHOOK_URL = "http://127.0.0.1:5678/webhook/portfolio-agent-ask";

type N8nAgentResponse = {
  answer?: string;
  output?: string;
  message?: string;
  data?: {
    answer?: string;
    output?: string;
    message?: string;
  };
  sources?: unknown[];
};

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    portfolioId?: string;
    question?: string;
  } | null;

  const question = body?.question?.trim() ?? "";
  const portfolioId = normalizePortfolioId(body?.portfolioId);

  if (!question) {
    return NextResponse.json({ message: "Question is required" }, { status: 400 });
  }

  const webhookUrl = process.env.N8N_PORTFOLIO_AGENT_WEBHOOK_URL || DEFAULT_N8N_WEBHOOK_URL;
  console.info("[portfolio-agent] forwarding request to n8n", { portfolioId, webhookUrl });

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        portfolioId,
        question,
      }),
    });

    const payload = (await response.json().catch(() => ({}))) as N8nAgentResponse;

    if (!response.ok) {
      console.error("[portfolio-agent] n8n error", { payload, status: response.status });
      return NextResponse.json(
        { message: payload.message || "Portfolio agent request failed" },
        { status: response.status },
      );
    }

    const answer = payload.answer || payload.output || payload.data?.answer || payload.data?.output || payload.message || "";
    console.info("[portfolio-agent] n8n answered", { portfolioId });

    return NextResponse.json({
      answer,
      sources: payload.sources ?? [],
    });
  } catch (error) {
    console.error("[portfolio-agent] n8n unavailable", { error, portfolioId });
    return NextResponse.json({ message: "Portfolio agent is not available right now" }, { status: 502 });
  }
}
