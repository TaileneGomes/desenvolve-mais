import { BANK, AREAS } from "./conteudo/dificuldades.js";
import { DEV_TABLE } from "./conteudo/marcos.js";
import { WEEKLY_PLAN } from "./conteudo/planoSemanal.js";

export function faixaInfantilFromMeses(meses) {
  return DEV_TABLE.find((f) => meses >= f.minMeses && meses <= f.maxMeses) || null;
}

export function planoKeyFromMeses(meses) {
  const f = faixaInfantilFromMeses(meses);
  if (!f) return null;
  const k = f.key === "5a" ? "4-5a" : f.key;
  return WEEKLY_PLAN[k] ? k : null;
}

export function tierFromAge(age) {
  if (age <= 6) return "inicial";
  if (age <= 9) return "intermediaria";
  return "avancada";
}

export function suggestionsFor(student) {
  const tier = tierFromAge(Number(student.idadeAnos) || 7);
  const list = [];
  student.dificuldades.forEach((d) => {
    const items = BANK[d]?.[tier] || [];
    items.forEach((it) => list.push({ ...it, origem: d }));
  });
  return list;
}

export function areaProgress(student) {
  const counts = {};
  AREAS.forEach((a) => (counts[a.key] = 0));
  const sug = suggestionsFor(student);
  sug.forEach((s) => (counts[s.area] = (counts[s.area] || 0) + 1));
  const max = Math.max(1, ...Object.values(counts));
  return AREAS.map((a) => ({ ...a, pct: Math.min(1, counts[a.key] / (max || 1)) }));
}

export function idadeLabel(meses) {
  const anos = Math.floor(meses / 12);
  const resto = meses % 12;
  if (anos === 0) return `${meses} ${meses === 1 ? "mês" : "meses"}`;
  if (resto === 0) return `${anos} ${anos === 1 ? "ano" : "anos"}`;
  return `${anos}a ${resto}m`;
}

export function fmtTempo(seg) {
  const m = Math.floor(seg / 60);
  const s = seg % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// dd/mm de hoje (formato usado nos registros de acompanhamento).
export function dataCurta(data = new Date()) {
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  return `${dia}/${mes}`;
}
