/*
  日本株オートコンプリート拡張（stockgame.js組み込み用）
  - 既存コードは変更せず、このファイルを新規追加して利用
  - 漢字/ひらがな/カタカナ/英語/証券コード入力に対応
  - 候補表示用に「銘柄名 + 証券コード」を返す

  期待するマスターデータ形式（company.xlsx を JSON 化した後に投入）:
  [
    {
      "code": "7203",
      "symbol": "7203.T",
      "name": "トヨタ自動車",
      "kana": "トヨタジドウシャ",
      "english": "Toyota Motor Corporation",
      "aliases": ["toyota", "とよた"]
    }
  ]

  利用例:
    const engine = window.StockgameJpAutocomplete.createEngine(window.JP_COMPANY_MASTER || []);
    const jp = engine.suggest("とよた", { marketType: "AUTO", limit: 10 });
    // jp[0] => { symbol, market, nameGuess, code, ... }
*/

(function attachStockgameJpAutocomplete(global) {
  "use strict";

  const DEFAULT_LIMIT = 10;
  const MAX_LIMIT = 30;
  const JP_MARKET = "JP";
  const PUNCT_RE = /[ \t\r\n\u3000\-_/.,()[\]{}'"`~!@#$%^&*+=|\\:;<>?！？。、・「」『』【】]/g;
  const KATA_RE = /[\u30A1-\u30F6]/g;
  const HIRA_RE = /[\u3041-\u3096]/g;

  function cleanText(value) {
    return String(value == null ? "" : value)
      .normalize("NFKC")
      .replace(/\u3000/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function kataToHira(text) {
    return String(text || "").replace(KATA_RE, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60));
  }

  function hiraToKata(text) {
    return String(text || "").replace(HIRA_RE, (ch) => String.fromCharCode(ch.charCodeAt(0) + 0x60));
  }

  function normalizeReadable(text) {
    return kataToHira(cleanText(text).toLowerCase());
  }

  function compactSearchKey(text) {
    return normalizeReadable(text).replace(PUNCT_RE, "");
  }

  function stripUnicodeSpaces(s) {
    return String(s || "").replace(/[\s\t\n\r\u00A0\u2000-\u200D\u2028\u2029\u202F\u205F\u3000\uFEFF]/g, "");
  }

  function normalizeCode(value) {
    const s = stripUnicodeSpaces(String(value == null ? "" : value)).replace(/\.T$/gi, "");
    const normalized = s.normalize("NFKC");
    const safe = normalized.replace(/[^0-9A-Z]/g, "").toUpperCase();
    if (!safe) return "";
    if (/^\d{4}$/.test(safe)) return safe;
    if (/^\d{3}[A-Z]$/.test(safe)) return safe;
    return "";
  }

  function normalizeSymbol(value, code) {
    const raw = cleanText(value).toUpperCase().replace(/\s+/g, "");
    if (/^\d{4}\.T$/.test(raw) || /^\d{3}[A-Z]\.T$/.test(raw)) return raw;
    if (/^\d{4}$/.test(raw) || /^\d{3}[A-Z]$/.test(raw)) return `${raw}.T`;
    if (raw) return raw;
    if (/^\d{4}$/.test(code) || /^\d{3}[A-Z]$/.test(code)) return `${code}.T`;
    return "";
  }

  function asArray(value) {
    if (Array.isArray(value)) return value;
    if (value == null || value === "") return [];
    return [value];
  }

  function uniqueStrings(values) {
    const out = [];
    const seen = new Set();
    for (const v of values) {
      const text = cleanText(v);
      if (!text) continue;
      const key = text.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(text);
    }
    return out;
  }

  function parseMasterRow(rawRow) {
    const raw = rawRow && typeof rawRow === "object" ? rawRow : {};
    const code = normalizeCode(
      raw.code ?? raw.証券コード ?? raw.銘柄コード ?? raw.code4 ?? raw["コード"]
    );
    const name = cleanText(
      raw.name ?? raw.銘柄名 ?? raw.会社名 ?? raw.company ?? raw["銘柄名称"]
    );
    if (!code || !name) return null;

    const symbol = normalizeSymbol(raw.symbol ?? raw.シンボル ?? raw.ticker, code);
    const kana = cleanText(raw.kana ?? raw.カナ ?? raw.銘柄名カナ ?? raw["読み"]);
    const english = cleanText(raw.english ?? raw.en ?? raw.英語名 ?? raw["英文名"]);
    const extraAliases = asArray(raw.aliases ?? raw.別名 ?? raw.alias ?? []);
    const aliases = uniqueStrings([
      name,
      kana,
      english,
      code,
      `${code}.T`,
      symbol,
      ...extraAliases,
      ...english.split(/\s+/)
    ]);

    const aliasCompacts = Array.from(
      new Set(aliases.map((x) => compactSearchKey(x)).filter(Boolean))
    );

    return {
      code,
      symbol: symbol || `${code}.T`,
      market: JP_MARKET,
      name,
      kana,
      english,
      aliases,
      aliasCompacts,
      nameCompact: compactSearchKey(name),
      kanaCompact: compactSearchKey(kana),
      englishCompact: compactSearchKey(english),
      symbolCompact: compactSearchKey(symbol || `${code}.T`),
      codeCompact: compactSearchKey(code),
      searchableText: aliasCompacts.join("|")
    };
  }

  function mergeRow(base, incoming) {
    const aliases = uniqueStrings([...(base.aliases || []), ...(incoming.aliases || [])]);
    const aliasCompacts = Array.from(
      new Set(aliases.map((x) => compactSearchKey(x)).filter(Boolean))
    );
    return {
      ...base,
      kana: base.kana || incoming.kana,
      english: base.english || incoming.english,
      aliases,
      aliasCompacts,
      searchableText: aliasCompacts.join("|")
    };
  }

  function clampLimit(limit) {
    const n = Number(limit);
    if (!Number.isFinite(n)) return DEFAULT_LIMIT;
    return Math.max(1, Math.min(MAX_LIMIT, Math.floor(n)));
  }

  function splitKanaAscii(str) {
    const parts = [];
    let run = "";
    let prevAscii = null;
    for (let i = 0; i < str.length; i++) {
      const c = str[i];
      const ascii = /[a-zA-Z0-9]/.test(c);
      if (prevAscii !== null && prevAscii !== ascii && run) {
        parts.push(run);
        run = "";
      }
      prevAscii = ascii;
      run += c;
    }
    if (run) parts.push(run);
    return parts;
  }

  function buildQueryInfo(query) {
    const raw = cleanText(query);
    const compact = compactSearchKey(raw);
    const upper = raw.toUpperCase().replace(/\s+/g, "");
    const code = normalizeCode(raw);
    const normalized = normalizeReadable(raw);
    const spaceTokens = normalized.split(/[ \t]+/).map((x) => compactSearchKey(x)).filter(Boolean);
    const boundaryTokens = splitKanaAscii(normalized).map((x) => compactSearchKey(x)).filter(Boolean);
    const tokens = Array.from(new Set([...spaceTokens, ...boundaryTokens]));
    return { raw, compact, upper, code, tokens };
  }

  function scoreByField(field, queryCompact, startsWeight, includesWeight) {
    if (!field || !queryCompact) return 0;
    if (field === queryCompact) return startsWeight + 180;
    if (field.startsWith(queryCompact)) return startsWeight - Math.min(60, field.length - queryCompact.length);
    const idx = field.indexOf(queryCompact);
    if (idx >= 0) return includesWeight - Math.min(80, idx);
    return 0;
  }

  function scoreRow(row, q) {
    if (!q.compact) return 0;

    let score = 0;

    if (q.code && row.code === q.code) score = Math.max(score, 3000);
    if (q.upper && row.symbol.toUpperCase() === q.upper) score = Math.max(score, 2900);

    if (q.code && row.code.startsWith(q.code)) {
      score = Math.max(score, 2600 - (row.code.length - q.code.length) * 8);
    }

    score = Math.max(score, scoreByField(row.nameCompact, q.compact, 2300, 2050));
    score = Math.max(score, scoreByField(row.kanaCompact, q.compact, 2250, 2000));
    score = Math.max(score, scoreByField(row.englishCompact, q.compact, 2200, 1950));
    score = Math.max(score, scoreByField(row.codeCompact, q.compact, 2550, 2100));
    score = Math.max(score, scoreByField(row.symbolCompact, q.compact, 2450, 2050));

    for (const alias of row.aliasCompacts) {
      score = Math.max(score, scoreByField(alias, q.compact, 2100, 1850));
    }

    for (const token of q.tokens) {
      if (!token) continue;
      score = Math.max(score, scoreByField(row.nameCompact, token, 2100, 1850));
      score = Math.max(score, scoreByField(row.kanaCompact, token, 2050, 1800));
      score = Math.max(score, scoreByField(row.englishCompact, token, 2050, 1800));
      for (const alias of row.aliasCompacts) {
        score = Math.max(score, scoreByField(alias, token, 2000, 1750));
      }
    }

    if (!score) return 0;

    if (q.tokens.length >= 2) {
      const allHit = q.tokens.every((t) => row.searchableText.includes(t));
      score += allHit ? 90 : -120;
    }

    return score;
  }

  function toSuggestionRow(row, score) {
    return {
      symbol: row.symbol,
      market: JP_MARKET,
      nameGuess: `${row.name} (${row.code})`,
      code: row.code,
      displayName: row.name,
      kana: row.kana,
      english: row.english,
      source: "JP_MASTER",
      score
    };
  }

  function mergeSuggestionRows(baseRows, extraRows, limit) {
    const out = [];
    const seen = new Set();
    for (const item of [...(baseRows || []), ...(extraRows || [])]) {
      const symbol = cleanText(item?.symbol).toUpperCase();
      if (!symbol || seen.has(symbol)) continue;
      seen.add(symbol);
      out.push(item);
      if (out.length >= limit) break;
    }
    return out;
  }

  function createEngine(masterRows) {
    const parsed = (Array.isArray(masterRows) ? masterRows : [])
      .map(parseMasterRow)
      .filter(Boolean);

    const byCode = new Map();
    for (const row of parsed) {
      const prev = byCode.get(row.code);
      byCode.set(row.code, prev ? mergeRow(prev, row) : row);
    }

    const rows = [...byCode.values()].sort((a, b) => a.code.localeCompare(b.code, "ja"));
    const codeMap = new Map(rows.map((r) => [r.code, r]));
    const symbolMap = new Map(rows.map((r) => [r.symbol.toUpperCase(), r]));

    var prefix1Sets = Object.create(null);
    var prefix2Sets = Object.create(null);
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      var compacts = r.aliasCompacts || [];
      for (var c = 0; c < compacts.length; c++) {
        var s = compacts[c];
        if (!s || typeof s !== "string") continue;
        if (s.length >= 1) {
          var c1 = s[0];
          if (!prefix1Sets[c1]) prefix1Sets[c1] = [];
          prefix1Sets[c1].push(i);
        }
        if (s.length >= 2) {
          var c2 = s.slice(0, 2);
          if (!prefix2Sets[c2]) prefix2Sets[c2] = [];
          prefix2Sets[c2].push(i);
        }
      }
    }
    var prefix1Index = Object.create(null);
    for (var k in prefix1Sets) {
      var arr = prefix1Sets[k];
      var seen = new Set();
      var uniq = [];
      for (var u = 0; u < arr.length; u++) {
        if (!seen.has(arr[u])) { seen.add(arr[u]); uniq.push(arr[u]); }
      }
      prefix1Index[k] = uniq;
    }
    var prefix2Index = Object.create(null);
    for (var k2 in prefix2Sets) {
      var arr2 = prefix2Sets[k2];
      var seen2 = new Set();
      var uniq2 = [];
      for (var u2 = 0; u2 < arr2.length; u2++) {
        if (!seen2.has(arr2[u2])) { seen2.add(arr2[u2]); uniq2.push(arr2[u2]); }
      }
      prefix2Index[k2] = uniq2;
    }

    function suggest(query, options = {}) {
      const marketType = options.marketType || "AUTO";
      if (marketType !== "AUTO" && marketType !== JP_MARKET) return [];

      const limit = clampLimit(options.limit);
      const q = buildQueryInfo(query);
      if (!q.compact) return [];

      const rawUpper = cleanText(query).toUpperCase();
      const isCompleteSymbol = /^\d{4}\.T$/.test(rawUpper) || /^\d{3}[A-Z]\.T$/.test(rawUpper) || /^\.T$/.test(rawUpper);

      const scored = [];
      const exactCode = q.code ? codeMap.get(q.code) : null;
      if (exactCode) {
        scored.push({ row: exactCode, score: 9999 });
      }
      const exactSymbol = q.upper ? symbolMap.get(q.upper) : null;
      if (exactSymbol && (!exactCode || exactSymbol.code !== exactCode.code)) {
        scored.push({ row: exactSymbol, score: 9980 });
      }

      if (isCompleteSymbol) {
        scored.sort((a, b) => b.score - a.score || a.row.code.localeCompare(b.row.code, "ja"));
        return scored.slice(0, limit).map((x) => toSuggestionRow(x.row, x.score));
      }

      var prefixLen = q.compact.length >= 2 ? 2 : 1;
      var prefix = q.compact.slice(0, prefixLen);
      var maxCandidates = 500;
      var indexSet = new Set();
      if (prefixLen >= 2 && prefix2Index[prefix]) {
        var list2 = prefix2Index[prefix];
        for (var t = 0; t < list2.length && indexSet.size < maxCandidates; t++) indexSet.add(list2[t]);
      }
      if (indexSet.size < maxCandidates && q.compact.length >= 1 && prefix1Index[q.compact[0]]) {
        var list1 = prefix1Index[q.compact[0]];
        for (var t1 = 0; t1 < list1.length && indexSet.size < maxCandidates; t1++) indexSet.add(list1[t1]);
      }
      var codePrefix = q.code;
      var upperPrefix = q.upper;
      for (var i = 0; i < rows.length && indexSet.size < maxCandidates; i++) {
        var r = rows[i];
        if (exactCode && r.code === exactCode.code) continue;
        if (exactSymbol && r.code === exactSymbol.code) continue;
        if (codePrefix && r.code.startsWith(codePrefix)) { indexSet.add(i); continue; }
        if (upperPrefix && r.symbol.toUpperCase().startsWith(upperPrefix)) { indexSet.add(i); continue; }
      }
      if (indexSet.size === 0 && prefix) {
        for (var i = 0; i < rows.length && indexSet.size < maxCandidates; i++) {
          if (rows[i].searchableText.indexOf(prefix) >= 0) indexSet.add(i);
        }
      }
      var candidateIndices = Array.from(indexSet).slice(0, maxCandidates);
      var candidates = [];
      for (var j = 0; j < candidateIndices.length; j++) {
        var r = rows[candidateIndices[j]];
        if (exactCode && r.code === exactCode.code) continue;
        if (exactSymbol && r.code === exactSymbol.code) continue;
        candidates.push(r);
      }
      for (var j = 0; j < candidates.length; j++) {
        var sc = scoreRow(candidates[j], q);
        if (sc > 0) scored.push({ row: candidates[j], score: sc });
      }

      scored.sort((a, b) => b.score - a.score || a.row.code.localeCompare(b.row.code, "ja"));
      return scored.slice(0, limit).map((x) => toSuggestionRow(x.row, x.score));
    }

    return {
      size: rows.length,
      getAllRows() {
        return rows.slice();
      },
      findByCode(code) {
        const normalized = normalizeCode(code);
        return normalized ? codeMap.get(normalized) || null : null;
      },
      findBySymbol(symbol) {
        const key = cleanText(symbol).toUpperCase();
        return key ? symbolMap.get(key) || null : null;
      },
      suggest,
      mergeWithExisting(baseRows, query, options = {}) {
        const limit = clampLimit(options.limit);
        const jpRows = suggest(query, options);
        return mergeSuggestionRows(baseRows, jpRows, limit);
      }
    };
  }

  // 画面表示用HTML（銘柄名 + コード + シンボル）
  function renderSuggestionHtml(list, marketLabelFn) {
    const marketLabel = typeof marketLabelFn === "function"
      ? marketLabelFn
      : (() => "日本株");
    return (Array.isArray(list) ? list : [])
      .map((item) => {
        const symbol = escapeHtml(item.symbol || "");
        const market = escapeHtml(item.market || JP_MARKET);
        const name = escapeHtml(item.displayName || item.nameGuess || item.symbol || "");
        const code = escapeHtml(item.code || "");
        const codeText = code ? `<span class="suggest-code">[${code}]</span>` : "";
        return `
          <button type="button" class="suggest-item" data-action="apply-suggest" data-symbol="${symbol}" data-market="${market}">
            <span class="suggest-name">${name} ${codeText}</span>
            <span class="suggest-meta">${symbol} / ${escapeHtml(marketLabel(item.market))}</span>
          </button>
        `;
      })
      .join("");
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  global.StockgameJpAutocomplete = Object.freeze({
    createEngine,
    renderSuggestionHtml,
    helpers: Object.freeze({
      cleanText,
      compactSearchKey,
      normalizeCode,
      normalizeSymbol,
      parseMasterRow
    })
  });
})(window);
