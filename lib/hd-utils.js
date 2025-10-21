import { CHANNELS, CENTER_BY_GATE, ALL_CENTERS, inferTypeAndAuthority } from "./hd-tables.js";

export function gatesToChannels(gates) {
  const set = new Set(gates.map(g => String(g).split(".")[0]));
  return CHANNELS
    .filter(([a,b]) => set.has(a) && set.has(b))
    .map(([a,b]) => `${a}-${b}`);
}

export function centersFromGates(gates, channels) {
  const defined = new Set();
  const gateIds = new Set(gates.map(g => String(g).split(".")[0]));

  for (const gid of gateIds) {
    const c = CENTER_BY_GATE[gid];
    if (c) defined.add(c);
  }
  for (const ch of channels) {
    const [a,b] = ch.split("-");
    const ca = CENTER_BY_GATE[a], cb = CENTER_BY_GATE[b];
    if (ca) defined.add(ca);
    if (cb) defined.add(cb);
  }

  const undefined = ALL_CENTERS.filter(c => !defined.has(c));
  return { defined: [...defined], undefined };
}

export function buildChartJSON(input){
  const chart = {
    name: input.name || "",
    birth: { date: input.birthDate||"", time: input.birthTime||"", city: input.birthPlace||"", tz: input.tz||"" },
    profile: input.profile || "",
    definition: input.definition || "",
    not_self_theme: input.notSelf || "",
    signature: input.signature || "",
    incarnation_cross: { name: input.cross || "" }
  };

  const gates = (input.gates || []).map(s => String(s).trim()).filter(Boolean);
  const channels = (input.channels && input.channels.length) ? input.channels : gatesToChannels(gates);

  const { defined } = centersFromGates(gates, channels);
  const { type, authority } = inferTypeAndAuthority(new Set(defined), channels);

  chart.type = input.type || type;
  chart.strategy = input.strategy || (
    chart.type==="Manifestor" ? "To Inform" :
    chart.type==="Projector" ? "Wait for the Invitation" :
    chart.type==="Reflector" ? "Wait a Lunar Cycle" : "To Respond"
  );
  chart.authority = input.authority || authority;
  chart.centers = Object.fromEntries(ALL_CENTERS.map(c => [c, defined.includes(c) ? "defined" : "undefined"]));
  chart.channels = channels.map(id => ({ id, defined: true }));
  chart.gates = gates.map(g => {
    const [id,line] = g.split(".");
    return { id: Number(id), line: line ? Number(line) : null, defined: true };
  });

  return chart;
}
