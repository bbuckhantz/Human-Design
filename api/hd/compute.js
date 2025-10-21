import { buildChartJSON } from "../../lib/hd-utils.js";

export default async function handler(req, res){
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

  // Facts mode for now: accept gates/channels and normalize to chart_json
  if ((body.gates && body.gates.length) || (body.channels && body.channels.length)) {
    const chart = buildChartJSON(body);
    return res.status(200).json({ ok: true, chart_json: chart, mode: "facts" });
  }

  // Birth compute can be added later with ephemeris
  return res.status(400).json({ ok: false, error: "Provide gates/channels for now; birth compute not wired yet." });
}
