import OpenAI from "openai";

const SYSTEM_PROMPT = `
You generate comprehensive Human Design reports (>=10 pages) using ONLY the supplied chart_json.
NEVER invent chart data. If a required field is missing, return exactly:
MISSING_FIELDS: [comma-separated-list]
Use headings, bullets, short paragraphs, and practical experiments.
Sections:
1) Cover (summary table)
2) Core Design (Type, Strategy, Authority, Definition, Not-Self, Signature)
3) Profile & Life Themes
4) Energy Centers (9 subsections)
5) Channels & Gates (defined channels first; then top 6 gates with lines)
6) Incarnation Cross
7) Integration (daily checklist, business, relationships, 7-day plan)
Return Markdown only.
`;

export default async function handler(req, res){
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const chart = body.chart_json;
  if (!chart) return res.status(400).json({ error: "chart_json required" });

  const missing = [];
  if (!chart.type) missing.push("type");
  if (!chart.authority) missing.push("authority");
  if (!chart.profile) missing.push("profile");
  if (!chart.centers) missing.push("centers");
  if (missing.length) return res.status(400).send(`MISSING_FIELDS: [${missing.join(", ")}]`);

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.6,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: "chart_json:\n```json\n" + JSON.stringify(chart, null, 2) + "\n```" }
    ]
  });

  const md = completion.choices?.[0]?.message?.content?.trim?.() || "";
  if (!md) return res.status(500).json({ error: "Empty response from model" });
  return res.status(200).json({ ok: true, markdown: md });
}
