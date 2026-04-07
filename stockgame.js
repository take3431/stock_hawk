"use strict";

const CONFIG = Object.freeze({
  storageKey: "stockgame_v1_state",
  schemaVersion: 2,
  jstTimeZone: "Asia/Tokyo",
  /** ローカルモードの登録上限。Supabase 利用時は Edge の MAX_APP_USERS（既定 100）と表示・登録拒否を揃える。 */
  maxUsers: 100,
  // HTML/ルール表示が「最低1銘柄」になっているため揃える
  minPicks: 1,
  maxPicks: 5,
  purchaseDays: 31,
  rankingKeepMonths: 36,
  quoteTtlMs: 30 * 60 * 1000,
  historyTtlMs: 12 * 60 * 60 * 1000,
  staleQuoteMaxMs: 24 * 60 * 60 * 1000,
  fetchGapMs: 600,
  fetchTimeoutMs: 5000,
  interactiveFetchTimeoutMs: 2500,
  interactiveBudgetMs: 5000,
  maxRouteAttemptsPerRequest: 2,
  proxyPrefixes: [],
  enableBootAutoRefresh: false,
  loginFailWindowMs: 10 * 60 * 1000,
  loginLockMs: 10 * 60 * 1000,
  maxRegistrationsPerHour: 3,
  passwordIterations: 210000,
  // 通報の段階（匿名化 → 削除）を矛盾なく成立させる
  reportAliasThreshold: 3,
  reportDeleteThreshold: 5,
  fetchMinGapMs: 600,
  /** 現在値ボタンなど対話操作時は直列待ちを短く（Yahoo 自体の回数は減らしたうえで体感を改善） */
  interactiveFetchGapMs: 220,
  previewCacheMaxAgeMs: 10 * 60 * 1000,
  /** 連打で API が不安定になるのを防ぐ（ブラウザ側スライディングウィンドウ） */
  clientRatePreviewWindowMs: 60 * 1000,
  /** 現在値確認は通常ゆるめ。しつこい連打は preview 専用→グローバルエスカレーションへ */
  clientRatePreviewMax: 18,
  /** 10分窓でプレビュー拒否がこの回数に達するごとに、グローバル制限を1段相当追加 */
  escalationPreviewRejectionsPer10mStrike: 10,
  clientRateAccountWindowMs: 60 * 1000,
  clientRateAccountMax: 12,
  clientRateMyPricesWindowMs: 60 * 1000,
  clientRateMyPricesMax: 10,
  clientRateRankWindowMs: 60 * 1000,
  clientRateRankMax: 3,
  clientRateDiagWindowMs: 60 * 1000,
  clientRateDiagMax: 3,
  /** 銘柄追加・確定・売却・削除・一つ戻るなど（fetch + 保存の連打） */
  clientRatePickActionWindowMs: 60 * 1000,
  clientRatePickActionMax: 15,
  /** ログイン・登録確定など認証送信の連打 */
  clientRateAuthSubmitWindowMs: 60 * 1000,
  clientRateAuthSubmitMax: 10,
  /** マイページの名前変更・パスワード変更など */
  clientRateAccountEditWindowMs: 60 * 1000,
  clientRateAccountEditMax: 10,
  /** 通報・通報解除の連打 */
  clientRateReportWindowMs: 60 * 1000,
  clientRateReportMax: 8,
  /** 同期URLコピー（Firestore は使わないが悪用時のノイズ軽減） */
  clientRateSyncCopyWindowMs: 60 * 1000,
  clientRateSyncCopyMax: 12,
  /** Firebase 同期 pull の最短間隔（フォーカス連打で読み取り過多にならないように） */
  cloudPullMinIntervalMs: 10 * 1000,
  /** 未ログイン向け ranking-snapshot のクライアント側スロットル（タブ復帰・可視化の連打対策。日4回の定時取得は別ルート） */
  /* 可視タブの定期 pull でランキングを取り直す最短間隔（削除反映を遅らせないよう短め） */
  publicRankingSnapshotMinIntervalMs: 2 * 60 * 1000,
  /** 同一クライアントからの Yahoo Finance（query1 / chart / search）への最短間隔（ms）。429 回避の余裕を少し持たせる */
  yahooFinanceMinGapMs: 620,
  /** Yahoo 銘柄検索 API（v1/search）の連打制限（嫌がらせ・スキャン対策） */
  clientRateYahooSearchWindowMs: 60 * 1000,
  clientRateYahooSearchMax: 5,
  /** 銘柄サジェストのデバウンス（PC / スマホ）。短いほど Yahoo 検索が増える */
  symbolSuggestDebounceMsDesktop: 120,
  symbolSuggestDebounceMsMobile: 320,
  /** 短時間の fetch 過多を抑止（DDoS・過負荷・異常な連打）。超過時は警告とクールダウン。 */
  abuseFetchWindowMs: 60 * 1000,
  /** 通常利用は余裕を持たせつつ、明らかな過多のみブロック */
  abuseFetchMaxPerWindow: 105,
  abuseFetchCooldownMs: 180 * 1000,
  /** localStorage 読込時に拒否する JSON 文字列長（改ざん・メモリ圧迫対策） */
  maxLocalStorageJsonChars: 5_000_000,
  /** この長さを超えたら API キャッシュを自動削減してから再保存（使いやすさ維持） */
  maxSerializedStateSoftChars: 4_200_000,
  /** Firestore 同期ドキュメントの data 文字列上限（pull 時も検証） */
  cloudPayloadMaxChars: 1_100_000,
  /** 通報理由の最大文字数 */
  maxReportReasonLength: 220,
  /** 銘柄の内部理由テキスト（改ざんで巨大化させない） */
  maxPickPendingReasonFieldLength: 128,
  /** 再設定の回答（既存 50 に合わせる上限の定数化） */
  maxRecoveryAnswerLength: 50,
  /** 連打エスカレーション（localStorage・日本時間の日付でリセット） */
  escalationStorageKey: "stockgame_rate_escalation_v1",
  escalationWindow10MinMs: 10 * 60 * 1000,
  escalationWindow30MinMs: 30 * 60 * 1000,
  /** 10分以内にこの回数以上「レート制限拒否」で一段階クールダウン */
  escalationRejectThreshold10: 5,
  /** 30分以内にこの回数以上でさらに長いクールダウン（累計拒否回数） */
  escalationRejectThreshold30: 5,
  escalationCooldownAfter10Ms: 2 * 60 * 1000,
  escalationCooldownAfter30Tier1Ms: 10 * 60 * 1000,
  escalationCooldownAfter30Tier2Ms: 30 * 60 * 1000,
  /** 30分窓でこの回数以上の拒否で「本日ロック」 */
  escalationDailyRejectThreshold: 15,
  /** すでに制限中なのに10分でこの回数以上「再試行」すると本日ロック */
  escalationDailyBlockedAttemptsThreshold: 5
});

/** クライアント連打制限（キーごとに直近 windowMs 内の実行回数を数える） */
const clientRateLimitBuckets = Object.create(null);

/**
 * @returns {{ ok: true } | { ok: false, retryAfterSec: number }}
 */
function checkAndRecordClientRateLimit(bucketKey, maxCount, windowMs) {
  const now = Date.now();
  let arr = clientRateLimitBuckets[bucketKey];
  if (!arr) arr = clientRateLimitBuckets[bucketKey] = [];
  while (arr.length && arr[0] <= now - windowMs) arr.shift();
  if (arr.length >= maxCount) {
    const waitMs = Math.max(0, arr[0] + windowMs - now);
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil(waitMs / 1000)) };
  }
  arr.push(now);
  return { ok: true };
}

function createDefaultEscalationState() {
  return {
    jstDay: getDateKeyJst(new Date()),
    rejectTimestamps: [],
    blockedAttemptTimestamps: [],
    blockUntil: 0,
    dayLocked: false,
    previewRejectTimestamps: [],
    previewMilestoneLevel: 0
  };
}

function loadEscalationState() {
  try {
    const raw = localStorage.getItem(CONFIG.escalationStorageKey);
    const today = getDateKeyJst(new Date());
    if (!raw) {
      const fresh = createDefaultEscalationState();
      saveEscalationState(fresh);
      return fresh;
    }
    const s = JSON.parse(raw);
    if (s.jstDay !== today) {
      const fresh = createDefaultEscalationState();
      saveEscalationState(fresh);
      return fresh;
    }
    return {
      jstDay: s.jstDay || today,
      rejectTimestamps: Array.isArray(s.rejectTimestamps) ? s.rejectTimestamps.map(Number).filter(Number.isFinite) : [],
      blockedAttemptTimestamps: Array.isArray(s.blockedAttemptTimestamps)
        ? s.blockedAttemptTimestamps.map(Number).filter(Number.isFinite)
        : [],
      blockUntil: Number.isFinite(Number(s.blockUntil)) ? Number(s.blockUntil) : 0,
      dayLocked: Boolean(s.dayLocked),
      previewRejectTimestamps: Array.isArray(s.previewRejectTimestamps)
        ? s.previewRejectTimestamps.map(Number).filter(Number.isFinite)
        : [],
      previewMilestoneLevel: Number.isFinite(Number(s.previewMilestoneLevel)) ? Number(s.previewMilestoneLevel) : 0
    };
  } catch (_) {
    const fresh = createDefaultEscalationState();
    saveEscalationState(fresh);
    return fresh;
  }
}

function saveEscalationState(s) {
  try {
    s.jstDay = getDateKeyJst(new Date());
    localStorage.setItem(CONFIG.escalationStorageKey, JSON.stringify(s));
  } catch (e) {
    console.warn("escalation save failed", e);
  }
}

function getEscalationBlockMessage() {
  const s = loadEscalationState();
  if (s.jstDay !== getDateKeyJst(new Date())) return null;
  if (s.dayLocked) {
    return `本日（日本時間）は「更新」や繰り返し操作が制限されています。日付が変わると解除されます。`;
  }
  if (Date.now() < s.blockUntil) {
    const sec = Math.max(1, Math.ceil((s.blockUntil - Date.now()) / 1000));
    const min = Math.ceil(sec / 60);
    if (sec >= 120) {
      return `連続で制限に達したため、約${min}分間は操作をお試しできません。（繰り返し連打すると制限が強くなります）`;
    }
    return `連続で制限に達したため、約${sec}秒間は操作をお試しできません。（繰り返し連打すると制限が強くなります）`;
  }
  return null;
}

function recordRateLimitViolation() {
  const now = Date.now();
  let s = loadEscalationState();
  if (s.jstDay !== getDateKeyJst(new Date())) {
    s = createDefaultEscalationState();
  }
  s.rejectTimestamps.push(now);
  s.rejectTimestamps = s.rejectTimestamps.filter((t) => now - t < CONFIG.escalationWindow30MinMs);
  const v10 = s.rejectTimestamps.filter((t) => now - t < CONFIG.escalationWindow10MinMs).length;
  const v30 = s.rejectTimestamps.length;
  if (v10 >= CONFIG.escalationRejectThreshold10) {
    s.blockUntil = Math.max(s.blockUntil, now + CONFIG.escalationCooldownAfter10Ms);
  }
  if (v30 >= CONFIG.escalationRejectThreshold30) {
    s.blockUntil = Math.max(s.blockUntil, now + CONFIG.escalationCooldownAfter30Tier1Ms);
  }
  if (v30 >= 10) {
    s.blockUntil = Math.max(s.blockUntil, now + CONFIG.escalationCooldownAfter30Tier2Ms);
  }
  if (v30 >= CONFIG.escalationDailyRejectThreshold) {
    s.dayLocked = true;
  }
  saveEscalationState(s);
}

function recordBlockedEscalationAttempt() {
  const now = Date.now();
  let s = loadEscalationState();
  if (s.jstDay !== getDateKeyJst(new Date())) {
    s = createDefaultEscalationState();
  }
  s.blockedAttemptTimestamps.push(now);
  s.blockedAttemptTimestamps = s.blockedAttemptTimestamps.filter((t) => now - t < CONFIG.escalationWindow30MinMs);
  const b10 = s.blockedAttemptTimestamps.filter((t) => now - t < CONFIG.escalationWindow10MinMs).length;
  if (b10 >= CONFIG.escalationDailyBlockedAttemptsThreshold) {
    s.dayLocked = true;
  }
  saveEscalationState(s);
}

/**
 * 現在値の確認は通常ゆるいが、短時間に拒否が続くとグローバル制限を段階的に強める。
 */
function recordPreviewSoftViolation() {
  const now = Date.now();
  let s = loadEscalationState();
  if (s.jstDay !== getDateKeyJst(new Date())) {
    s = createDefaultEscalationState();
  }
  if (!Array.isArray(s.previewRejectTimestamps)) s.previewRejectTimestamps = [];
  s.previewRejectTimestamps.push(now);
  s.previewRejectTimestamps = s.previewRejectTimestamps.filter((t) => now - t < CONFIG.escalationWindow30MinMs);
  const p10 = s.previewRejectTimestamps.filter((t) => now - t < CONFIG.escalationWindow10MinMs).length;
  const step = Math.max(1, Math.floor(Number(CONFIG.escalationPreviewRejectionsPer10mStrike) || 10));
  const level = Math.floor(p10 / step);
  const prevLevel = Number(s.previewMilestoneLevel) || 0;
  s.previewMilestoneLevel = level;
  saveEscalationState(s);
  if (level > prevLevel) {
    for (let i = 0; i < level - prevLevel; i += 1) {
      recordRateLimitViolation();
    }
  }
}

/**
 * 通信ゲート・Yahoo 等の明らかな過負荷時にグローバル制限へ反映（連打・スキャン対策）
 * @param {"cooldown"|"burst"} kind
 */
function recordFetchAbuseStrike(kind) {
  try {
    recordRateLimitViolation();
    if (kind === "burst") {
      recordRateLimitViolation();
    }
  } catch (_) {
    /* ignore */
  }
}

/**
 * レート制限 + 連打エスカレーション（拒否時は kind を付与）
 * @param {"full"|"preview-soft"} escalationMode
 */
function checkAndRecordClientRateLimitWithEscalation(bucketKey, maxCount, windowMs, escalationMode) {
  const esc = getEscalationBlockMessage();
  if (esc) {
    recordBlockedEscalationAttempt();
    return { ok: false, kind: "escalation", message: esc };
  }
  const lim = checkAndRecordClientRateLimit(bucketKey, maxCount, windowMs);
  if (lim.ok) return { ok: true };
  if (escalationMode === "preview-soft") {
    recordPreviewSoftViolation();
  } else {
    recordRateLimitViolation();
  }
  return {
    ok: false,
    kind: "sliding",
    retryAfterSec: lim.retryAfterSec,
    maxCount,
    windowMs
  };
}

/**
 * クライアント連打制限。拒否時はユーザー向けメッセージ、許可時は null。
 * @param {string} bucketKey
 */
function getClientRateLimitMessageIfRejected(bucketKey, maxCount, windowMs) {
  const r = checkAndRecordClientRateLimitWithEscalation(bucketKey, maxCount, windowMs);
  if (r.ok) return null;
  if (r.kind === "escalation") return r.message;
  const w = Math.ceil(r.windowMs / 1000);
  return `操作が短時間に多すぎます。サーバー負荷防止のため、約${r.retryAfterSec}秒後に再度お試しください。（${w}秒間に${r.maxCount}回まで）※繰り返し連打すると制限が強くなります。`;
}

/** 自由記述を保存用に制御文字・ゼロ幅を除き、最大長で切る（嫌がらせ・改ざんの巨大文字列対策） */
function sanitizeFreeTextForStorage(raw, maxLen) {
  const cap = Math.max(0, Math.floor(Number(maxLen)));
  if (!cap) return "";
  const hard = Math.min(cap, 50000);
  return String(raw || "")
    .replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200D\uFEFF]/g, "")
    .slice(0, hard);
}

const SYMBOL_PRESETS = [
  { symbol: "7203.T", market: "JP", name: "\u30c8\u30e8\u30bf\u81ea\u52d5\u8eca", aliases: ["7203", "\u30c8\u30e8\u30bf", "\u3068\u3088\u305f", "toyota"] },
  { symbol: "6526.T", market: "JP", name: "\u30bd\u30b7\u30aa\u30cd\u30af\u30b9\u30c8", aliases: ["6526", "\u30bd\u30b7\u30aa\u30cd\u30af\u30b9\u30c8", "\u305d\u3057\u304a\u306d\u304f\u3059\u3068", "socionext"] },
  { symbol: "6758.T", market: "JP", name: "\u30bd\u30cb\u30fc\u30b0\u30eb\u30fc\u30d7", aliases: ["6758", "\u30bd\u30cb\u30fc", "sony"] },
  { symbol: "8306.T", market: "JP", name: "\u4e09\u83f1UFJ FG", aliases: ["8306", "\u4e09\u83f1ufj", "mufg"] },
  { symbol: "9984.T", market: "JP", name: "\u30bd\u30d5\u30c8\u30d0\u30f3\u30af\u30b0\u30eb\u30fc\u30d7", aliases: ["9984", "sbg", "\u30bd\u30d5\u30c8\u30d0\u30f3\u30af"] },
  { symbol: "7974.T", market: "JP", name: "\u4efb\u5929\u5802", aliases: ["7974", "\u4efb\u5929\u5802", "nintendo"] },
  { symbol: "9432.T", market: "JP", name: "NTT", aliases: ["9432", "ntt"] },
  { symbol: "6861.T", market: "JP", name: "\u30ad\u30fc\u30a8\u30f3\u30b9", aliases: ["6861", "\u30ad\u30fc\u30a8\u30f3\u30b9", "keyence"] },
  { symbol: "8035.T", market: "JP", name: "\u6771\u4eac\u30a8\u30ec\u30af\u30c8\u30ed\u30f3", aliases: ["8035", "tel", "\u6771\u96fb"] },
  { symbol: "9983.T", market: "JP", name: "\u30d5\u30a1\u30fc\u30b9\u30c8\u30ea\u30c6\u30a4\u30ea\u30f3\u30b0", aliases: ["9983", "\u30d5\u30a1\u30fc\u30b9\u30c8\u30ea", "fastretailing"] },
  { symbol: "7267.T", market: "JP", name: "\u30db\u30f3\u30c0", aliases: ["7267", "\u30db\u30f3\u30c0", "honda"] },
  { symbol: "6501.T", market: "JP", name: "\u65e5\u7acb\u9023\u5429", aliases: ["6501", "\u65e5\u7acb", "hitachi"] },
  { symbol: "6752.T", market: "JP", name: "\u30d1\u30ca\u30bd\u30cb\u30c3\u30af", aliases: ["6752", "\u30d1\u30ca\u30bd\u30cb\u30c3\u30af", "panasonic"] },
  { symbol: "6981.T", market: "JP", name: "\u6751\u7530\u88fd\u4f5c\u6240", aliases: ["6981", "\u6751\u7530", "murata"] },
  { symbol: "9433.T", market: "JP", name: "KDDI", aliases: ["9433", "kddi"] },
  { symbol: "8058.T", market: "JP", name: "\u4e09\u83f1\u5546\u4e8b", aliases: ["8058", "\u4e09\u83f1\u5546\u4e8b", "mitsubishi"] },
  { symbol: "8031.T", market: "JP", name: "\u4e09\u4e95\u7269\u7523", aliases: ["8031", "\u4e09\u4e95\u7269\u7523", "mitui"] },
  { symbol: "6367.T", market: "JP", name: "\u30c0\u30a4\u30ad\u30f3\u30a4\u30f3\u30c0\u30b9\u30c8\u30ea\u30fc\u30ba", aliases: ["6367", "\u30c0\u30a4\u30ad\u30f3", "daikin"] },
  { symbol: "6902.T", market: "JP", name: "\u30c7\u30f3\u30bd\u30fc", aliases: ["6902", "\u30c7\u30f3\u30bd\u30fc", "denso"] },
  { symbol: "4063.T", market: "JP", name: "\u4fe1\u8d8a\u5316\u5b66\u5de5\u696d", aliases: ["4063", "\u4fe1\u8d8a", "shinetsu"] },
  { symbol: "4519.T", market: "JP", name: "\u4e2d\u5916\u88fd\u85ac", aliases: ["4519", "\u4e2d\u5916\u88fd\u85ac", "chugai"] },
  { symbol: "6098.T", market: "JP", name: "\u30ea\u30af\u30eb\u30fc\u30c8\u30db\u30fc\u30eb\u30c7\u30a3\u30f3\u30b0\u30b9", aliases: ["6098", "\u30ea\u30af\u30eb\u30fc\u30c8", "recruit"] },
  { symbol: "1802.T", market: "JP", name: "\u5927\u6797\u7d44", aliases: ["1802", "\u5927\u6797", "obayashi"] },
  { symbol: "1801.T", market: "JP", name: "\u5927\u6210\u5efa\u8a2d", aliases: ["1801", "\u5927\u6210", "taisei"] },
  { symbol: "1928.T", market: "JP", name: "\u7a4d\u6c34\u30cf\u30a6\u30b9", aliases: ["1928", "\u7a4d\u6c34", "sekisui"] },
  { symbol: "1925.T", market: "JP", name: "\u5927\u548c\u30cf\u30a6\u30b9\u30a4\u30f3\u30c0\u30b9\u30c8\u30ea\u30fc", aliases: ["1925", "\u5927\u548c\u30cf\u30a6\u30b9", "daiwa"] },
  { symbol: "1605.T", market: "JP", name: "INPEX", aliases: ["1605", "inpex"] },
  { symbol: "1332.T", market: "JP", name: "\u65e5\u672c\u6c34\u7523", aliases: ["1332", "nissui"] },
  { symbol: "2282.T", market: "JP", name: "\u65e5\u672c\u30cf\u30e0", aliases: ["2282", "nihonham"] },
  { symbol: "2502.T", market: "JP", name: "\u30a2\u30b5\u30d2\u30b0\u30eb\u30fc\u30d7HD", aliases: ["2502", "\u30a2\u30b5\u30d2", "asahi"] },
  { symbol: "2503.T", market: "JP", name: "\u30ad\u30ea\u30f3HD", aliases: ["2503", "\u30ad\u30ea\u30f3", "kirin"] },
  { symbol: "3407.T", market: "JP", name: "\u65ed\u5316\u6210", aliases: ["3407", "\u65ed\u5316", "asahi-kasei"] },
  { symbol: "4004.T", market: "JP", name: "\u30ec\u30be\u30ca\u30c3\u30af\u30fb\u30c7\u30e5\u30dd\u30f3", aliases: ["4004", "resonac"] },
  { symbol: "4005.T", market: "JP", name: "\u4f4f\u53cb\u5316\u5b66", aliases: ["4005", "sumitomo-chem"] },
  { symbol: "4188.T", market: "JP", name: "\u4e09\u83f1\u30b1\u30df\u30ab\u30eb", aliases: ["4188", "mitsubishi-chem"] },
  { symbol: "4208.T", market: "JP", name: "UBE", aliases: ["4208", "ube"] },
  { symbol: "4118.T", market: "JP", name: "\u30ab\u30cd\u30ab", aliases: ["4118", "kaneka", "\u30ab\u30cd\u30ab"] },
  { symbol: "4452.T", market: "JP", name: "\u82b1\u738b", aliases: ["4452", "kao", "\u82b1\u738b"] },
  { symbol: "4543.T", market: "JP", name: "\u30c6\u30eb\u30e2", aliases: ["4543", "terumo"] },
  { symbol: "4568.T", market: "JP", name: "\u7b2c\u4e09\u5171", aliases: ["4568", "daiichisankyo"] },
  { symbol: "4751.T", market: "JP", name: "\u30b5\u30a4\u30d0\u30fc\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8", aliases: ["4751", "cyberagent"] },
  { symbol: "4755.T", market: "JP", name: "\u697d\u5929\u30b0\u30eb\u30fc\u30d7", aliases: ["4755", "\u697d\u5929", "rakuten"] },
  { symbol: "5020.T", market: "JP", name: "ENEOS\u30db\u30fc\u30eb\u30c7\u30a3\u30f3\u30b0\u30b9", aliases: ["5020", "eneos"] },
  { symbol: "5108.T", market: "JP", name: "\u30d6\u30ea\u30c2\u30b9\u30c8\u30f3", aliases: ["5108", "bridgestone"] },
  { symbol: "5233.T", market: "JP", name: "\u592a\u5e73\u6d0b\u30bb\u30e1\u30f3\u30c8", aliases: ["5233", "taiheiyo"] },
  { symbol: "5332.T", market: "JP", name: "TOTO", aliases: ["5332", "toto"] },
  { symbol: "5401.T", market: "JP", name: "\u65e5\u672c\u88fd\u9244", aliases: ["5401", "nsteel"] },
  { symbol: "5713.T", market: "JP", name: "\u4f4f\u53cb\u91d1\u5c5e\u9271\u5c71", aliases: ["5713", "sumitomo-metal"] },
  { symbol: "5801.T", market: "JP", name: "\u53e4\u6cb3\u96fb\u6c17\u5de5\u696d", aliases: ["5801", "furukawa"] },
  { symbol: "5831.T", market: "JP", name: "\u3057\u305a\u304a\u304bFG", aliases: ["5831", "shizuoka-fg"] },
  { symbol: "6301.T", market: "JP", name: "\u30b3\u30de\u30c4", aliases: ["6301", "komatsu"] },
  { symbol: "6326.T", market: "JP", name: "\u30af\u30dc\u30bf", aliases: ["6326", "kubota"] },
  { symbol: "6479.T", market: "JP", name: "\u30df\u30cd\u30d9\u30a2\u30df\u30c4\u30df", aliases: ["6479", "minebea"] },
  { symbol: "6954.T", market: "JP", name: "\u30d5\u30a1\u30ca\u30c3\u30af", aliases: ["6954", "fanuc"] },
  { symbol: "7731.T", market: "JP", name: "\u30cb\u30b3\u30f3", aliases: ["7731", "nikon"] },
  { symbol: "AAPL", market: "US", name: "Apple", aliases: ["aapl", "apple"] },
  { symbol: "MSFT", market: "US", name: "Microsoft", aliases: ["msft", "microsoft", "\u307e\u3044\u304f\u308d\u305d\u3075\u3068"] },
  { symbol: "NVDA", market: "US", name: "NVIDIA", aliases: ["nvda", "nvidia"] },
  { symbol: "AMZN", market: "US", name: "Amazon", aliases: ["amzn", "amazon"] },
  { symbol: "GOOGL", market: "US", name: "Alphabet", aliases: ["googl", "google"] },
  { symbol: "TSLA", market: "US", name: "Tesla", aliases: ["tsla", "tesla"] },
  { symbol: "META", market: "US", name: "Meta", aliases: ["meta", "facebook"] },
  { symbol: "CSCO", market: "US", name: "Cisco Systems", aliases: ["cisco", "csco"] },
  { symbol: "LLY", market: "US", name: "Eli Lilly", aliases: ["lly", "lilly"] },
  { symbol: "MRK", market: "US", name: "Merck", aliases: ["mrk", "merck"] },
  { symbol: "PFE", market: "US", name: "Pfizer", aliases: ["pfe", "pfizer"] },
  { symbol: "ABT", market: "US", name: "Abbott", aliases: ["abt", "abbott"] },
  { symbol: "VZ", market: "US", name: "Verizon", aliases: ["vz", "verizon"] },
  { symbol: "T", market: "US", name: "AT&T", aliases: ["t", "att"] },
  { symbol: "CMCSA", market: "US", name: "Comcast", aliases: ["cmcsa", "comcast"] },
  { symbol: "PM", market: "US", name: "Philip Morris", aliases: ["pm", "philip-morris"] },
  { symbol: "IBM", market: "US", name: "IBM", aliases: ["ibm"] },
  { symbol: "GS", market: "US", name: "Goldman Sachs", aliases: ["gs", "goldman"] },
  { symbol: "MS", market: "US", name: "Morgan Stanley", aliases: ["ms", "morgan-stanley"] },
  { symbol: "BAC", market: "US", name: "Bank of America", aliases: ["bac", "bofa"] },
  { symbol: "C", market: "US", name: "Citigroup", aliases: ["c", "citi"] },
  { symbol: "XOM", market: "US", name: "Exxon Mobil", aliases: ["xom", "exxon"] },
  { symbol: "CVX", market: "US", name: "Chevron", aliases: ["cvx", "chevron"] },
  { symbol: "BA", market: "US", name: "Boeing", aliases: ["ba", "boeing"] },
  { symbol: "CAT", market: "US", name: "Caterpillar", aliases: ["cat", "caterpillar"] },
  { symbol: "LIN", market: "US", name: "Linde", aliases: ["lin", "linde"] },
  { symbol: "SPGI", market: "US", name: "S&P Global", aliases: ["spgi", "sp-global"] },
  { symbol: "NOW", market: "US", name: "ServiceNow", aliases: ["servicenow"] },
  { symbol: "QCOM", market: "US", name: "Qualcomm", aliases: ["qcom", "qualcomm"] },
  { symbol: "TXN", market: "US", name: "Texas Instruments", aliases: ["txn", "ti"] },
  { symbol: "AMAT", market: "US", name: "Applied Materials", aliases: ["amat"] },
  { symbol: "MU", market: "US", name: "Micron", aliases: ["mu", "micron"] },
  { symbol: "LRCX", market: "US", name: "Lam Research", aliases: ["lrcx", "lam"] },
  { symbol: "HON", market: "US", name: "Honeywell", aliases: ["hon", "honeywell"] },
  { symbol: "DE", market: "US", name: "Deere", aliases: ["de", "deere"] },
  { symbol: "UPS", market: "US", name: "UPS", aliases: ["ups"] },
  { symbol: "LOW", market: "US", name: "Lowe's", aliases: ["low", "lowes"] },
  { symbol: "SBUX", market: "US", name: "Starbucks", aliases: ["sbux", "starbucks"] },
  { symbol: "BKNG", market: "US", name: "Booking Holdings", aliases: ["bkng", "booking"] },
  { symbol: "TMUS", market: "US", name: "T-Mobile US", aliases: ["tmus", "tmobile"] },
  { symbol: "NEE", market: "US", name: "NextEra Energy", aliases: ["nee", "nextera"] },
  { symbol: "PEP", market: "US", name: "PepsiCo", aliases: ["pep", "pepsico"] },
  { symbol: "KO", market: "US", name: "Coca-Cola", aliases: ["ko", "coca-cola"] },
  { symbol: "WFC", market: "US", name: "Wells Fargo", aliases: ["wfc", "wells"] },
  { symbol: "BLK", market: "US", name: "BlackRock", aliases: ["blk", "blackrock"] },
  { symbol: "AXP", market: "US", name: "American Express", aliases: ["axp", "amex"] },
  { symbol: "ISRG", market: "US", name: "Intuitive Surgical", aliases: ["isrg", "intuitive"] },
  { symbol: "MDT", market: "US", name: "Medtronic", aliases: ["mdt", "medtronic"] },
  { symbol: "ADP", market: "US", name: "ADP", aliases: ["adp"] },
  { symbol: "GILD", market: "US", name: "Gilead", aliases: ["gild", "gilead"] },
  { symbol: "BTC-USD", market: "CRYPTO", name: "Bitcoin", aliases: ["btc", "bitcoin", "\u30d3\u30c3\u30c8\u30b3\u30a4\u30f3"] },
  { symbol: "ETH-USD", market: "CRYPTO", name: "Ethereum", aliases: ["eth", "ethereum", "\u30a4\u30fc\u30b5\u30ea\u30a2\u30e0"] },
  { symbol: "XRP-USD", market: "CRYPTO", name: "XRP", aliases: ["xrp", "\u30ea\u30c3\u30d7\u30eb"] },
  { symbol: "SOL-USD", market: "CRYPTO", name: "Solana", aliases: ["sol", "solana"] },
  { symbol: "DOGE-USD", market: "CRYPTO", name: "Dogecoin", aliases: ["doge", "dogecoin", "\u30c9\u30fc\u30b8"] }
];

const QUICK_HINT_POOL_JP = [
  { symbol: "7203", name: "トヨタ自動車" }, { symbol: "9432", name: "NTT" }, { symbol: "6758", name: "ソニーグループ" },
  { symbol: "8306", name: "三菱UFJ FG" }, { symbol: "9984", name: "ソフトバンクG" }, { symbol: "6861", name: "キーエンス" },
  { symbol: "8035", name: "東京エレクトロン" }, { symbol: "9983", name: "ファーストリテイリング" }, { symbol: "7267", name: "ホンダ" },
  { symbol: "6501", name: "日立製作所" }, { symbol: "6752", name: "パナソニック" }, { symbol: "9433", name: "KDDI" },
  { symbol: "8058", name: "三菱商事" }, { symbol: "8031", name: "三井物産" }, { symbol: "6367", name: "ダイキン" },
  { symbol: "6902", name: "デンソー" }, { symbol: "4063", name: "信越化学" }, { symbol: "4519", name: "中外製薬" },
  { symbol: "6098", name: "リクルートHD" }, { symbol: "7974", name: "任天堂" }, { symbol: "6526", name: "ソシオネクスト" },
  { symbol: "6981", name: "村田製作所" }, { symbol: "6594", name: "日本電産" }, { symbol: "4901", name: "富士フイルム" },
  { symbol: "4502", name: "武田薬品" }, { symbol: "3382", name: "セブン＆アイ" }, { symbol: "2914", name: "日本たばこ" },
  { symbol: "8802", name: "三菱地所" }, { symbol: "8316", name: "三井住友FG" },   { symbol: "4503", name: "アステラス製薬" },
  { symbol: "1802", name: "大林組" }, { symbol: "1801", name: "大成建設" }, { symbol: "1928", name: "積水ハウス" },
  { symbol: "1925", name: "大和ハウス工業" }, { symbol: "1605", name: "INPEX" }, { symbol: "1332", name: "日本水産" },
  { symbol: "2282", name: "日本ハム" }, { symbol: "2502", name: "アサヒGHD" }, { symbol: "2503", name: "キリンHD" },
  { symbol: "3407", name: "旭化成" }, { symbol: "4004", name: "レゾナック" }, { symbol: "4005", name: "住友化学" },
  { symbol: "4188", name: "三菱ケミカル" }, { symbol: "4208", name: "UBE" }, { symbol: "4118", name: "カネカ" },
  { symbol: "4452", name: "花王" },
  { symbol: "4543", name: "テルモ" }, { symbol: "4568", name: "第一三共" }, { symbol: "4751", name: "サイバーエージェント" },
  { symbol: "4755", name: "楽天グループ" }, { symbol: "5020", name: "ENEOS HD" }, { symbol: "5108", name: "ブリヂストン" },
  { symbol: "5233", name: "太平洋セメント" }, { symbol: "5332", name: "TOTO" }, { symbol: "5401", name: "日本製鉄" },
  { symbol: "5713", name: "住友金属鉱山" }, { symbol: "5801", name: "古河電工" }, { symbol: "5831", name: "しずおかFG" },
  { symbol: "6301", name: "コマツ" }, { symbol: "6326", name: "クボタ" }, { symbol: "6479", name: "ミネベアM" },
  { symbol: "6954", name: "ファナック" }, { symbol: "7731", name: "ニコン" }
];

const QUICK_HINT_POOL_US = [
  { symbol: "AAPL", name: "Apple" }, { symbol: "MSFT", name: "Microsoft" }, { symbol: "NVDA", name: "NVIDIA" },
  { symbol: "AMZN", name: "Amazon" }, { symbol: "GOOGL", name: "Alphabet（Google）" }, { symbol: "META", name: "Meta" },
  { symbol: "TSLA", name: "Tesla" }, { symbol: "BRK-B", name: "バークシャー" }, { symbol: "JPM", name: "JPモルガン" },
  { symbol: "V", name: "Visa" }, { symbol: "JNJ", name: "ジョンソン・エンド・ジョンソン" }, { symbol: "WMT", name: "ウォルマート" },
  { symbol: "PG", name: "P&G" }, { symbol: "UNH", name: "ユナイテッドヘルス" }, { symbol: "HD", name: "ホームデポ" },
  { symbol: "MA", name: "マスターカード" }, { symbol: "DIS", name: "ディズニー" }, { symbol: "PYPL", name: "PayPal" },
  { symbol: "ADBE", name: "Adobe" }, { symbol: "NFLX", name: "Netflix" }, { symbol: "CRM", name: "Salesforce" },
  { symbol: "INTC", name: "Intel" }, { symbol: "AMD", name: "AMD" }, { symbol: "ORCL", name: "Oracle" },
  { symbol: "CSCO", name: "Cisco" }, { symbol: "PEP", name: "ペプシコ" }, { symbol: "KO", name: "コカ・コーラ" },
  { symbol: "COST", name: "コストコ" }, { symbol: "MCD", name: "マクドナルド" }, { symbol: "NKE", name: "ナイキ" },
  { symbol: "ABBV", name: "アッヴィ" },
  { symbol: "LLY", name: "イーライリリー" }, { symbol: "MRK", name: "メルク" }, { symbol: "PFE", name: "ファイザー" },
  { symbol: "ABT", name: "アボット" }, { symbol: "VZ", name: "ベライゾン" }, { symbol: "T", name: "AT&T" },
  { symbol: "CMCSA", name: "コムキャスト" }, { symbol: "PM", name: "フィリップモリス" }, { symbol: "IBM", name: "IBM" },
  { symbol: "GS", name: "ゴールドマン" }, { symbol: "MS", name: "モルガンS" }, { symbol: "BAC", name: "BofA" },
  { symbol: "C", name: "シティグループ" }, { symbol: "XOM", name: "エクソン" }, { symbol: "CVX", name: "シェブロン" },
  { symbol: "BA", name: "ボーイング" }, { symbol: "CAT", name: "キャタピラー" }, { symbol: "LIN", name: "リンデ" },
  { symbol: "SPGI", name: "S&Pグローバル" }, { symbol: "NOW", name: "ServiceNow" }, { symbol: "QCOM", name: "クアルコム" },
  { symbol: "TXN", name: "TI" }, { symbol: "AMAT", name: "アプライド" }, { symbol: "MU", name: "マイクロン" },
  { symbol: "LRCX", name: "ラムリサーチ" }, { symbol: "HON", name: "ハネウェル" }, { symbol: "DE", name: "ディアー" },
  { symbol: "UPS", name: "UPS" }, { symbol: "LOW", name: "ロウズ" }, { symbol: "SBUX", name: "スタバ" },
  { symbol: "BKNG", name: "ブッキング" }, { symbol: "TMUS", name: "Tモバイル" }, { symbol: "NEE", name: "ネクステラ" },
  { symbol: "WFC", name: "ウェルズF" }, { symbol: "BLK", name: "ブラックロック" }, { symbol: "AXP", name: "アメックス" },
  { symbol: "ISRG", name: "インテュイティブ" }, { symbol: "MDT", name: "メドトロニック" }, { symbol: "ADP", name: "ADP" },
  { symbol: "GILD", name: "ギリアド" }
];

const QUICK_HINT_POOL_CRYPTO = [
  { symbol: "BTC", name: "Bitcoin" }, { symbol: "ETH", name: "Ethereum" }, { symbol: "SOL", name: "Solana" },
  { symbol: "XRP", name: "XRP" }, { symbol: "DOGE", name: "Dogecoin" }
];

function shuffleArrayCopy(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandomHintSymbols() {
  const jp = shuffleArrayCopy(QUICK_HINT_POOL_JP).slice(0, 3).map((x) => ({ ...x, hintMarket: "JP" }));
  const us = shuffleArrayCopy(QUICK_HINT_POOL_US).slice(0, 3).map((x) => ({ ...x, hintMarket: "US" }));
  const crypto = shuffleArrayCopy(QUICK_HINT_POOL_CRYPTO).slice(0, 2).map((x) => ({ ...x, hintMarket: "CRYPTO" }));
  return [...jp, ...us, ...crypto];
}
// アカウント名（ID）: 日本語/英字/数字に加えて ASCII 記号も許可
// UI は escapeHtml するため直接のXSSは抑えられるが、危険パターン（script等）は別途禁止する。
const NAME_REGEX = /^[\u3041-\u3096\u30A1-\u30FA\u30FC\u4E00-\u9FA0a-zA-Z0-9 \x21-\x7E]{2,8}$/;
const BANNED_NAME_PATTERNS = [
  /admin/i,
  /^test\d*$/i,
  /^null$/i,
  /^undefined$/i,
  /<script/i,
  /javascript:/i,
  /on\w+\s*=/i,
  /<\/[\w-]+/i,
  /data:\s*text\/html/i
];
const BANNED_NAME_LIST = [
  "\u611b\u6db2",
  "\u611b\u5974",
  "\u9752\u59e6",
  "\u3042\u304d\u3081\u304f\u3089",
  "\u660e\u76f2",
  "\u671d\u52c3\u3061",
  "\u8db3\u30b3\u30ad",
  "\u7a74\u5144\u5f1f",
  "\u30a2\u30ca\u30cb\u30fc",
  "\u3042\u306a\u308b",
  "\u3042\u3042\u3001\u306a\u308b\u307b\u3069",
  "\u3042\u3042\u306a\u308b\u304b\u3089",
  "\u30af\u30ea\u30a2\u306a\u308b\u304b\uff1f",
  "\u30a2\u30ca\u30eb\u30bb\u30c3\u30af\u30b9",
  "\u30a2\u30ca\u30eb\u30d0\u30a4\u30d6",
  "\u30a2\u30ca\u30eb\u30d7\u30e9\u30b0",
  "\u30a2\u30d8\u304c\u304a",
  "\u963f\u7247",
  "\u30a2\u30db",
  "\u30a2\u30db\u3069\u3082",
  "\u7c97\u30c1\u30f3",
  "\u3044\u3051\u306c\u307e",
  "\u6c60\u6cbc",
  "\u30a4\u30e9\u30de\u30c1\u30aa",
  "\u6deb",
  "\u9670\u6838",
  "\u9670\u830e",
  "\u9670\u5507",
  "\u9670\u56a2",
  "\u9670\u90e8",
  "\u9670\u6bdb",
  "\u30f4\u30a1\u30ae\u30ca",
  "\u3046\u3093\u3053",
  "\u3046\u3007\u3053",
  "\u3046\u25cf\u3053",
  "\u3046\u25ce\u3053",
  "\u3046\u3093\u3001\u3053\u308c\u3067\u3088\u3057",
  "\u30c0\u30a6\u30f3\u30b3\u30fc\u30c8",
  "\u3046\u3093\u3061",
  "\u3046\u3093\u3061\u3083\u3093\u3068",
  "\u3046\u3093\u3001\u3061\u3083\u3093\u3068",
  "\u30a6\u30f3\u30c1",
  "\u30a6\u30f3\u30c1\u30af",
  "\u30db\u30f3\u30fb\u30a6\u30f3\u30c1\u30a7",
  "\u7a62\u591a",
  "\u30a8\u30cd\u30de\u30b0\u30e9",
  "\u30a8\u30d5\u30a7\u30c9\u30ea\u30f3",
  "\u63f4\u52a9\u4ea4\u969b",
  "\u63f4\u4ea4",
  "\u30aa\u30fc\u30ac\u30ba\u30e0",
  "\u9ec4\u91d1\u6c34",
  "\u304a\u3063\u3071\u3044",
  "\u30aa\u30ca\u30cb\u30fc",
  "\u30aa\u30ca\u30cc\u30fc",
  "\u30aa\u30ca\u30cd\u30bf",
  "\u30aa\u30ca\u30db",
  "\u30aa\u30ca\u30db\u30fc\u30eb",
  "\u30aa\u30ca\u30eb",
  "\u30aa\u30d4\u30aa\u30a4\u30c9\u30da\u30d7\u30c1\u30c9",
  "\u304a\u307e\u3093\u3061\u3087",
  "\u304a\u3081\u3053",
  "\u3042\u3051\u304a\u3081\u3053\u3068\u3088\u308d",
  "\u30aa\u30eb\u30ac\u30ba\u30e0",
  "\u304c\u3044\u3058",
  "\u5bb3\u5150",
  "\u79c1\u304c\u3044\u3058\u3081\u3089\u308c\u3066",
  "\u9854\u9a0e",
  "\u9854\u5c04",
  "\u899a\u305b\u3044\u5264",
  "\u30ab\u30b9\u3069\u3082",
  "\u6211\u6162\u6c41",
  "\u59e6\u6deb",
  "\u76e3\u7981",
  "\u59e6\u901a",
  "\u304d\u3048\u3066",
  "\u304d\u3048\u308d",
  "\u4e80\u7532\u7e1b\u308a",
  "\u304d\u3061\u304c\u3044",
  "\u30ad\u30c1\u30ac\u30a4",
  "\uff77\uff81\uff76\uff9e\uff72",
  "\u6c17\u9055\u3044",
  "\u57fa\u5730\u5916",
  "\u9006\u63f4",
  "\u8fd1\u89aa\u76f8\u59e6",
  "\u30ad\u30f3\u30bf\u30de",
  "\u30ad\u30f3\u30bf\u30de\u30fc\u30cb",
  "\u30af\u30ba\u3069\u3082",
  "\u5c4e",
  "\u30af\u30bd\u3069\u3082",
  "\u30af\u30ea\u30c8\u30ea\u30b9",
  "\u304f\u308d\u3093\u307c",
  "\u304f\u3093\u306b",
  "\u30af\u30f3\u30cb\u30ea\u30f3\u30b0\u30b9",
  "\u3007\u3007\u304f\u3093\u306b\u8a71\u304c\u3042\u308b",
  "\u3051\u3061\u3083\u307e\u3093",
  "\u3051\u3064\u3042\u306a",
  "\u6bdb\u5510",
  "\u6297\u3046\u3064\u5264",
  "\u5f37\u59e6",
  "\u53e3\u4ea4",
  "\u809b\u4ea4",
  "\u5f8c\u80cc\u4f4d",
  "\u53e3\u5185\u5c04\u7cbe",
  "\u53e3\u5185\u767a\u5c04",
  "\u5408\u6cd5\u30cf\u30fc\u30d6",
  "\u809b\u9580",
  "\u30b3\u30ab\u30a4\u30f3",
  "\u4e5e\u98df",
  "\u30b4\u30df\u30ab\u30b9",
  "\u30b4\u30df\u30af\u30ba",
  "\u30b4\u30df\u3069\u3082",
  "\u30b4\u6709",
  "\u3053\u308d\u3057\u3066",
  "\u30b3\u30ed\u30b3\u30ed\u3057\u3066",
  "\u3053\u308d\u3057\u307e\u3059",
  "\u6bba\u3059",
  "\u3053\u308d\u3059",
  "\u30b3\u30ed\u30b9",
  "56\u3059",
  "\u6bba\u3059\u6c17\u304b",
  "\u30b3\u30ed\u30ca\u30a6\u30a4\u30eb\u30b9",
  "\u30b3\u30f3\u30c9\u30fc\u30e0",
  "\u30b6\u30fc\u6c41",
  "\u30b6\u30fc\u30e1\u30f3",
  "\u30b6\u30b3",
  "\u3056\u3053",
  "\u3044\u3056\u3053\u3056",
  "\u3044\u3056\u3001\u3053\u3046\u3057\u3066\u307f\u308b\u3068\u2026",
  "\u30cf\u30ea\u30a6\u30c3\u30c9\u30b6\u30b3\u30b7\u30b7\u30e7\u30a6",
  "\u30d5\u30a1\u30b6\u30b3\u30f3",
  "\u30de\u30b6\u30b3\u30f3",
  "\u308f\u3056\u308f\u3056\u3053\u3093\u306a",
  "\u30b6\u30c3\u30b3",
  "\u3056\u3063\u3053\u304f\u307e\u3044",
  "\u30b5\u30bb\u5b50",
  "\u4e09\u56fd\u4eba",
  "\u7b2c\u4e09\u56fd\u4eba",
  "\u81ea\u6170",
  "G\u30b9\u30dd\u30c3\u30c8",
  "\u6b7b\u59e6",
  "\u8996\u59e6",
  "\u30b7\u30b3\u30b7\u30b3",
  "\u3058\u3055\u3064",
  "\u81ea\u6bba",
  "\u30ab\u30b8\u30b5\u30c3\u30af",
  "\u3057\u3063\u3053",
  "\u3057\u3063\u3053\u304f",
  "\u3057\u3064\u3053\u304f",
  "\u3057\u3064\u3053",
  "\u3057\u3064\u3053\u3044",
  "\u652f\u90a3",
  "\u6b7b\u306d",
  "\u3057\u306d",
  "\u30b7\u30cd",
  "4\u306d",
  "4NE",
  "\u30bf\u30d2\u306d",
  "\uff80\uff8b\u306d",
  "\u6b7b\u306d\u306a\u3044",
  "\uff5e\u3060\u3057\u306d",
  "\u30a2\u30f3\u30fb\u30b7\u30cd",
  "\u3057\u306d\u3088",
  "\u30b7\u30cd\u3088",
  "\u30b7\u30cd\u30e8",
  "\u6b7b\u306d\u3088",
  "\u3057\u3083\u305b\u3044",
  "\u5c04\u7cbe",
  "\u7363\u59e6",
  "\u5a3c\u5a66",
  "\u3057\u3087\u3046\u3079\u3093",
  "\u5c0f\u4fbf",
  "\u5c0f\u4fbf\u5c0f\u50e7",
  "\u5973\u4f53\u76db\u308a",
  "\u5c3b",
  "\u5c3b\u5c3e",
  "\u3057\u3093\u3067",
  "\u697d\u3057\u3093\u3067",
  "\u3057\u3093\u3069\u3051",
  "\u30b9\u30ab\u30c8\u30ed",
  "\u30b9\u30ab\u30c8\u30ed\u30b8\u30fc",
  "\u7d20\u80a1",
  "\u6027\u611b",
  "\u7570\u6027\u611b",
  "\u540c\u6027\u611b",
  "\u4e21\u6027\u611b",
  "\u7cbe\u6db2",
  "\u6027\u4ea4",
  "\u6027\u884c\u70ba",
  "\u7cbe\u5b50",
  "\u6027\u5974\u96b7",
  "\u30bb\u30c3\u30af\u30b9",
  "\u30a8\u30bb\u30c3\u30af\u30b9",
  "\u30b5\u30bb\u30c3\u30af\u30b9",
  "\u30aa\u30fc\u30e9\u30eb\u30bb\u30c3\u30af\u30b9",
  "\u30bb\u30d5\u30ec",
  "\u9bae\u4eba",
  "\u671d\u9bae\u4eba",
  "\u671d\u9bae\u4eba\u6c11\u5171\u548c\u56fd",
  "\u5168\u8eab\u8210\u3081",
  "\u305c\u3064\u308a\u3093",
  "\u7d76\u502b",
  "\u305b\u3093\u305a\u308a",
  "\u8ce4\u6c11",
  "\u3060\u3044\u3079\u3093",
  "\u5927\u4fbf",
  "\u624b\u306e\u8fbc\u3093\u3060\u30a4\u30d9\u30f3\u30c8",
  "\u5927\u9ebb",
  "\u30c0\u30a6\u30f3\u3057\u3087\u3046",
  "\u30c0\u30c3\u30c1\u30ef\u30a4\u30d5",
  "\u3060\u3063\u3077\u3093",
  "\u8131\u6cd5\u30cf\u30fc\u30d6",
  "\u7389\u8cac\u3081",
  "\u7389\u8210\u3081",
  "\u3060\u307e\u308c",
  "\u5730\u4e0b\u9244\u30b5\u30ea\u30f3",
  "\u3061\u304b\u3066\u3064\u30b5\u30ea\u30f3",
  "\u75f4\u6f22",
  "\u75f4\u6c41",
  "\u75f4\u5973",
  "\u3061\u3057\u3087\u3046",
  "\u3061\u3057\u3087\u30fc",
  "\u30c1\u30e3\u30f3\u30b3\u30ed",
  "\u76f4\u30a2\u30c9",
  "\u76f4\u30e1",
  "\u30c1\u30f3\u30ab\u30b9",
  "\u30d1\u30c1\u30f3\u30ab\u30b9",
  "\u3061\u3093\u3053",
  "\u3061\u3007\u3053",
  "\u3061\u25cf\u3053",
  "\u3061\u25ce\u3053",
  "\u304b\u3061\u3093\u3053\u3061\u3093",
  "\u30ac\u30c1\u30f3\u30b3",
  "\u306e\u3069\u3061\u3093\u3053",
  "\u30d1\u30c1\u30f3\u30b3",
  "\u3061\u3093\u3061\u3093",
  "\u30c1\u30f3\u30c1\u30f3\u96fb\u8eca",
  "\u3061\u3093\u307c",
  "\u3051\u3061\u3093\u307c",
  "\u305f\u3061\u3093\u307c\u3046",
  "\u3061\u3093\u307c\u3064\u305b\u3093",
  "\u3061\u3093\u307d",
  "\u3061\u3093\u307d\u3053",
  "\u30c7\u30a3\u30fc\u30d7\u30b9\u30ed\u30fc\u30c8",
  "\u4f4e\u80fd",
  "\u4f4e\u80fd\u5150",
  "\u30c7\u30a3\u30eb\u30c9",
  "\u30c7\u30a3\u30eb\u30c9\u30fc",
  "\u624b\u6deb",
  "\u30c7\u30ab\u30c1\u30f3",
  "\u4eca\u306e\u3067\u30ab\u30c1\u30f3\u3068\u304d\u305f",
  "\u30c7\u30ab\u30de\u30e9",
  "\u624b\u30b3\u30ad",
  "\u30c7\u30d6\u5c02",
  "\u624b\u30de\u30f3",
  "\u96fb\u52d5\u30b3\u30b1\u30b7",
  "\u7ae5\u8c9e",
  "\u5e8a\u4e0a\u624b",
  "\u5c60\u6bba",
  "\u571f\u4eba",
  "\u571f\u4eba\u5f62",
  "\u5357\u69752\u53f7",
  "\u8089\u58fa",
  "\u8089\u5974\u96b7",
  "\u8089\u68d2",
  "\u4e73\u982d",
  "\u4e73\u982d\u6e29\u6cc9",
  "\u4e73\u8f2a",
  "\u5c3f\u9053\u7403\u817a\u6db2",
  "\u58f2\u6625",
  "\u8cb7\u6625",
  "\u58f2\u5973",
  "\u30d1\u30a4\u30ba\u30ea",
  "\u6885\u6bd2",
  "\u30d1\u30a4\u30d1\u30f3",
  "\u80cc\u9762\u5ea7\u4f4d",
  "\u30d0\u30ab",
  "\u30d0\u30ab\u3069\u3082",
  "\u767d\u75f4",
  "\u30d0\u30bf\u30fc\u72ac",
  "\u82b1\u3073\u3089\u56de\u8ee2",
  "\u30cf\u30e1\u64ae\u308a",
  "\u30d2\u30c8\u30e9\u30fc",
  "\u4e00\u4eba\u30a8\u30c3\u30c1",
  "\u30d5\u30a1\u30c3\u30ad\u30e5\u30fc",
  "\u30d5\u30a1\u30c3\u30af",
  "\u30b9\u30ab\u30eb\u30d5\u30a1\u30c3\u30af",
  "\u30d5\u30a3\u30b9\u30c8\u30d5\u30a1\u30c3\u30af",
  "\u30d5\u30a7\u30e9\u30c1\u30aa",
  "\u30d7\u30c3\u30b7\u30fc",
  "\u90e8\u843d",
  "\u3078\u305f\u304f\u305d",
  "\u30da\u30c3\u30c6\u30a3\u30f3\u30b0",
  "\u30da\u30cb\u30b9",
  "\u30da\u30cb\u30b9\u30d0\u30f3\u30c9",
  "\u30d8\u30ed\u30a4\u30f3",
  "\u5305\u830e",
  "\u307c\u3063\u304d",
  "\u52c3\u8d77",
  "\u30db\u5225",
  "\u30dd\u30eb\u30c1\u30aa",
  "\u30de\u30b8\u30ad\u30c1",
  "\u30de\u30c3\u30c8\u30d7\u30ec\u30a4",
  "\u307e\u306a\u677f\u672c\u756a",
  "\u9ebb\u85ac",
  "\u30de\u30f3\u30ab\u30b9",
  "\u30de\u30f3\u6bdb",
  "\u307e\u3093\u3052",
  "\u307e\u3093\u3052\u3064\u305d\u3046",
  "\u30de\u30f3\u30b3",
  "\u304a\u307e\u3093\u3053",
  "\u307e\u3007\u3053",
  "\u307e\u25cf\u3053",
  "\u307e\u25ce\u3053",
  "\u30a6\u30eb\u30c8\u30e9\u30de\u30f3\u30b3\u30b9\u30e2\u30b9",
  "\u534d",
  "\u30de\u30f3\u81ed",
  "\u30de\u30f3\u6c41",
  "\u307e\u3093\u3059\u3058",
  "\u30df\u30b3\u30b9\u30ea\u534a",
  "\u30e1\u30a2\u30c9",
  "\u3081\u304f\u3089",
  "\u3081\u304f\u3089\u307e\u3057",
  "\u30a4\u30e1\u30af\u30e9",
  "\u30e1\u30e1\u30af\u30e9\u30b2",
  "\u3081\u3053\u3059\u3058",
  "\u30e1\u30b9\u30ab\u30ea\u30f3",
  "\u30e1\u30f3\u30d8\u30e9",
  "\u3084\u304f\u305f\u305f\u305a",
  "\u91ce\u7363\u5148\u8f29",
  "\u3084\u3081\u308d",
  "\u30e4\u30ea\u30de\u30f3",
  "\u30bf\u30b1\u30e4\u30ea\u30de\u30f3",
  "\u3088\u308f\u3044",
  "\u304b\u3088\u308f\u3044",
  "\u3088\u308f\u3059\u304e",
  "\u30e9\u30d6\u30b8\u30e5\u30fc\u30b9",
  "\u4e71\u4ea4",
  "\u4e71\u4ea4\u30d1\u30fc\u30c6\u30a3\u30fc",
  "\u30ea\u30b9\u30ab",
  "\u30ea\u30b9\u30c8\u30ab\u30c3\u30c8",
  "\u51cc\u8fb1",
  "\u9675\u8fb1",
  "\u8f2a\u59e6",
  "\u6dcb\u75c5",
  "\u30eb\u30f3\u30da\u30f3",
  "\u30ec\u30a4\u30d7",
  "\u30b9\u30ec\u30a4\u30d7\u30cb\u30eb",
  "\u305b\u3044\u308c\u3044\u30d7\u30ec\u30fc\u30c8",
  "\u30ec\u30ad\u30bd\u30bf\u30f3",
  "\u30ec\u30f3\u30c9\u30eb\u30df\u30f3",
  "\u30ed\u30ea\u30b3\u30f3",
  "\u30b4\u30b9\u30ed\u30ea\u30b3\u30f3\u30c6\u30b9\u30c8",
  "\u30ed\u30f3\u30d1\u30ea",
  "\u548c\u59e6",
  "\u3070\u304b",
  "\u3042\u307b",
  "\u307e\u306c\u3051",
  "\u3068\u3093\u307e",
  "\u306e\u308d\u307e",
  "\u3046\u3059\u306e\u308d",
  "\u3061\u304f\u3057\u3087\u3046",
  "\u304d\u3048\u308d",
  "\u3046\u305b\u308d",
  "\u3057\u306b\u305f\u3044",
  "\u3076\u3059",
  "\u3067\u3076",
  "\u306f\u3052",
  "\u307c\u3051",
  "\u305f\u308f\u3051",
  "\u3042\u307b\u3093\u3060\u3089",
  "\u3080\u304b\u3064\u304f",
  "\u3046\u3056\u3044",
  "\u304d\u3082\u3044",
  "\u304b\u3059",
  "\u3069\u3042\u307b",
  "\u3067\u304f\u306e\u307c\u3046",
  "\u306f\u3093\u307a\u3093",
  "\u3046\u3056\u3063\u305f\u3044",
  "\u304f\u305d\u304c\u304d",
  "\u304f\u305d\u3063\u305f\u308c",
  "\u304b\u3063\u3053\u308f\u308b\u3044"
];
/* 実在する動物の和名のみ（通報時の匿名表示用） */
const ANIMAL_ALIASES = [
  "キリン", "ゾウ", "ラッコ", "コアラ", "シロクマ",
  "カワウソ", "フクロウ", "イルカ", "ペンギン", "レッサーパンダ",
  "ハリネズミ", "タヌキ", "カメレオン", "ウサギ", "クジラ",
  "アルパカ", "カピバラ", "ヒョウ", "チーター", "ミーアキャット",
  "ビーバー", "リス", "キツネ", "オランウータン", "ナマケモノ"
];
const CRYPTO_BASE_SET = new Set(
  SYMBOL_PRESETS
    .filter((x) => x.market === "CRYPTO")
    .map((x) => x.symbol.replace(/-USD$/i, "").toUpperCase())
);

const app = {
  state: null,
  sessionUserId: null,
  lastPreview: null,
  chartLinkContext: null,
  view: "ranking",
  authMode: "login",
  symbolSuggestTimer: 0,
  symbolSuggestRequestId: 0,
  symbolSuggestCache: new Map(),
  fetchRouteByHost: new Map(),
  initialized: false,
  fetchChain: Promise.resolve(),
  nextFetchAt: 0,
  busyCounter: 0,
  interactiveFetch: false,
  lastApiFailure: null,
  pickDraftByUser: new Map(),
  pickUndoStack: [],
  messageAutoClearTimers: new Map(),
  rankMenuAutoCloseTimer: 0,
  addPickBtnJustAdded: false,
  pendingReportUserId: null,
  jpCompanyMaster: null,
  jpSuggestEngine: null,
  submitLocks: new Set(),
  pendingRegisterAfterIntro: false,
  pendingRegistration: null,
  registerConfirmWindow: null,
  autoFixInFlight: false,
  /** 予測リストから選んだ直後は、入力文字が変わるまで候補を出さない */
  symbolSuggestFreezeUntilEdit: false,
  symbolSuggestFreezeBaseline: "",
  /** バックグラウンド setInterval / リスナーの二重登録防止 */
  _backgroundTimersStarted: false,
  _cloudSyncPullLoopRegistered: false,
  els: {}
};

async function guardedSubmit(key, runner) {
  if (app.submitLocks.has(key)) {
    throw new Error("いま処理中です。少し待ってからもう一度お試しください。");
  }
  app.submitLocks.add(key);
  try {
    return await runner();
  } finally {
    app.submitLocks.delete(key);
  }
}

const aliasMap = buildAliasMap(SYMBOL_PRESETS);
const symbolPresetMap = buildSymbolPresetMap(SYMBOL_PRESETS);

const RECOVERY_QUESTIONS = Object.freeze([
  { id: "JUNIOR_HIGH", label: "卒業した中学校の名前" },
  { id: "ELEMENTARY", label: "卒業した小学校の名前" },
  { id: "FAVORITE_FOOD", label: "好きな食べ物" },
  { id: "FIRST_PET", label: "最初に飼ったペットの名前" },
  { id: "BIRTH_CITY", label: "生まれた市区町村" }
]);

/** ブラウザ間同期用（Firebase 有効時）。UUID v4 形式のみ許可（README_CLOUD_SYNC.md 参照） */
const STOCKGAME_SYNC_ID_KEY = "stockgame_v1_sync_id";
const FIRESTORE_SYNC_COLLECTION = "stockgame_sync_documents";
const FIREBASE_APP_JS = "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js";
const FIREBASE_FS_JS = "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js";
const CLOUD_PUSH_DEBOUNCE_MS = 2800;

let firebaseInitPromise = null;
let cloudPushTimer = null;
let supabaseCloudPushTimer = null;
/** 連続保存で push が重なると古い payload が後から上書きする恐れがあるため直列化 */
let firebaseCloudPushChain = Promise.resolve();
let supabaseCloudPushChain = Promise.resolve();
/** Firebase pull の最短間隔（フォーカス連打対策） */
let lastCloudPullAttemptMs = 0;
let lastPublicRankingSnapshotMs = 0;
let lastPublicSnapshotScheduledKey = "";
const loadedExternalScripts = new Set();

function getFirebaseSyncConfig() {
  const c = typeof window !== "undefined" && window.STOCKGAME_FIREBASE_SYNC;
  if (!c || !c.enabled) return null;
  if (!c.apiKey || !c.projectId) return null;
  return c;
}

/**
 * Supabase Edge Functions 同期（認証・状態は Edge + サービスロール）。
 * window.STOCKGAME_SUPABASE_CLOUD = {
 *   enabled: true,
 *   functionsBaseUrl: "https://<ref>.supabase.co/functions/v1",
 *   publishableKey: "sb_publishable_…"（任意・apikey ヘッダ向け）,
 *   anonKey: "eyJ…"（JWT・ゲートウェイ検証が有効なときログイン前の Authorization に必須）
 * }
 * Firebase 同期より優先される（同時に有効にしないこと）。
 *
 * デプロイ一覧:
 *   register, login, logout, reset-password, load-state, save-state, change-password, rename-account, delete-account, ranking-snapshot, account-stats
 * CORS: credentials: omit。Edge は Allow-Origin: *。
 * sb_publishable_* は JWT ではないため、verify_jwt が有効なとき Authorization に渡すと 401（Missing authorization / Invalid JWT）になる。anonKey（eyJ…）を別途渡す。
 * サーバーで app_users 削除時は API が code: SESSION_INVALID（401）を返し、クライアントはトークン破棄＋リモートユーザーをローカルから除去する。
 */
let _warnedMissingSupabasePublishableKey = false;
let _warnedMissingSupabaseGatewayJwt = false;

function isLikelySupabaseJwtKey(s) {
  return typeof s === "string" && s.startsWith("eyJ") && s.includes(".");
}

function getSupabaseCloudConfig() {
  const c = typeof window !== "undefined" && window.STOCKGAME_SUPABASE_CLOUD;
  if (!c || !c.enabled) return null;
  const base = String(c.functionsBaseUrl || "").trim().replace(/\/$/, "");
  if (!base) return null;
  const anon = String(c.anonKey || "").trim();
  const pub = String(c.publishableKey || "").trim();
  const jwtAnon = isLikelySupabaseJwtKey(anon)
    ? anon
    : isLikelySupabaseJwtKey(pub)
      ? pub
      : "";
  const apikeyHeader = pub || anon || jwtAnon || null;

  if (!apikeyHeader && !_warnedMissingSupabasePublishableKey) {
    _warnedMissingSupabasePublishableKey = true;
    console.warn(
      "STOCKGAME_SUPABASE_CLOUD: publishableKey または anonKey が未設定です。Supabase のゲートウェイが Edge を拒否する場合があります。"
    );
  }

  const hasNonJwtOnly =
    apikeyHeader &&
    !jwtAnon &&
    !isLikelySupabaseJwtKey(pub) &&
    !isLikelySupabaseJwtKey(anon);
  if (hasNonJwtOnly && !_warnedMissingSupabaseGatewayJwt) {
    _warnedMissingSupabaseGatewayJwt = true;
    console.warn(
      "STOCKGAME_SUPABASE_CLOUD: sb_publishable のみでは Edge の JWT ゲートウェイで 401 になることがあります。Dashboard → Settings → API の anon（eyJ…）を anonKey に追加するか、各関数で JWT 検証をオフ（verify_jwt=false）にしてください。"
    );
  }

  return {
    functionsBaseUrl: base,
    apikeyHeader,
    /** ログイン前の Authorization: Bearer（ゲートウェイ用）。セッション取得後は STOCKGAME セッショントークンを使う */
    gatewayJwt: jwtAnon || null,
    fallbackBearer: apikeyHeader
  };
}

/**
 * Supabase Edge 呼び出し用ヘッダー（apikey ＋ Authorization）。
 * @param {Headers} headers
 * @param {{ apikeyHeader: string|null, gatewayJwt: string|null, fallbackBearer: string|null }} cfg
 * @param {{ bearerToken?: string|null }} [opts] logout 等で明示的にトークンを渡す。省略時は getSupabaseSessionToken()
 */
function setSupabaseEdgeFetchHeaders(headers, cfg, opts) {
  const apikey = cfg.apikeyHeader;
  const gatewayJwt = cfg.gatewayJwt;
  const fallbackBearer = cfg.fallbackBearer;
  let bearer = opts && Object.prototype.hasOwnProperty.call(opts, "bearerToken")
    ? opts.bearerToken
    : getSupabaseSessionToken();
  if (bearer === undefined) bearer = null;
  if (apikey) headers.set("apikey", apikey);
  if (bearer) {
    headers.set("Authorization", `Bearer ${bearer}`);
  } else if (gatewayJwt) {
    headers.set("Authorization", `Bearer ${gatewayJwt}`);
  } else if (fallbackBearer) {
    headers.set("Authorization", `Bearer ${fallbackBearer}`);
  }
}

function getCloudSyncBackend() {
  if (getSupabaseCloudConfig()) return "supabase";
  if (getFirebaseSyncConfig()) return "firebase";
  return null;
}

const STOCKGAME_SUPABASE_SESSION_KEY = "stockgame_v1_supabase_session";
const STOCKGAME_SUPABASE_SESSION_INVALID = "SESSION_INVALID";

/** 署名検証なしでセッショントークン payload の sub（ユーザー UUID）だけ取り出す（サーバー削除時のローカル整合用） */
function decodeSupabaseSessionSubUnverified(token) {
  if (typeof token !== "string" || !token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    let payloadB64 = parts[1];
    const pad = "=".repeat((4 - (payloadB64.length % 4)) % 4);
    const b64 = payloadB64.replace(/-/g, "+").replace(/_/g, "/") + pad;
    const bin = atob(b64);
    const body = JSON.parse(bin);
    const sub = body && typeof body.sub === "string" ? body.sub.trim() : null;
    return sub || null;
  } catch (_) {
    return null;
  }
}

function supabasePathSkipsStale401Handling(path) {
  const p = String(path || "").replace(/^\//, "");
  return p === "login" || p === "register" || p === "reset-password" || p === "ranking-snapshot" ||
    p === "account-stats";
}

/**
 * Supabase からセッション失効を示されたときのローカル整合。
 * @param {string|null} tokenSnapshot clear 前のトークン（purge 用 sub 取得）
 * @param {{ purgeRemoteUser?: boolean }} opts SESSION_INVALID なら true（サーバーでユーザー削除等）
 */
function applySupabaseSessionInvalidated(tokenSnapshot, opts) {
  const purgeRemote = Boolean(opts && opts.purgeRemoteUser);
  const hadToken = Boolean(tokenSnapshot);
  clearSupabaseSessionToken();

  if (purgeRemote && tokenSnapshot) {
    const sub = decodeSupabaseSessionSubUnverified(tokenSnapshot);
    if (sub) {
      const u = (app.state?.users || []).find(
        (x) => x && x.id === sub && String(x.passwordAlgo || "") === "remote"
      );
      if (u) purgeUserCompletely(sub);
      else if (app.sessionUserId === sub || app.state?.sessionUserId === sub) {
        app.sessionUserId = null;
        if (app.state) app.state.sessionUserId = null;
        app.pickUndoStack = [];
        if (typeof showPreview === "function") showPreview(null);
      }
    } else {
      const cur = typeof getCurrentUser === "function" ? getCurrentUser() : null;
      if (cur && String(cur.passwordAlgo || "") === "remote") {
        app.sessionUserId = null;
        if (app.state) app.state.sessionUserId = null;
      }
    }
  } else {
    const cur = typeof getCurrentUser === "function" ? getCurrentUser() : null;
    if (cur && String(cur.passwordAlgo || "") === "remote") {
      app.sessionUserId = null;
      if (app.state) app.state.sessionUserId = null;
    }
  }

  try {
    if (typeof saveState === "function") saveState();
  } catch (_) {}
  try {
    if (typeof renderAll === "function" && app?.els) renderAll();
  } catch (_) {}
  if (typeof showGlobalNotice === "function") {
    if (purgeRemote && hadToken) {
      showGlobalNotice(
        "サーバー側でアカウントが削除されたか、セッションが無効になりました。再度ログインしてください。",
        true
      );
    } else {
      showGlobalNotice("セッションの有効期限が切れたか無効です。再度ログインしてください。", true);
    }
  }
}

function getSupabaseSessionToken() {
  try {
    return localStorage.getItem(STOCKGAME_SUPABASE_SESSION_KEY);
  } catch (_) {
    return null;
  }
}

function setSupabaseSessionToken(token) {
  try {
    if (token) localStorage.setItem(STOCKGAME_SUPABASE_SESSION_KEY, token);
    else localStorage.removeItem(STOCKGAME_SUPABASE_SESSION_KEY);
  } catch (_) {}
}

function clearSupabaseSessionToken() {
  setSupabaseSessionToken(null);
}

/**
 * Supabase 有効時、logout Edge を叩く（失敗しても握りつぶす）。
 * @param {string|null} [tokenOverride] purgeUserCompletely 等で先に localStorage を消す前に渡す。
 */
async function notifySupabaseLogoutBestEffort(tokenOverride) {
  const cfg = getSupabaseCloudConfig();
  if (!cfg) return;
  const token =
    tokenOverride !== undefined && tokenOverride !== null
      ? tokenOverride
      : getSupabaseSessionToken();
  if (!token) return;
  try {
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    setSupabaseEdgeFetchHeaders(headers, cfg, { bearerToken: token });
    const url = `${cfg.functionsBaseUrl}/logout`;
    const res = await fetch(url, {
      method: "POST",
      mode: "cors",
      credentials: "omit",
      headers,
      body: "{}"
    });
    const text = await res.text();
    if (!res.ok) {
      let errBody = null;
      try {
        errBody = text ? JSON.parse(text) : null;
      } catch (_) {}
      console.warn("supabase logout HTTP error", res.status, errBody && errBody.error);
    }
  } catch (e) {
    console.warn("supabase logout request failed", e);
  }
}

const STOCKGAME_SUPABASE_FETCH_TIMEOUT_MS = 25000;

function assertSafeSupabaseEdgePath(path) {
  const p = String(path || "").replace(/^\//, "");
  if (!/^[a-z][a-z0-9-]*$/.test(p)) {
    throw new Error("無効な API パスです。");
  }
  return p;
}

/** クラウド時は DB の登録件数（Edge `account-stats`）、非クラウド時はこの端末のローカル件数 */
function updateAccountCountLabel() {
  if (!app.els?.accountCountLabel) return;
  const el = app.els.accountCountLabel;
  const cloud = getSupabaseCloudConfig();
  const maxShown = CONFIG.maxUsers;
  if (cloud) {
    const s = app._cloudAccountStats;
    if (s && typeof s.registeredCount === "number" && typeof s.maxUsers === "number") {
      el.textContent = `${s.registeredCount} / ${s.maxUsers}`;
      el.removeAttribute("title");
      return;
    }
    if (app._cloudAccountStatsLoading) {
      el.textContent = `取得中… / ${maxShown}`;
      el.removeAttribute("title");
      return;
    }
    if (app._cloudAccountStatsError) {
      el.textContent = `— / ${maxShown}`;
      el.title =
        "登録人数をサーバーから取得できませんでした。Supabase で Edge 関数 account-stats をデプロイし、ブラウザの開発者ツール（ネットワーク）で応答を確認してください。";
      return;
    }
    el.textContent = `取得中… / ${maxShown}`;
    el.removeAttribute("title");
    return;
  }
  el.textContent = `${getActiveUsers().length} / ${maxShown}`;
  el.removeAttribute("title");
}

async function refreshCloudAccountRegistrationStats() {
  if (!getSupabaseCloudConfig()) {
    app._cloudAccountStatsLoading = false;
    app._cloudAccountStatsError = false;
    updateAccountCountLabel();
    return;
  }
  app._cloudAccountStatsLoading = true;
  app._cloudAccountStatsError = false;
  updateAccountCountLabel();
  try {
    const data = await supabaseCloudFetch("account-stats", { body: "{}" });
    if (data?.ok && typeof data.registeredCount === "number" && typeof data.maxUsers === "number") {
      app._cloudAccountStats = {
        registeredCount: data.registeredCount,
        maxUsers: data.maxUsers,
        fetchedAtMs: Date.now(),
      };
      app._cloudAccountStatsError = false;
    } else {
      app._cloudAccountStatsError = true;
    }
  } catch (e) {
    console.warn("account-stats fetch failed", e);
    app._cloudAccountStatsError = true;
  } finally {
    app._cloudAccountStatsLoading = false;
    updateAccountCountLabel();
  }
}

async function supabaseCloudFetch(path, init = {}) {
  const cfg = getSupabaseCloudConfig();
  if (!cfg) throw new Error("Supabase クラウドが無効です。");
  const safePath = assertSafeSupabaseEdgePath(path);
  const headers = new Headers(init.headers || {});
  headers.set("Content-Type", "application/json");
  setSupabaseEdgeFetchHeaders(headers, cfg);
  const url = `${cfg.functionsBaseUrl}/${safePath}`;
  const fetchOpts = {
    method: init.method || "POST",
    mode: "cors",
    credentials: "omit",
    headers,
    body: init.body != null ? init.body : undefined
  };
  if (init.signal) {
    fetchOpts.signal = init.signal;
  } else if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
    fetchOpts.signal = AbortSignal.timeout(STOCKGAME_SUPABASE_FETCH_TIMEOUT_MS);
  }
  const res = await fetch(url, fetchOpts);
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (_) {}
  if (!res.ok) {
    const msg = (data && data.error) || `HTTP ${res.status}`;
    const tokenSnapshot = getSupabaseSessionToken();
    const code = data && data.code;
    if (code === STOCKGAME_SUPABASE_SESSION_INVALID) {
      applySupabaseSessionInvalidated(tokenSnapshot, { purgeRemoteUser: true });
    } else if (res.status === 401 && !supabasePathSkipsStale401Handling(path)) {
      applySupabaseSessionInvalidated(tokenSnapshot, { purgeRemoteUser: false });
    }
    throw new Error(msg);
  }
  return data;
}

function isValidSyncId(id) {
  return (
    typeof id === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id.trim())
  );
}

function generateSyncId() {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
  } catch (_) {}
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (ch) => {
    const r = (Math.random() * 16) | 0;
    const v = ch === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getOrCreateSyncId() {
  try {
    let id = localStorage.getItem(STOCKGAME_SYNC_ID_KEY);
    if (isValidSyncId(id)) return id.trim();
    id = generateSyncId();
    localStorage.setItem(STOCKGAME_SYNC_ID_KEY, id);
    return id;
  } catch (_) {
    return generateSyncId();
  }
}

function hydrateSyncIdFromUrl() {
  try {
    const u = new URL(window.location.href);
    const raw = u.searchParams.get("sync");
    if (!raw) return;
    const id = decodeURIComponent(String(raw)).trim();
    if (!isValidSyncId(id)) return;
    localStorage.setItem(STOCKGAME_SYNC_ID_KEY, id);
    u.searchParams.delete("sync");
    const next = u.pathname + (u.search ? u.search : "") + u.hash;
    window.history.replaceState({}, "", next);
  } catch (_) {}
}

function loadScriptOnce(src) {
  if (loadedExternalScripts.has(src)) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => {
      loadedExternalScripts.add(src);
      resolve();
    };
    s.onerror = () => reject(new Error("script load failed: " + src));
    document.head.appendChild(s);
  });
}

function buildCloudPayloadJson(state) {
  const clone = JSON.parse(JSON.stringify(state));
  clone.apiCache = { quote: {}, history: {} };
  return JSON.stringify(clone);
}

async function ensureFirebaseDb() {
  const cfg = getFirebaseSyncConfig();
  if (!cfg) return null;
  if (firebaseInitPromise) {
    try {
      return await firebaseInitPromise;
    } catch (_) {
      firebaseInitPromise = null;
    }
  }
  firebaseInitPromise = (async () => {
    await loadScriptOnce(FIREBASE_APP_JS);
    await loadScriptOnce(FIREBASE_FS_JS);
    if (typeof firebase === "undefined" || !firebase.apps) {
      throw new Error("firebase compat not available");
    }
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: cfg.apiKey,
        authDomain: cfg.authDomain || "",
        projectId: cfg.projectId,
        storageBucket: cfg.storageBucket || "",
        messagingSenderId: cfg.messagingSenderId || "",
        appId: cfg.appId || ""
      });
    }
    return firebase.firestore();
  })();
  try {
    return await firebaseInitPromise;
  } catch (e) {
    firebaseInitPromise = null;
    throw e;
  }
}

async function pushSupabaseCloudState() {
  const cfg = getSupabaseCloudConfig();
  if (!cfg || !app?.state) return;
  const token = getSupabaseSessionToken();
  if (!token) return;
  try {
    const json = buildCloudPayloadJson(app.state);
    if (json.length > CONFIG.cloudPayloadMaxChars) {
      if (typeof showGlobalNotice === "function") {
        showGlobalNotice(
          "保存データが大きすぎるためクラウドへ同期できませんでした。しばらく利用してキャッシュが整理されたあと、再保存をお試しください。",
          true
        );
      }
      console.warn("supabase cloud push skipped: payload too large");
      return;
    }
    const clone = JSON.parse(json);
    await supabaseCloudFetch("save-state", {
      body: JSON.stringify({ state: clone })
    });
  } catch (e) {
    console.warn("supabase cloud push failed", e);
    const msg = e instanceof Error ? e.message : String(e);
    if (/大きすぎ|413|too large/i.test(msg) && typeof showGlobalNotice === "function") {
      showGlobalNotice(
        "クラウドへの保存が拒否されました（データサイズ超過）。履歴の古い月が自動整理されるまでお待ちください。",
        true
      );
    }
  }
}

async function pushCloudState() {
  const cfg = getFirebaseSyncConfig();
  if (!cfg || !app?.state) return;
  const syncId = getOrCreateSyncId();
  try {
    const db = await ensureFirebaseDb();
    if (!db) return;
    const lastSavedAtMs = Number(app.state.lastSavedAtMs) || Date.now();
    const payload = buildCloudPayloadJson(app.state);
    if (payload.length > CONFIG.cloudPayloadMaxChars) {
      console.warn("cloud payload too large; skip push");
      return;
    }
    await db.collection(FIRESTORE_SYNC_COLLECTION).doc(syncId).set(
      {
        data: payload,
        lastSavedAtMs,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      },
      { merge: true }
    );
  } catch (e) {
    console.warn("cloud push failed", e);
  }
}

function scheduleCloudPush() {
  const backend = getCloudSyncBackend();
  if (backend === "firebase") {
    if (cloudPushTimer) clearTimeout(cloudPushTimer);
    cloudPushTimer = setTimeout(() => {
      cloudPushTimer = null;
      firebaseCloudPushChain = firebaseCloudPushChain
        .then(() => pushCloudState())
        .catch((e) => console.warn("firebase cloud push failed", e));
    }, CLOUD_PUSH_DEBOUNCE_MS);
    return;
  }
  if (backend === "supabase") {
    if (supabaseCloudPushTimer) clearTimeout(supabaseCloudPushTimer);
    supabaseCloudPushTimer = setTimeout(() => {
      supabaseCloudPushTimer = null;
      supabaseCloudPushChain = supabaseCloudPushChain
        .then(() => pushSupabaseCloudState())
        .catch((e) => console.warn("supabase cloud push failed", e));
    }, CLOUD_PUSH_DEBOUNCE_MS);
  }
}

/** @returns {Promise<boolean>} Supabase リモートを取り込んで状態を更新したら true */
async function supabaseCloudPullIfNewer() {
  const cfg = getSupabaseCloudConfig();
  if (!cfg) return false;
  const token = getSupabaseSessionToken();
  if (!token) return false;
  const now = Date.now();
  if (lastCloudPullAttemptMs && now - lastCloudPullAttemptMs < CONFIG.cloudPullMinIntervalMs) {
    return false;
  }
  lastCloudPullAttemptMs = now;
  try {
    const data = await supabaseCloudFetch("load-state", { body: "{}" });
    const remote = data && data.state;
    if (!remote || typeof remote !== "object") return false;
    const remoteMs = Number(remote.lastSavedAtMs) || 0;
    const localMs = Number(app.state?.lastSavedAtMs) || 0;
    if (remoteMs > localMs) {
      app.state = normalizeState(remote);
      if (app.state.sessionUserId) app.sessionUserId = app.state.sessionUserId;
      /* いま取り込んだ内容をそのままサーバーへ再送しない（競合・無駄な負荷防止） */
      saveState({ skipCloudPush: true });
      return true;
    }
  } catch (e) {
    console.warn("supabase cloud pull failed", e);
  }
  return false;
}

/**
 * Edge ranking-snapshot の結果をローカル state にマージする。
 * ログイン中の session ユーザーは除外（自分の行は load-state / ローカル編集を優先）。
 * @returns {boolean} users または rankings を更新したら true
 */
function rankingSnapshotRowsSig(r) {
  if (!r || typeof r !== "object") return "";
  const rows = Array.isArray(r.rows) ? r.rows : [];
  const ids = rows.map((x) => (x && x.userId) || "").join("\x1f");
  return `${String(r.season || "")}\x1e${String(r.settledAt || "")}\x1e${rows.length}\x1e${ids}`;
}

function mergePublicRankingSnapshot(data) {
  if (!data || !data.ok) return false;
  const usersArr = Array.isArray(data.users) ? data.users : [];
  const sessionId = app.sessionUserId || null;
  const snapshotUserIds = new Set();
  let changed = false;
  const byId = new Map((app.state.users || []).map((u) => [u.id, u]));
  for (const raw of usersArr) {
    if (!raw || typeof raw !== "object" || typeof raw.id !== "string") continue;
    if (raw.isDeleted) continue;
    snapshotUserIds.add(raw.id);
    if (sessionId && raw.id === sessionId) continue;
    const nu = normalizeUser(raw);
    if (!nu || !nu.id) continue;
    const existing = byId.get(nu.id);
    if (!existing) {
      byId.set(nu.id, nu);
      changed = true;
      continue;
    }
    const nT = Date.parse(nu.updatedAt || "") || 0;
    const eT = Date.parse(existing.updatedAt || "") || 0;
    if (nT > eT) {
      byId.set(nu.id, nu);
      changed = true;
    }
  }
  /* ranking-snapshot に含まれない remote ユーザーは DB から消えたとみなして除去（ライブランキング用） */
  for (const [id, u] of [...byId.entries()]) {
    if (sessionId && id === sessionId) continue;
    if (!u || String(u.passwordAlgo || "") !== "remote") continue;
    if (!snapshotUserIds.has(id)) {
      byId.delete(id);
      changed = true;
    }
  }
  if (changed) {
    app.state.users = [...byId.values()];
  }

  const remRank = Array.isArray(data.rankings) ? data.rankings : [];
  if (remRank.length) {
    const bySeason = new Map((app.state.rankings || []).map((r) => [r.season, r]));
    let rChanged = false;
    for (const raw of remRank) {
      if (!raw || typeof raw !== "object" || typeof raw.season !== "string") continue;
      const nr = normalizeRanking(raw);
      const prev = bySeason.get(nr.season);
      const prevN = prev && Array.isArray(prev.rows) ? prev.rows.length : 0;
      const nextN = Array.isArray(nr.rows) ? nr.rows.length : 0;
      const prevT = prev && prev.settledAt ? Date.parse(prev.settledAt) : 0;
      const nextT = nr.settledAt ? Date.parse(nr.settledAt) : 0;
      const sigPrev = prev ? rankingSnapshotRowsSig(prev) : "";
      const sigNext = rankingSnapshotRowsSig(nr);
      if (
        !prev ||
        nextN > prevN ||
        nextN < prevN ||
        (nextN === prevN && nextT > prevT) ||
        sigPrev !== sigNext
      ) {
        bySeason.set(nr.season, nr);
        rChanged = true;
      }
    }
    if (rChanged) {
      app.state.rankings = [...bySeason.values()].sort(
        (a, b) => seasonToIndex(a.season) - seasonToIndex(b.season)
      );
      changed = true;
    }
  }
  return changed;
}

/**
 * 未ログインでも他ブラウザの登録がランキングに載るよう、DB 上の全スナップショットをマージ取得。
 * Yahoo は使わずサーバーの game_state のみ参照。
 * @param {"boot"|"visible"|"scheduled"} reason
 * @returns {Promise<boolean>}
 */
async function pullPublicRankingSnapshot(reason) {
  if (!getSupabaseCloudConfig()) return false;
  const now = Date.now();
  const minMs = CONFIG.publicRankingSnapshotMinIntervalMs;
  if (reason !== "boot" && reason !== "scheduled") {
    if (lastPublicRankingSnapshotMs && now - lastPublicRankingSnapshotMs < minMs) return false;
  }
  try {
    const data = await supabaseCloudFetch("ranking-snapshot", { body: "{}" });
    if (!data || !data.ok) return false;
    const changed = mergePublicRankingSnapshot(data);
    lastPublicRankingSnapshotMs = Date.now();
    if (changed) {
      try {
        saveState();
      } catch (_) {}
    }
    return changed;
  } catch (e) {
    console.warn("ranking-snapshot failed", e);
    return false;
  }
}

/** 日本時間 0/6/12/18 時台に 1 回ずつ ranking-snapshot を取得（1 日最大 4 回） */
function startPublicRankingSnapshotTimer() {
  if (!getSupabaseCloudConfig() || app._publicRankingSnapTimerStarted) return;
  app._publicRankingSnapTimerStarted = true;
  const SLOTS = [0, 6, 12, 18, 21];
  setInterval(() => {
    if (document.visibilityState !== "visible") return;
    const p = getTimePartsByZone(new Date(), CONFIG.jstTimeZone);
    if (p.minute !== 4) return;
    if (!SLOTS.includes(p.hour)) return;
    const key = `${p.year}-${p.month}-${p.day}-${p.hour}`;
    if (key === lastPublicSnapshotScheduledKey) return;
    lastPublicSnapshotScheduledKey = key;
    void pullPublicRankingSnapshot("scheduled").then((applied) => {
      if (applied && typeof renderAll === "function") renderAll();
    });
  }, 60 * 1000);
}

/** @returns {Promise<boolean>} リモートを取り込んで状態を更新したら true */
async function cloudPullIfNewer() {
  if (getSupabaseCloudConfig()) return supabaseCloudPullIfNewer();
  const cfg = getFirebaseSyncConfig();
  if (!cfg) return false;
  const now = Date.now();
  if (lastCloudPullAttemptMs && now - lastCloudPullAttemptMs < CONFIG.cloudPullMinIntervalMs) {
    return false;
  }
  lastCloudPullAttemptMs = now;
  const syncId = getOrCreateSyncId();
  try {
    const db = await ensureFirebaseDb();
    if (!db) return false;
    const snap = await db.collection(FIRESTORE_SYNC_COLLECTION).doc(syncId).get();
    if (!snap.exists) return false;
    const remote = snap.data();
    const remoteMs = Number(remote && remote.lastSavedAtMs) || 0;
    const localMs = Number(app.state && app.state.lastSavedAtMs) || 0;
    if (remoteMs <= localMs) return false;
    const raw = remote.data;
    if (typeof raw !== "string") return false;
    if (raw.length > CONFIG.cloudPayloadMaxChars) {
      console.warn("cloud pull payload too large; skip");
      return false;
    }
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (_) {
      return false;
    }
    app.state = normalizeState(parsed);
    app.sessionUserId = app.state.sessionUserId || null;
    try {
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(app.state));
    } catch (err) {
      console.error("save after cloud pull failed", err);
    }
    return true;
  } catch (e) {
    console.warn("cloud pull failed", e);
    return false;
  }
}

/** Safari と Chrome など別ブラウザで保存された内容を、タブ復帰・定期ポーリングで取り込む */
function startCloudSyncPullLoop() {
  if (!getCloudSyncBackend()) return;
  if (app._cloudSyncPullLoopRegistered) return;
  app._cloudSyncPullLoopRegistered = true;
  let busy = false;
  const run = async () => {
    if (!app.initialized || busy || document.visibilityState !== "visible") return;
    busy = true;
    try {
      let needsRender = false;
      const applied = await cloudPullIfNewer();
      if (applied) needsRender = true;
      const pub = await pullPublicRankingSnapshot("visible");
      if (pub) needsRender = true;
      const seasonRolled = await rollSeasonIfNeeded();
      if (seasonRolled) needsRender = true;
      if (needsRender) renderAll();
    } catch (e) {
      console.warn("cloud sync pull loop failed", e);
    } finally {
      busy = false;
    }
  };
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") void run();
  });
  window.addEventListener("focus", () => void run());
  setInterval(() => {
    if (document.visibilityState !== "visible") return;
    void run();
  }, 45000);
}

function showBootInitError(err) {
  console.error("stockgame init failed", err);
  const msg = err && err.message ? String(err.message) : String(err);
  const detail =
    "ページの初期化に失敗しました。GitHub Pages では stockgame.js や jp_company_autocomplete_engine.js の 404、HTML の欠落がよくあります。F12 → コンソール・ネットワークを確認してください。\n\n" +
    msg;
  const box = document.getElementById("globalNotice");
  if (box) {
    box.classList.remove("hidden");
    box.style.borderLeftColor = "#b4223a";
    box.textContent = detail;
  } else {
    alert(detail);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  try {
    registerSaveStateLifecycleHooks();
  } catch (e) {
    showBootInitError(e);
    return;
  }
  void initializeApp().catch((e) => showBootInitError(e));
});

/** 会社マスタ待ちの前に同期。再読込直後の「未ログイン」一瞬表示を防ぐ */
function patchLoginChromeFromSession() {
  const user = getCurrentUser();
  const loggedIn = Boolean(user);
  app.els.loginStatusLabel.textContent = user ? `ログイン中: ${getDisplayName(user)}` : "未ログイン";
  app.els.loginStatusLabel.classList.toggle("login-state-in", loggedIn);
  app.els.loginStatusLabel.classList.toggle("login-state-out", !loggedIn);
  updateAccountCountLabel();
}

async function initializeApp() {
  app.els = getElements();
  wireEvents();
  renderHintChips();
  hydrateSyncIdFromUrl();
  app.state = loadState();
  app.sessionUserId = app.state.sessionUserId || null;
  patchLoginChromeFromSession();
  updateActionAvailability();
  void refreshCloudAccountRegistrationStats();
  // company_master.json は初回描画を遅らせない。銘柄欄フォーカス・市場JP/AUTO・プレビュー等で遅延ロード。

  const pulled = await cloudPullIfNewer();
  if (pulled) {
    patchLoginChromeFromSession();
    updateActionAvailability();
  }
  const pubMerged = await pullPublicRankingSnapshot("boot");
  if (pubMerged) {
    patchLoginChromeFromSession();
    updateActionAvailability();
  }
  hydrateSettingsFromQuery();

  try {
    await rollSeasonIfNeeded();
    renderAll();
    app.initialized = true;
    if (CONFIG.enableBootAutoRefresh) {
      await refreshDailyPricesIfNeeded();
    } else {
      void refreshDailyPricesIfNeeded().catch((err) => console.error("background refresh failed", err));
    }
    if (!app._backgroundTimersStarted) {
      app._backgroundTimersStarted = true;
      startRankingAutoRefreshTimer();
      startJpAutoUpdateTimers();
      startUsAutoUpdateTimers();
      startCryptoAutoUpdateTimers();
      startPendingAutoFixTimer();
      startCloudSyncPullLoop();
      startPublicRankingSnapshotTimer();
    }
  } catch (error) {
    console.error(error);
    showGlobalNotice("初期化に失敗しました。ページを再読み込みしてください。", true);
    renderAll();
  }
}

function startRankingAutoRefreshTimer() {
  const CHECK_MS = 60 * 1000;
  let lastRunKey = "";
  setInterval(() => {
    if (document.visibilityState !== "visible") return;
    const p = getTimePartsByZone(new Date(), "Asia/Tokyo");
    const hour = p.hour;
    const minute = p.minute;
    if (minute !== 0) return;
    if (hour !== 0 && hour !== 12) return;
    const key = `${p.year}-${pad2(p.month)}-${pad2(p.day)}-${hour}`;
    if (lastRunKey === key) return;
    lastRunKey = key;
    void runDailyRankingRefresh();
  }, CHECK_MS);
}

function startJpAutoUpdateTimers() {
  // JP は Yahoo 許可ウィンドウが短いので、その中だけ「最新価格」だけ更新します。
  const CHECK_MS = 20 * 1000;
  let lastRunKey = "";

  function runIfNeededAt(hour, minute, keySuffix) {
    const user = getCurrentUser();
    if (!user) return;
    const hasJpOpen = (user.picks || []).some((p) => p && p.status !== "CLOSED" && p.market === "JP");
    if (!hasJpOpen) return;

    const p = getTimePartsByZone(new Date(), "Asia/Tokyo");
    if (p.hour !== hour || p.minute !== minute) return;
    const key = `${p.year}-${pad2(p.month)}-${pad2(p.day)}-${keySuffix}`;
    if (lastRunKey === key) return;
    lastRunKey = key;

    void (async () => {
      try {
        await refreshCurrentUserLatest(true);
        app.state.lastRankUpdateAt = new Date().toISOString();
        app.state.lastDailyRefreshDate = getDateKeyJst(new Date());
        saveState();
        renderAll();
      } catch (_) {}
    })();
  }

  setInterval(() => {
    if (document.visibilityState !== "visible") return;
    if (app.busyCounter > 0) return;
    // AM: 09:30 の約定相当だが Yahoo 許可は 09:45-10:15 → 09:55 で更新
    runIfNeededAt(9, 55, "09-55");
    // PM: 15:33 の約定相当だが Yahoo 許可は 15:48-16:05 → 15:50 で更新
    runIfNeededAt(15, 50, "15-50");
  }, CHECK_MS);
}

function startUsAutoUpdateTimers() {
  // US は Yahoo 許可が市場時間中なので、AM/PM 約定後に「最新価格」だけ更新します。
  const CHECK_MS = 20 * 1000;
  let lastRunKey = "";

  setInterval(() => {
    if (document.visibilityState !== "visible") return;
    if (app.busyCounter > 0) return;
    const user = getCurrentUser();
    if (!user) return;
    const hasUsOpen = (user.picks || []).some((p) => p && p.status !== "CLOSED" && p.market === "US");
    if (!hasUsOpen) return;

    const p = getTimePartsByZone(new Date(), "America/New_York");
    // AM: 10:00 頃の約定相当 → 10:05
    if (p.hour === 10 && (p.minute === 5 || p.minute === 6)) {
      const key = `${p.year}-${pad2(p.month)}-${pad2(p.day)}-10-05`;
      if (lastRunKey !== key) {
        lastRunKey = key;
        void (async () => {
          try {
            await refreshCurrentUserLatest(true);
            app.state.lastRankUpdateAt = new Date().toISOString();
            saveState();
            renderAll();
          } catch (_) {}
        })();
      }
    }
    // PM: 16:00 頃の約定相当 → 16:05
    if (p.hour === 16 && (p.minute === 5 || p.minute === 6)) {
      const key = `${p.year}-${pad2(p.month)}-${pad2(p.day)}-16-05`;
      if (lastRunKey !== key) {
        lastRunKey = key;
        void (async () => {
          try {
            await refreshCurrentUserLatest(true);
            app.state.lastRankUpdateAt = new Date().toISOString();
            saveState();
            renderAll();
          } catch (_) {}
        })();
      }
    }
  }, CHECK_MS);
}

function startCryptoAutoUpdateTimers() {
  // Crypto は Yahoo を使わず（CryptoCompare を利用）、00/12 の約定相当にあわせて最新価格を更新します。
  const CHECK_MS = 20 * 1000;
  let lastRunKey = "";

  setInterval(() => {
    if (document.visibilityState !== "visible") return;
    if (app.busyCounter > 0) return;
    const user = getCurrentUser();
    if (!user) return;
    const hasCryptoOpen = (user.picks || []).some((p) => p && p.status !== "CLOSED" && p.market === "CRYPTO");
    if (!hasCryptoOpen) return;

    const p = getTimePartsByZone(new Date(), "Asia/Tokyo");
    // 00:00 の約定相当 → 00:05
    if (p.hour === 0 && (p.minute === 5 || p.minute === 6)) {
      const key = `${p.year}-${pad2(p.month)}-${pad2(p.day)}-00-05`;
      if (lastRunKey !== key) {
        lastRunKey = key;
        void (async () => {
          try {
            await refreshCurrentUserLatest(true);
            app.state.lastRankUpdateAt = new Date().toISOString();
            saveState();
            renderAll();
          } catch (_) {}
        })();
      }
    }
    // 12:00 の約定相当 → 12:05
    if (p.hour === 12 && (p.minute === 5 || p.minute === 6)) {
      const key = `${p.year}-${pad2(p.month)}-${pad2(p.day)}-12-05`;
      if (lastRunKey !== key) {
        lastRunKey = key;
        void (async () => {
          try {
            await refreshCurrentUserLatest(true);
            app.state.lastRankUpdateAt = new Date().toISOString();
            saveState();
            renderAll();
          } catch (_) {}
        })();
      }
    }
  }, CHECK_MS);
}

function startPendingAutoFixTimer() {
  const TICK_MS = 60 * 1000; // 短い間隔で「確認」だけし、APIはスロットルする
  setInterval(() => {
    if (document.visibilityState !== "visible") return;
    // 二重実行/処理中はスキップ
    if (app.busyCounter > 0) return;
    if (app.autoFixInFlight) return;
    app.autoFixInFlight = true;
    void maybeAutoFixPendingPicks().finally(() => { app.autoFixInFlight = false; });
  }, TICK_MS);
}

function pickMarketFromSymbol(symbol) {
  return inferMarketFromKnownSymbol(symbol);
}

function shouldFetchHistoryForAutoFix(symbol, now) {
  const s = app?.state?.security?.autoFix;
  if (!s) return true;
  const perSymbolMinMs = 45 * 60 * 1000; // 銘柄ごとに45分に1回まで
  const errorMinMs = 90 * 60 * 1000; // 失敗時はさらに長く
  const last = s.lastBySymbol?.[symbol] || 0;
  if (last && now - last < perSymbolMinMs) return false;
  const lastErr = s.lastErrorBySymbol?.[symbol] || 0;
  if (lastErr && now - lastErr < errorMinMs) return false;
  return true;
}

async function maybeAutoFixPendingPicks() {
  const userList = getActiveUsers();
  if (!userList.length) return;
  if (!app.state.security || !app.state.security.autoFix) {
    app.state.security.autoFix = { lastRunAt: 0, lastBySymbol: {}, lastErrorBySymbol: {} };
  }

  const now = Date.now();
  const nowObj = new Date(now);
  const nowJst = getTimePartsByZone(nowObj, "Asia/Tokyo");
  const nowNy = getTimePartsByZone(nowObj, "America/New_York");
  const afterJpPmWindow = nowJst.hour > 15 || (nowJst.hour === 15 && nowJst.minute >= 48);
  const afterUsPmWindow = nowNy.hour > 16 || (nowNy.hour === 16 && nowNy.minute >= 5);
  const afterCryptoPmWindow = nowJst.hour > 12 || (nowJst.hour === 12 && nowJst.minute >= 5);
  const autoFix = app.state.security.autoFix;
  const runMinMs = 2 * 60 * 1000; // 2分に1回まで（APIはさらにスロットル）
  if (autoFix.lastRunAt && now - autoFix.lastRunAt < runMinMs) return;
  autoFix.lastRunAt = now;

  let changed = false;
  const picksBySymbol = new Map(); // symbol -> Array<pick>
  const correctedOrderQueue = []; // entry pending 解消候補の pick

  for (const user of userList) {
    for (const pick of user.picks || []) {
      if (!pick || pick.status === "CLOSED") continue;

      const entryNeeds = Boolean(pick.entryPending || pick.entryPrice == null);
      // sellOrderDate が無い/未確定のときは無視
      const sellNeeds = Boolean(pick.sellPending && pick.sellOrderDate);
      if (!entryNeeds && !sellNeeds) continue;

      // 買付日/約定スロットが「orderedAt」から見てズレている場合、表示と解決ロジックを自己修正
      if (entryNeeds && typeof pick.orderedAt === "string") {
        try {
          const t = new Date(pick.orderedAt);
          if (!Number.isNaN(t.getTime())) {
            const correctedOrderDate = computeEffectiveOrderDate(pick.market, t);
            const correctedOrderSlot = getOrderSlotForMarket(pick.market, t);
            if (pick.orderDate !== correctedOrderDate) {
              pick.orderDate = correctedOrderDate;
              changed = true;
            }
            if (pick.orderSlot !== correctedOrderSlot) {
              pick.orderSlot = correctedOrderSlot;
              changed = true;
            }
          }
        } catch (_) {}
      }

      // 今この時点で約定すべき（= slotPassed）対象だけ解決キューに入れる
      if (entryNeeds) {
        const slotPassed = hasOrderSlotPassed(pick.orderDate, pick.orderSlot, pick.market, nowObj);
        if (slotPassed) correctedOrderQueue.push(pick);
      }
      if (sellNeeds) {
        const slotPassed = hasOrderSlotPassed(pick.sellOrderDate, pick.sellOrderSlot, pick.market, nowObj);
        if (slotPassed) correctedOrderQueue.push(pick);
      }

      // 約定後に latest が entry と同じまま（0%相当）で残っている場合、最新化の候補に入れる
      // （Yahoo 追加アクセスは「約定後の所定時刻」だけ行い、普段は最小限にする）
      if (!entryNeeds && !sellNeeds) {
        const latestMismatch =
          !pick.entryPending &&
          pick.entryPrice != null &&
          pick.latestPrice != null &&
          Math.abs(Number(pick.entryPrice) - Number(pick.latestPrice)) <= 1e-9 &&
          hasOrderSlotPassed(pick.orderDate, pick.orderSlot, pick.market, nowObj);

        if (latestMismatch) {
          if (pick.market === "JP" && pick.orderSlot === "AM" && afterJpPmWindow) correctedOrderQueue.push(pick);
          if (pick.market === "US" && pick.orderSlot === "AM" && afterUsPmWindow) correctedOrderQueue.push(pick);
          if (pick.market === "CRYPTO" && pick.orderSlot === "00" && afterCryptoPmWindow) correctedOrderQueue.push(pick);
        }
      }
    }
  }

  if (!correctedOrderQueue.length) return;

  for (const pick of correctedOrderQueue) {
    if (!picksBySymbol.has(pick.symbol)) picksBySymbol.set(pick.symbol, []);
    picksBySymbol.get(pick.symbol).push(pick);
  }

  // キャッシュで解決できるものは先に解決（Yahooアクセス最小化）
  const symbolsToFetch = [];
  const historyRowsBySymbol = {};

  for (const [symbol, picks] of picksBySymbol.entries()) {
    const cached = app.state.apiCache.history[symbol];
    if (cached?.rows?.length) {
      historyRowsBySymbol[symbol] = cached.rows;
      // 一度キャッシュで解決を試す
      for (const pick of picks) {
        // entry pending
        if (pick.entryPending || pick.entryPrice == null) {
          const entry = resolveFillByOrderDate(historyRowsBySymbol[symbol], pick.orderDate, pick.orderSlot, pick.market);
          const slotPassed = hasOrderSlotPassed(pick.orderDate, pick.orderSlot, pick.market, nowObj);
          const marketClosedNow = isMarketClosedNow(pick.market, nowObj);
          pick.entryPendingReason = entry.pending ? (slotPassed && !(marketClosedNow || pick.market === "CRYPTO") ? (entry.reason || "DATA_WAIT") : "SLOT_WAIT") : "";
          if (!entry.pending && entry.price != null && slotPassed) {
            pick.entryPrice = entry.price;
            pick.entryDate = entry.date;
            pick.entryPending = false;
            pick.entrySettledAt = slotScheduledIso(pick.market, entry.date || pick.orderDate, pick.orderSlot);
            changed = true;
          }
        } else {
          // entry は確定済みだが、過去データ矛盾で価格がズレている可能性を軽量監査
          const slotPassed = hasOrderSlotPassed(pick.orderDate, pick.orderSlot, pick.market, nowObj);
          if (slotPassed && pick.entryPrice != null && pick.orderSlot) {
            const expected = resolveFillByOrderDate(historyRowsBySymbol[symbol], pick.orderDate, pick.orderSlot, pick.market);
            if (!expected.pending && expected.price != null && expected.price !== pick.entryPrice) {
              pick.entryPrice = expected.price;
              pick.entryDate = expected.date;
              pick.entrySettledAt = slotScheduledIso(pick.market, expected.date || pick.orderDate, pick.orderSlot);
              changed = true;
            }
            if (!pick.entrySettledAt) {
              pick.entrySettledAt = slotScheduledIso(pick.market, pick.entryDate || pick.orderDate, pick.orderSlot);
              changed = true;
            }
          }
        }

        const latest = getLatestFromRows(historyRowsBySymbol[symbol]);
        if (latest) {
          pick.latestPrice = latest.price;
          pick.latestDate = latest.date;
          pick.latestResolvedAt = new Date().toISOString();
        }

        // sell pending
        if (pick.sellPending && pick.sellOrderDate) {
          const exit = resolveFillByOrderDate(historyRowsBySymbol[symbol], pick.sellOrderDate, pick.sellOrderSlot, pick.market);
          const sellSlotPassed = hasOrderSlotPassed(pick.sellOrderDate, pick.sellOrderSlot, pick.market, nowObj);
          pick.sellPendingReason = computeSellPendingReasonForDisplay(pick, exit, nowObj);
          if (!exit.pending && exit.price != null && sellSlotPassed) {
            pick.exitPrice = exit.price;
            pick.exitDate = exit.date;
            pick.status = "CLOSED";
            pick.sellPending = false;
            pick.sellSettledAt = slotScheduledIso(pick.market, exit.date || pick.sellOrderDate, pick.sellOrderSlot);
            changed = true;
          }
        }
      }
    }

    // まだ pending が残っているなら、キャッシュが無くても必要なときだけ履歴取得する
    const stillPending =
      picks.some((p) => (p.entryPending || p.entryPrice == null) && p.status !== "CLOSED") ||
      // 確定済み（entryPending=false）でも、約定後なのに 0% 相当（entryPrice と最新価格が一致）が残っているケースを監査する
      picks.some((p) => {
        if (!p || p.status === "CLOSED") return false;
        if (p.market !== "JP" && p.market !== "US" && p.market !== "CRYPTO") return false;
        if (p.market === "CRYPTO" && p.orderSlot !== "00") return false;
        if ((p.market === "JP" || p.market === "US") && p.orderSlot !== "AM") return false;
        if (p.entryPending || p.entryPrice == null) return false;
        if (p.latestPrice == null) return false;
        if (Math.abs(Number(p.entryPrice) - Number(p.latestPrice)) > 1e-9) return false;
        const slotPassed = hasOrderSlotPassed(p.orderDate, p.orderSlot, p.market, nowObj);
        if (!slotPassed) return false;
        // 約定後（最新更新が期待される時間帯）にだけ Yahoo の追加アクセス候補に入れる
        if (p.market === "JP") return afterJpPmWindow;
        if (p.market === "US") return afterUsPmWindow;
        if (p.market === "CRYPTO") return afterCryptoPmWindow;
        return false;
      }) ||
      picks.some((p) => p.sellPending && p.status !== "CLOSED");

    if (stillPending) symbolsToFetch.push(symbol);
  }

  if (!symbolsToFetch.length) {
    if (changed) {
      saveState();
      renderAll();
    }
    return;
  }

  // Yahooアクセスを絞る（1回の実行で最大3銘柄まで）
  const maxFetch = 3;
  const marketLimitFetch = symbolsToFetch.slice(0, maxFetch);
  let fetchedAny = false;

  for (const symbol of marketLimitFetch) {
    // すでにキャッシュ解決できているならスキップ
    const picks = picksBySymbol.get(symbol) || [];
    const stillPending =
      picks.some((p) => (p.entryPending || p.entryPrice == null) && p.status !== "CLOSED") ||
      picks.some((p) => {
        if (!p || p.status === "CLOSED") return false;
        if (p.market !== "JP" && p.market !== "US" && p.market !== "CRYPTO") return false;
        if (p.market === "CRYPTO" && p.orderSlot !== "00") return false;
        if ((p.market === "JP" || p.market === "US") && p.orderSlot !== "AM") return false;
        if (p.entryPending || p.entryPrice == null) return false;
        if (p.latestPrice == null) return false;
        if (Math.abs(Number(p.entryPrice) - Number(p.latestPrice)) > 1e-9) return false;
        const slotPassed = hasOrderSlotPassed(p.orderDate, p.orderSlot, p.market, nowObj);
        if (!slotPassed) return false;
        if (p.market === "JP") return afterJpPmWindow;
        if (p.market === "US") return afterUsPmWindow;
        if (p.market === "CRYPTO") return afterCryptoPmWindow;
        return false;
      }) ||
      picks.some((p) => p.sellPending && p.status !== "CLOSED");
    if (!stillPending) continue;

    const market = pickMarketFromSymbol(symbol);
    // repair のための履歴取得は「最小限アクセス」する（shouldFetchHistoryForAutoFix + maxFetch）
    if (!shouldFetchHistoryForAutoFix(symbol, now)) continue;

    try {
      let forceNow = false;
      if (market === "CRYPTO") {
        forceNow = true;
      } else {
        // 銘柄ごとの Yahoo 許可ウィンドウ外は、キャッシュ更新だけに留める（緊急以外での強制取得を避ける）
        const cacheHasHistory = Boolean(app.state.apiCache.history[symbol]?.rows?.length);
        if (!isYahooAccessAllowed(symbol) && !cacheHasHistory) continue;
        forceNow = isYahooAccessAllowed(symbol);
      }

      await fetchHistory(symbol, forceNow);
      autoFix.lastBySymbol[symbol] = Date.now();
      fetchedAny = true;
      const rows = app.state.apiCache.history[symbol]?.rows;
      if (!rows?.length) continue;
      for (const pick of picks) {
        if (pick.entryPending || pick.entryPrice == null) {
          const entry = resolveFillByOrderDate(rows, pick.orderDate, pick.orderSlot, pick.market);
          const slotPassed = hasOrderSlotPassed(pick.orderDate, pick.orderSlot, pick.market, nowObj);
          const marketClosedNow = isMarketClosedNow(pick.market, nowObj);
          pick.entryPendingReason = entry.pending
            ? (slotPassed && !(marketClosedNow || pick.market === "CRYPTO") ? (entry.reason || "DATA_WAIT") : "SLOT_WAIT")
            : "";
          if (!entry.pending && entry.price != null && slotPassed) {
            pick.entryPrice = entry.price;
            pick.entryDate = entry.date;
            pick.entryPending = false;
            changed = true;
          }
        }
        if (!pick.entrySettledAt && pick.entryPrice != null) {
          const slotPassed = hasOrderSlotPassed(pick.orderDate, pick.orderSlot, pick.market, nowObj);
          if (slotPassed) {
            pick.entrySettledAt = slotScheduledIso(pick.market, pick.entryDate || pick.orderDate, pick.orderSlot);
            changed = true;
          }
        }

        const latest = getLatestFromRows(rows);
        if (latest) {
          pick.latestPrice = latest.price;
          pick.latestDate = latest.date;
          pick.latestResolvedAt = new Date().toISOString();
        }

        if (pick.sellPending && pick.sellOrderDate) {
          const exit = resolveFillByOrderDate(rows, pick.sellOrderDate, pick.sellOrderSlot, pick.market);
          const sellSlotPassed = hasOrderSlotPassed(pick.sellOrderDate, pick.sellOrderSlot, pick.market, nowObj);
          pick.sellPendingReason = computeSellPendingReasonForDisplay(pick, exit, nowObj);
          if (!exit.pending && exit.price != null && sellSlotPassed) {
            pick.exitPrice = exit.price;
            pick.exitDate = exit.date;
            pick.status = "CLOSED";
            pick.sellPending = false;
            changed = true;
          }
        }
      }
    } catch (err) {
      autoFix.lastErrorBySymbol[symbol] = Date.now();
      captureApiFailure(err, symbol, "history");
    }
  }

  if (changed || fetchedAny) {
    for (const u of getActiveUsers()) syncVolatilePickFieldsToLastConfirmed(u);
    saveState();
    renderAll();
  }
}

async function runDailyRankingRefresh() {
  try {
    await rollSeasonIfNeeded();
    // 0:00/12:00 更新は「マイページ(自分)＋ランキング表示」用途。
    // Yahoo への負荷を抑えるため、まずはキャッシュのみで全員分を再計算し、
    // 取得が必要な分だけ（基本は自分のみ）更新する。
    try {
      refreshUsersLatestCacheOnly(getActiveUsers());
    } catch (_) {}

    // Supabase 利用時は他参加者のランキングはサーバー集計を取り込む（Yahoo へは行かない）
    if (getSupabaseCloudConfig()) {
      try {
        await pullPublicRankingSnapshot("scheduled");
      } catch (_) {}
    }

    // 自分の保有銘柄の上昇率は 0:00/12:00 で更新したい（必要最小限の外部取得）
    // ※これが Yahoo を叩く可能性はあるが、全ユーザーではなく「自分のみ」に限定する。
    try {
      await refreshCurrentUserLatest(true);
    } catch (_) {}
    app.state.lastRankUpdateAt = new Date().toISOString();
    app.state.lastDailyRefreshDate = getDateKeyJst(new Date());
    saveState();
    renderAll();
  } catch (err) {
    try {
      refreshUsersLatestCacheOnly(getActiveUsers());
      saveState();
      renderAll();
    } catch (_) {}
    if (typeof showGlobalNotice === "function") {
      showGlobalNotice("0時/12時の自動更新で一時的に取得に失敗しました。「最新の順位を見る」で再取得できます。", true);
    }
  }
}

function getElements() {
  return {
    layoutGrid: byId("layoutGrid"),
    menuRankingBtn: byId("menuRankingBtn"),
    menuLoginBtn: byId("menuLoginBtn"),
    menuRegisterBtn: byId("menuRegisterBtn"),
    menuPickBtn: byId("menuPickBtn"),
    menuCopySyncUrlBtn: byId("menuCopySyncUrlBtn"),
    topLogoutBtn: byId("topLogoutBtn"),
    menuPanelContainer: byId("menuPanelContainer"),
    authCard: byId("authCard"),
    authCardTitle: byId("authCardTitle"),
    authSubmitBtn: byId("authSubmitBtn"),
    switchAuthModeBtn: byId("switchAuthModeBtn"),
    authLoginSecondaryRow: byId("authLoginSecondaryRow"),
    passwordConfirmField: byId("passwordConfirmField"),
    authPasswordConfirm: byId("authPasswordConfirm"),
    authRecoveryField: byId("authRecoveryField"),
    registerCountInfo: byId("registerCountInfo"),
    registerTrialNotice: byId("registerTrialNotice"),
    liveRankCard: byId("liveRankCard"),
    historyCard: byId("historyCard"),
    reportCard: byId("reportCard"),
    ruleCard: byId("ruleCard"),
    seasonLabel: byId("seasonLabel"),
    loginStatusLabel: byId("loginStatusLabel"),
    accountCountLabel: byId("accountCountLabel"),
    globalNotice: byId("globalNotice"),
    authForm: byId("authForm"),
    authName: byId("authName"),
    authNameHintRegister: byId("authNameHintRegister"),
    authPassword: byId("authPassword"),
    authPasswordToggle: byId("authPasswordToggle"),
    authPasswordConfirm: byId("authPasswordConfirm"),
    authPasswordConfirmToggle: byId("authPasswordConfirmToggle"),
    authRecoveryQuestion: byId("authRecoveryQuestion"),
    authRecoveryAnswer: byId("authRecoveryAnswer"),
    authRecoveryAnswerHint: byId("authRecoveryAnswerHint"),
    toggleResetBtn: byId("toggleResetBtn"),
    resetForm: byId("resetForm"),
    resetName: byId("resetName"),
    resetRecoveryQuestion: byId("resetRecoveryQuestion"),
    resetRecoveryAnswer: byId("resetRecoveryAnswer"),
    resetRecoveryAnswerHint: byId("resetRecoveryAnswerHint"),
    resetNewPassword: byId("resetNewPassword"),
    resetNewPasswordToggle: byId("resetNewPasswordToggle"),
    resetBackBtn: byId("resetBackBtn"),
    authMessage: byId("authMessage"),
    accountPanel: byId("accountPanel"),
    currentUserName: byId("currentUserName"),
    monthlyResultBlock: byId("monthlyResultBlock"),
    renameForm: byId("renameForm"),
    renameInput: byId("renameInput"),
    renameFormBlock: byId("renameFormBlock"),
    changePasswordFormBlock: byId("changePasswordFormBlock"),
    toggleRenameBtn: byId("toggleRenameBtn"),
    togglePasswordBtn: byId("togglePasswordBtn"),
    changePasswordForm: byId("changePasswordForm"),
    currentPasswordInput: byId("currentPasswordInput"),
    currentPasswordToggle: byId("currentPasswordToggle"),
    nextPasswordInput: byId("nextPasswordInput"),
    nextPasswordToggle: byId("nextPasswordToggle"),
    nextPasswordConfirmInput: byId("nextPasswordConfirmInput"),
    nextPasswordConfirmToggle: byId("nextPasswordConfirmToggle"),
    logoutBtn: byId("logoutBtn"),
    deleteAccountBtn: byId("deleteAccountBtn"),
    myTradeSummary: byId("myTradeSummary"),
    myTradeBody: byId("myTradeBody"),
    downloadReportBtn: byId("downloadReportBtn"),
    accountMessage: byId("accountMessage"),
    pickPanel: byId("pickPanel"),
    marketType: byId("marketType"),
    symbolInput: byId("symbolInput"),
    symbolSuggestList: byId("symbolSuggestList"),
    symbolHints: byId("symbolHints"),
    previewBtn: byId("previewBtn"),
    chartExternalBtn: byId("chartExternalBtn"),
    addPickBtn: byId("addPickBtn"),
    confirmPicksBtn: byId("confirmPicksBtn"),
    undoPickBtn: byId("undoPickBtn"),
    previewCard: byId("previewCard"),
    previewName: byId("previewName"),
    previewSymbol: byId("previewSymbol"),
    previewPrice: byId("previewPrice"),
    previewAsOf: byId("previewAsOf"),
    symbolForm: byId("symbolForm"),
    pickTableBody: byId("pickTableBody"),
    pickMessage: byId("pickMessage"),
    pickUnconfirmedNotice: byId("pickUnconfirmedNotice"),
    refreshMyPricesBtn: byId("refreshMyPricesBtn"),
    refreshRankBtn: byId("refreshRankBtn"),
    refreshAccountPageBtn: byId("refreshAccountPageBtn"),
    accountLastUpdateLabel: byId("accountLastUpdateLabel"),
    rankLastUpdateLabel: byId("rankLastUpdateLabel"),
    apiDiagBtn: byId("apiDiagBtn"),
    pickConfirmState: byId("pickConfirmState"),
    apiDiagMessage: byId("apiDiagMessage"),
    liveRankBody: byId("liveRankBody"),
    historyMonthSelect: byId("historyMonthSelect"),
    historyTableBody: byId("historyTableBody"),
    historyMeta: byId("historyMeta"),
    reportTableBody: byId("reportTableBody"),
    reportMessage: byId("reportMessage"),
    introModal: byId("introModal"),
    registerConfirmModal: byId("registerConfirmModal"),
    registerConfirmStep: byId("registerConfirmStep"),
    registerRulesStep: byId("registerRulesStep"),
    registerConfirmId: byId("registerConfirmId"),
    registerConfirmQuestion: byId("registerConfirmQuestion"),
    registerConfirmAnswer: byId("registerConfirmAnswer"),
    registerConfirmOkBtn: byId("registerConfirmOkBtn"),
    registerConfirmCancelBtn: byId("registerConfirmCancelBtn"),
    registerRulesOkBtn: byId("registerRulesOkBtn"),
    reportReasonModal: byId("reportReasonModal"),
    rankReportModal: byId("rankReportModal"),
    rankReportTitle: byId("rankReportTitle"),
    rankReportMeta: byId("rankReportMeta"),
    rankReportBody: byId("rankReportBody"),
    rankReportPdfBtn: byId("rankReportPdfBtn")
  };
}

function wireEvents() {
  app.els.menuRankingBtn.addEventListener("click", onMenuRanking);
  app.els.menuLoginBtn.addEventListener("click", onMenuLogin);
  app.els.menuRegisterBtn.addEventListener("click", onMenuRegister);
  app.els.menuPickBtn.addEventListener("click", onMenuPick);
  app.els.topLogoutBtn.addEventListener("click", onLogout);
  if (app.els.menuCopySyncUrlBtn) app.els.menuCopySyncUrlBtn.addEventListener("click", onCopySyncUrlClick);
  app.els.authForm.addEventListener("submit", onAuthSubmit);
  app.els.switchAuthModeBtn.addEventListener("click", onSwitchAuthMode);
  app.els.toggleResetBtn.addEventListener("click", onToggleResetForm);
  app.els.resetForm.addEventListener("submit", onResetPasswordSubmit);
  app.els.resetBackBtn.addEventListener("click", onResetBackClick);
  if (app.els.authPassword && app.els.authPasswordToggle) bindPasswordToggle(app.els.authPassword, app.els.authPasswordToggle);
  if (app.els.authPasswordConfirm && app.els.authPasswordConfirmToggle) bindPasswordToggle(app.els.authPasswordConfirm, app.els.authPasswordConfirmToggle);
  // 再設定回答は常時表示（text）なので目ボタン不要
  if (app.els.currentPasswordInput && app.els.currentPasswordToggle) bindPasswordToggle(app.els.currentPasswordInput, app.els.currentPasswordToggle);
  if (app.els.nextPasswordInput && app.els.nextPasswordToggle) bindPasswordToggle(app.els.nextPasswordInput, app.els.nextPasswordToggle);
  if (app.els.nextPasswordConfirmInput && app.els.nextPasswordConfirmToggle) bindPasswordToggle(app.els.nextPasswordConfirmInput, app.els.nextPasswordConfirmToggle);
  // 再設定回答は常時表示（text）なので目ボタン不要
  if (app.els.resetNewPassword && app.els.resetNewPasswordToggle) bindPasswordToggle(app.els.resetNewPassword, app.els.resetNewPasswordToggle);
  app.els.renameForm.addEventListener("submit", onRenameSubmit);
  app.els.changePasswordForm.addEventListener("submit", onChangePasswordSubmit);
  app.els.logoutBtn.addEventListener("click", onLogout);
  if (app.els.deleteAccountBtn) app.els.deleteAccountBtn.addEventListener("click", onDeleteAccountClick);
  app.els.toggleRenameBtn.addEventListener("click", () => toggleAccountForm("rename"));
  app.els.togglePasswordBtn.addEventListener("click", () => toggleAccountForm("password"));
  app.els.undoPickBtn.addEventListener("click", onUndoPickClick);
  app.els.downloadReportBtn.addEventListener("click", onDownloadReportClick);
  app.els.previewBtn.addEventListener("click", onPreviewClick);
  app.els.chartExternalBtn.addEventListener("click", onChartExternalClick);
  app.els.symbolForm.addEventListener("submit", onAddPickSubmit);
  app.els.confirmPicksBtn.addEventListener("click", onConfirmPicksClick);
  app.els.marketType.addEventListener("change", () => {
    app.addPickBtnJustAdded = false;
    app.symbolSuggestFreezeUntilEdit = false;
    app.symbolSuggestFreezeBaseline = "";
    const mt = app.els.marketType.value;
    if (mt === "JP" || mt === "AUTO") void loadJpCompanyMaster();
    void updateSymbolSuggestions();
    renderAll();
  });
  app.els.symbolInput.addEventListener("input", () => {
    app.addPickBtnJustAdded = false;
    updateActionAvailability();
    onSymbolInputInput();
  });
  app.els.symbolInput.addEventListener("focus", () => {
    void (async () => {
      await loadJpCompanyMaster();
      void updateSymbolSuggestions();
    })();
  });
  app.els.symbolInput.addEventListener("keydown", onSymbolInputKeydown);
  app.els.symbolSuggestList.addEventListener("click", onSymbolSuggestClick);
  if (app.els.authRecoveryQuestion) app.els.authRecoveryQuestion.addEventListener("change", syncRecoveryAnswerHints);
  if (app.els.resetRecoveryQuestion) app.els.resetRecoveryQuestion.addEventListener("change", syncRecoveryAnswerHints);
  syncRecoveryAnswerHints();
  app.els.refreshMyPricesBtn.addEventListener("click", () => {
    void onRefreshMyPrices();
  });
  app.els.refreshRankBtn.addEventListener("click", () => {
    void runWithButtonBusy(app.els.refreshRankBtn, "更新中...", async () => {
      await onRefreshSeason();
    });
  });
  if (app.els.refreshAccountPageBtn) {
    app.els.refreshAccountPageBtn.addEventListener("click", () => {
      void onRefreshFromAccountPage();
    });
  }
  app.els.apiDiagBtn.addEventListener("click", () => {
    void onApiDiagClick();
  });
  app.els.pickTableBody.addEventListener("click", onPickTableAction);
  app.els.reportTableBody.addEventListener("click", onReportTableAction);
  app.els.liveRankBody.addEventListener("click", onLiveRankBodyClick);
  app.els.historyTableBody.addEventListener("click", onLiveRankBodyClick);
  app.els.liveRankBody.addEventListener("contextmenu", onRankRowContextMenu);
  app.els.historyTableBody.addEventListener("contextmenu", onRankRowContextMenu);

  // 「取引内容(details)」の開閉に合わせて、表全体を横スクロールしやすい幅へ切り替える
  // toggle は details の open 状態確定後に発火するので、クリックより確実。
  const onTradeDetailsToggle = (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;
    if (t.tagName !== "DETAILS" || !t.classList.contains("rank-trade-details")) return;
    const table = t.closest("table");
    if (!table) return;
    const anyOpen = Boolean(table.querySelector("details.rank-trade-details[open]"));
    table.classList.toggle("rank-table--trade-expanded", anyOpen);
  };
  app.els.liveRankBody.addEventListener("toggle", onTradeDetailsToggle, true);
  app.els.historyTableBody.addEventListener("toggle", onTradeDetailsToggle, true);

  app.els.historyMonthSelect.addEventListener("change", renderHistoryTable);
  document.addEventListener("click", onDocumentClick);
  window.addEventListener("beforeunload", (e) => {
    if (app.view !== "pick") return;
    const user = getCurrentUser();
    if (!user) return;
    if (hasUncommittedPickChanges(user)) {
      e.preventDefault();
      e.returnValue = "";
    }
  });
  if (app.els.reportReasonModal) {
    app.els.reportReasonModal.addEventListener("click", (e) => {
      const backdrop = e.target.classList.contains("report-reason-backdrop");
      const cancel = e.target.classList.contains("report-reason-cancel");
      if (backdrop || cancel) {
        app.els.reportReasonModal.classList.add("hidden");
        app.els.reportReasonModal.setAttribute("aria-hidden", "true");
        app.pendingReportUserId = null;
        return;
      }
      const btn = e.target.closest("button[data-reason]");
      if (btn instanceof HTMLButtonElement) {
        e.preventDefault();
        e.stopPropagation();
        void runReportReasonClick(btn.getAttribute("data-reason") || "その他");
      }
    });
  }
  document.addEventListener("click", (e) => {
    const btn = e.target && e.target.closest && e.target.closest("#reportReasonModal button[data-reason]");
    if (btn instanceof HTMLButtonElement && app.els.reportReasonModal && !app.els.reportReasonModal.classList.contains("hidden")) {
      e.preventDefault();
      e.stopPropagation();
      void runReportReasonClick(btn.getAttribute("data-reason") || "その他");
    }
  }, true);

  if (app.els.introModal) {
    app.els.introModal.addEventListener("click", (e) => {
      if (e.target.classList.contains("report-reason-backdrop") || e.target.closest(".intro-close-btn")) {
        closeIntroModal();
      }
    });
    const introCloseBtn = document.querySelector("#introModal .intro-close-btn");
    if (introCloseBtn) introCloseBtn.addEventListener("click", closeIntroModal);
  }

  if (app.els.registerConfirmModal) {
    app.els.registerConfirmModal.addEventListener("click", (e) => {
      if (e.target.classList.contains("report-reason-backdrop")) closeRegisterConfirmModal();
    });
    if (app.els.registerConfirmCancelBtn) app.els.registerConfirmCancelBtn.addEventListener("click", closeRegisterConfirmModal);
    if (app.els.registerConfirmOkBtn) app.els.registerConfirmOkBtn.addEventListener("click", onRegisterConfirmOk);
    if (app.els.registerRulesOkBtn) app.els.registerRulesOkBtn.addEventListener("click", onRegisterRulesOk);
  }

  async function runReportReasonClick(reason) {
    const userId = app.pendingReportUserId;
    if (!userId) return;
    try {
      await reportUser(userId, reason);
      showGlobalNotice("通報を記録しました。", false);
      if (app.els.reportReasonModal) {
        app.els.reportReasonModal.classList.add("hidden");
        app.els.reportReasonModal.setAttribute("aria-hidden", "true");
      }
      app.pendingReportUserId = null;
      renderAll();
    } catch (err) {
      showGlobalNotice(err instanceof Error ? err.message : "通報に失敗しました。", true);
    }
  }

  if (app.els.rankReportModal) {
    app.els.rankReportModal.addEventListener("click", (e) => {
      if (e.target.classList.contains("rank-report-backdrop") || e.target.classList.contains("rank-report-close")) {
        closeRankReportModal();
      }
    });
  }
  if (app.els.rankReportPdfBtn) {
    app.els.rankReportPdfBtn.addEventListener("click", onRankReportPdfClick);
  }
}

function renderHintChips() {
  const template = byId("hintChipTemplate");
  app.els.symbolHints.innerHTML = "";
  const label = document.createElement("span");
  label.className = "hint-label";
  label.textContent = "例：";
  app.els.symbolHints.appendChild(label);
  const items = pickRandomHintSymbols();
  for (const item of items) {
    const chip = template.content.firstElementChild.cloneNode(true);
    let displayName;
    let symbolToInput;
    let hintMarket = "";
    if (typeof item === "string") {
      symbolToInput = item;
      displayName = getHintChipDisplayName(item);
    } else {
      displayName = item.name;
      symbolToInput = item.symbol;
      hintMarket = item.hintMarket || "";
    }
    chip.textContent = displayName;
    chip.addEventListener("click", () => {
      app.symbolSuggestFreezeUntilEdit = false;
      app.symbolSuggestFreezeBaseline = "";
      app.els.symbolInput.value = symbolToInput;
      if (hintMarket === "JP" || hintMarket === "US" || hintMarket === "CRYPTO") {
        app.els.marketType.value = hintMarket;
      }
      app.els.symbolInput.dispatchEvent(new Event("input", { bubbles: true }));
      app.els.symbolInput.focus();
    });
    app.els.symbolHints.appendChild(chip);
  }
}

function getHintChipDisplayName(symbol) {
  const pools = [QUICK_HINT_POOL_JP, QUICK_HINT_POOL_US, QUICK_HINT_POOL_CRYPTO];
  for (const pool of pools) {
    const found = pool.find((p) => p.symbol === symbol || p.symbol === symbol + ".T" || p.symbol === symbol + "-USD");
    if (found) return found.name;
  }
  return symbolPresetMap.get(symbol)?.name || symbolPresetMap.get(symbol + ".T")?.name || symbolPresetMap.get(symbol + "-USD")?.name || symbol;
}

function onMenuRanking() {
  if (!confirmLeavePickView("ranking")) return;
  setCurrentView("ranking");
  renderAll();
}

function onMenuLogin() {
  const loggedIn = Boolean(getCurrentUser());
  if (!confirmLeavePickView(loggedIn ? "mypage" : "auth")) return;
  if (loggedIn) {
    setCurrentView("mypage");
    renderAll();
    return;
  }
  clearMessage(app.els.authMessage);
  syncAuthMode("login");
  setCurrentView("auth");
  renderAll();
}

function onMenuRegister() {
  if (!confirmLeavePickView("auth")) return;
  if (getCurrentUser()) return;
  clearMessage(app.els.authMessage);
  syncAuthMode("register");
  setCurrentView("auth");
  renderAll();
  void refreshCloudAccountRegistrationStats();
}

function onMenuPick() {
  const nextView = getCurrentUser() ? "pick" : "auth";
  if (!confirmLeavePickView(nextView)) return;
  if (!getCurrentUser()) {
    syncAuthMode("login");
    setCurrentView("auth");
    setMessage(app.els.authMessage, "銘柄を選ぶには、まずはじめる（ログイン）してください。", true);
    renderAll();
    return;
  }
  setCurrentView("pick");
  capturePickDraft(getCurrentUser());
  renderHintChips();
  renderAll();
}

function clonePicksForDraft(picks) {
  return (picks || []).map((p) => ({ ...p }));
}

/**
 * 銘柄一覧の「実質的な内容」が同じか（価格の揺らぎ・理由文言の差は除く）。
 * 触って元に戻した場合は最後に確定した状態と一致し、未確定扱いにしない。
 */
function buildPicksStructuralHash(picks) {
  const arr = (picks || []).slice().sort((a, b) => String(a.id).localeCompare(String(b.id)));
  return JSON.stringify(
    arr.map((p) => [
      p.id,
      p.symbol,
      p.market,
      p.status,
      p.orderDate,
      p.orderSlot,
      p.entryPrice,
      p.entryDate,
      p.entryPending ? 1 : 0,
      p.sellPending ? 1 : 0,
      p.sellOrderDate,
      p.sellOrderSlot,
      p.exitPrice,
      p.exitDate
    ])
  );
}

/** 未確定の編集中か（現在の picks が最後に確定した内容と実質一致しないときのみ true） */
function hasUncommittedPickChanges(user) {
  if (!user) return false;
  return buildPicksStructuralHash(user.picks) !== buildPicksStructuralHash(user.picksLastConfirmed);
}

/** picks が確定スナップショットと実質一致したら needsPickConfirm / pickListModified を下ろす */
function syncPickConfirmFlagsIfPicksMatchLastConfirmed(user) {
  if (!user) return;
  if (buildPicksStructuralHash(user.picks) !== buildPicksStructuralHash(user.picksLastConfirmed)) return;
  if (!user.needsPickConfirm && !user.pickListModified) return;
  user.needsPickConfirm = false;
  user.pickListModified = false;
  user.updatedAt = new Date().toISOString();
  saveState();
}

/**
 * ランキング・月次スコア表示用: 未確定のときは最後に「銘柄を確定」した時点の銘柄一覧。
 * 銘柄追加画面の編集中リスト user.picks とは別。
 */
function getPicksForRankingSnapshot(user) {
  if (!user) return [];
  if (hasUncommittedPickChanges(user) && Array.isArray(user.picksLastConfirmed)) {
    return user.picksLastConfirmed;
  }
  return user.picks || [];
}

/** 同一 id の銘柄について、確定スナップショットへ最新価格・約定進捗（売却状態は除く）を反映 */
const PICK_VOLATILE_SYNC_KEYS = [
  "latestPrice",
  "latestDate",
  "latestResolvedAt",
  "displayName",
  "entryPrice",
  "entryDate",
  "entryPending",
  "entryPendingReason",
  "entrySettledAt"
];

function syncVolatilePickFieldsToLastConfirmed(user) {
  if (!user?.picksLastConfirmed?.length || !(user.picks || []).length) return;
  const byId = new Map((user.picks || []).map((p) => [p.id, p]));
  for (const snap of user.picksLastConfirmed) {
    const live = byId.get(snap.id);
    if (!live || live.symbol !== snap.symbol) continue;
    for (const k of PICK_VOLATILE_SYNC_KEYS) {
      if (live[k] !== undefined) snap[k] = live[k];
    }
  }
}

function buildPickDraftHash(picks) {
  return JSON.stringify((picks || []).map((p) => [
    p.id, p.symbol, p.market, p.status, p.orderDate, p.entryPrice, p.entryDate,
    p.latestPrice, p.latestDate, p.sellPending, p.sellOrderDate, p.exitPrice, p.exitDate
  ]));
}

function capturePickDraft(user) {
  if (!user?.id) return;
  app.pickDraftByUser.set(user.id, {
    picks: clonePicksForDraft(user.picksLastConfirmed || []),
    needsPickConfirm: false,
    hash: buildPickDraftHash(user.picks || [])
  });
}

function isPickDraftDirty(user) {
  if (!user?.id) return false;
  const draft = app.pickDraftByUser.get(user.id);
  if (!draft) return false;
  return draft.hash !== buildPickDraftHash(user.picks || []);
}

/** 最後に「銘柄を確定」した時点の picks に戻す（移動・未確定キャンセル用） */
function discardPickDraft(user) {
  if (!user?.id) return;
  user.picks = clonePicksForDraft(user.picksLastConfirmed || []);
  user.needsPickConfirm = false;
  user.pickListModified = false;
  user.updatedAt = new Date().toISOString();
  saveState();
}

function confirmLeavePickView(nextView) {
  if (app.view !== "pick" || nextView === "pick") return true;
  const user = getCurrentUser();
  if (!user) return true;
  if (!hasUncommittedPickChanges(user)) return true;

  const ok = confirm(
    "銘柄が確定されておりません。変更内容は削除されます。\n\n移動しますか？\n（OK＝移動する／キャンセル＝とどまる）"
  );
  if (!ok) {
    setMessage(app.els.pickMessage, "銘柄の確定をしてから移動するか、キャンセルでこの画面に残ります。", true);
    return false;
  }
  discardPickDraft(user);
  showGlobalNotice("未確定の変更を破棄しました。", false);
  return true;
}

function setCurrentView(view) {
  const safe = ["ranking", "auth", "mypage", "pick", "history"].includes(view) ? view : "ranking";
  app.view = safe;
}

function syncAuthMode(mode) {
  const safe = mode === "register" || mode === "reset" ? mode : "login";
  app.authMode = safe;
  const isReset = safe === "reset";
  const isRegister = safe === "register";
  app.els.authCardTitle.textContent = isReset
    ? "パスワードを忘れたとき"
    : (isRegister ? "新規登録" : "ログイン");
  app.els.authForm.classList.toggle("hidden", isReset);
  app.els.resetForm.classList.toggle("hidden", !isReset);
  app.els.passwordConfirmField.classList.toggle("hidden", !isRegister);
  app.els.authRecoveryField.classList.toggle("hidden", !isRegister);
  if (app.els.registerTrialNotice) app.els.registerTrialNotice.classList.toggle("hidden", !isRegister);
  app.els.registerCountInfo.classList.toggle("hidden", !isRegister);
  if (app.els.authNameHintRegister) {
    app.els.authNameHintRegister.classList.toggle("hidden", !isRegister || isReset);
  }
  app.els.authSubmitBtn.textContent = isRegister ? "新規作成" : "ログイン";
  app.els.switchAuthModeBtn.textContent = isRegister ? "ログインへ" : "新規登録へ";
  if (app.els.authLoginSecondaryRow) {
    app.els.authLoginSecondaryRow.classList.toggle("hidden", isReset || isRegister);
  }
  if (isRegister && app.els.authRecoveryQuestion) {
    app.els.authRecoveryQuestion.value = "BIRTH_CITY";
    syncRecoveryAnswerHints();
  }
  app.els.authPasswordConfirm.required = isRegister;
  if (app.els.authRecoveryQuestion) app.els.authRecoveryQuestion.required = isRegister;
  if (app.els.authRecoveryAnswer) app.els.authRecoveryAnswer.required = isRegister;
  if (!isRegister) {
    app.els.authPasswordConfirm.value = "";
    if (app.els.authRecoveryAnswer) app.els.authRecoveryAnswer.value = "";
  }
}

function applyCurrentView() {
  const user = getCurrentUser();
  let view = app.view || "ranking";
  if ((view === "pick" || view === "mypage") && !user) view = "auth";
  app.view = view;

  const showAuthCard = view === "auth";
  const showAccountCard = view === "mypage";
  const showPickPanel = view === "pick";
  const showLeft = showAuthCard || showAccountCard || showPickPanel;
  const showRankingArea = view === "ranking";

  app.els.menuPanelContainer.classList.toggle("hidden", !showLeft);
  app.els.layoutGrid.classList.toggle("with-left", showLeft && showRankingArea);

  app.els.authCard.classList.toggle("hidden", !showAuthCard);
  app.els.accountPanel.classList.toggle("hidden", !showAccountCard);
  if (showAccountCard && app.els.accountMessage.classList.contains("error")) clearMessage(app.els.accountMessage);
  app.els.pickPanel.classList.toggle("hidden", !showPickPanel);

  app.els.liveRankCard.classList.toggle("hidden", !showRankingArea);
  app.els.historyCard.classList.toggle("hidden", !showRankingArea);
  app.els.reportCard.classList.add("hidden");
  app.els.ruleCard.classList.toggle("hidden", !showRankingArea);

  const activeByView = {
    ranking: app.els.menuRankingBtn,
    auth: app.authMode === "register" ? app.els.menuRegisterBtn : app.els.menuLoginBtn,
    mypage: app.els.menuLoginBtn,
    pick: app.els.menuPickBtn
  };
  const activeBtn = activeByView[view] || app.els.menuRankingBtn;
  [
    app.els.menuRankingBtn,
    app.els.menuLoginBtn,
    app.els.menuRegisterBtn,
    app.els.menuPickBtn
  ].forEach((btn) => btn.classList.toggle("active", btn === activeBtn));
}

function renderAll() {
  const now = new Date();
  const season = getSeasonKeyJst(now);
  const user = getCurrentUser();
  const loggedIn = Boolean(user);
  if (user) syncPickConfirmFlagsIfPicksMatchLastConfirmed(user);

  app.els.seasonLabel.textContent = formatSeasonLabel(season);
  app.els.loginStatusLabel.textContent = user ? `ログイン中: ${getDisplayName(user)}` : "未ログイン";
  app.els.loginStatusLabel.classList.toggle("login-state-in", loggedIn);
  app.els.loginStatusLabel.classList.toggle("login-state-out", !loggedIn);
  app.els.topLogoutBtn.classList.toggle("hidden", !loggedIn);
  updateAccountCountLabel();
  syncAuthMode(app.authMode);

  renderAuthPanels();
  renderPickTable();
  renderPickConfirmState();
  renderApiDiagMessage();
  renderMyTradeReport();
  renderLiveRanking();
  renderHistorySelect();
  renderHistoryTable();
  syncRankTableMenuColumnVisibility();
  if (app.els.rankLastUpdateLabel) {
    const at = app.state.lastRankUpdateAt;
    const d = app.state.lastDailyRefreshDate;
    if (at) {
      try {
        app.els.rankLastUpdateLabel.textContent = `最終更新: ${formatDateTimeJst(at)}`;
      } catch (_) {
        app.els.rankLastUpdateLabel.textContent = d ? `最終更新: ${d.slice(0, 4)}年${Number(d.slice(5, 7))}月${Number(d.slice(8, 10))}日` : "";
      }
    } else {
      app.els.rankLastUpdateLabel.textContent = d
        ? `最終更新: ${d.slice(0, 4)}年${Number(d.slice(5, 7))}月${Number(d.slice(8, 10))}日`
        : "";
    }
  }
  updateActionAvailability();
  applyCurrentView();
}

function syncRankTableMenuColumnVisibility() {
  const on = Boolean(getCurrentUser());
  const t1 = document.getElementById("liveRankTable");
  const t2 = document.getElementById("historyTable");
  if (t1) t1.classList.toggle("rank-menu-visible", on);
  if (t2) t2.classList.toggle("rank-menu-visible", on);
}

function renderAuthPanels() {
  const user = getCurrentUser();
  if (user) {
    app.els.currentUserName.textContent = getDisplayName(user);
    app.els.renameInput.value = user.name;
    renderMonthlyResult(user);
  } else {
    app.els.currentUserName.textContent = "-";
    app.els.renameInput.value = "";
    const block = app.els.monthlyResultBlock;
    if (block) block.innerHTML = "";
  }
  const label = app.els.accountLastUpdateLabel;
  if (label) {
    const at = app.state.lastRankUpdateAt;
    const dateKey = app.state.lastDailyRefreshDate;
    if (at) {
      const ms = Date.parse(at);
      label.textContent = Number.isFinite(ms) ? `最終更新: ${formatDateTimeJst(ms)}` : `最終更新: ${at}`;
    } else if (dateKey) {
      const [y, m, d] = dateKey.split("-");
      label.textContent = y && m && d ? `最終更新: ${y}年${Number(m)}月${Number(d)}日` : `最終更新: ${dateKey}`;
    } else {
      label.textContent = "";
    }
  }
}

function renderMonthlyResult(user) {
  const block = app.els.monthlyResultBlock;
  if (!block) return;
  const season = app.state.currentSeason || getSeasonKeyJst(new Date());
  const score = calcUserScore(user, "latest", season);
  if (!score) {
    const noneInner =
      CONFIG.minPicks > 0
        ? `<span class="monthly-result-line1">対象銘柄が不足しています</span><span class="monthly-result-line2">（${CONFIG.minPicks}銘柄以上で確定が必要です）</span>`
        : "銘柄を追加するとリターンが算出されます。0銘柄のままでも確定できます。";
    block.innerHTML = `<p class="monthly-result-label">今月のリターン</p><p class="monthly-result-value monthly-result-none">${noneInner}</p>`;
    return;
  }
  const pctClass = score.returnPct > 0 ? "pct-up" : score.returnPct < 0 ? "pct-down" : "pct-flat";
  block.innerHTML = `
    <p class="monthly-result-label">今月のリターン</p>
    <p class="monthly-result-value ${pctClass}">${formatPct(score.returnPct)}</p>
    <p class="monthly-result-meta">${score.validPickCount}銘柄で算出</p>`;
}

function renderPickTable() {
  const user = getCurrentUser();
  const body = app.els.pickTableBody;
  body.innerHTML = "";

  if (!user) {
    body.innerHTML = `<tr class="pick-table-empty"><td colspan="6" data-label="">はじめるか、銘柄を選ぶか、ランキングを表示してください。</td></tr>`;
    return;
  }

  const picks = user.picks || [];
  const openPicks = picks.filter((p) => p.status !== "CLOSED");
  if (!openPicks.length && !picks.length) {
    body.innerHTML = `<tr class="pick-table-empty"><td colspan="6" data-label="">銘柄を追加するか、${CONFIG.minPicks}〜${CONFIG.maxPicks}銘柄で確定してください。</td></tr>`;
    return;
  }
  if (!openPicks.length) {
    body.innerHTML = `<tr class="pick-table-empty"><td colspan="6" data-label="">今月の保有銘柄はありません。銘柄を追加してください。</td></tr>`;
    return;
  }

  for (const pick of openPicks) {
    const tr = document.createElement("tr");
    tr.classList.add("pick-row");

    const pct = computePickPct(pick);
    const pctClass = pct == null ? "pct-flat" : pct > 0 ? "pct-up" : pct < 0 ? "pct-down" : "pct-flat";
    const statusHtml = formatPickStatusCellHtml(pick);
    const statusClass = pick.status === "CLOSED"
      ? "status-closed"
      : pick.sellPending
        ? "status-sell-wait"
        : pick.entryPending
          ? "status-entry-wait"
          : "status-holding";
    const entryText =
      pick.entryPrice != null
        ? formatPriceDateStackHtml(pick.entryPrice, pick.market, pick.entryDate, null)
        : escapeHtml("約定待ち");
    const latestRefPrice = pick.status === "CLOSED" ? pick.exitPrice : pick.latestPrice;
    const latestRefDate = pick.status === "CLOSED" ? pick.exitDate : pick.latestDate;
    const latestText =
      latestRefPrice != null
        ? formatPriceDateStackHtml(latestRefPrice, pick.market, latestRefDate, null)
        : `<span class="price-line-primary">-</span>`;
    const canSell = !pick.entryPending && pick.status !== "CLOSED";
    // 売却予約中は削除不可（取消は「売却取消」のみ。未約定買いのみ削除可）
    // 「約定しているのに entryPending が残る」などの矛盾があっても削除できないようにする
    const canRemove = Boolean(pick.entryPending && pick.entryPrice == null && !pick.sellPending && pick.status !== "CLOSED");
    const pickIdSafe = escapeHtml(pick.id);
    const sellBtn = pick.sellPending
      ? `<button class="tiny-btn" data-action="cancelSell" data-pick-id="${pickIdSafe}" type="button">売却取消</button>`
      : `<button class="tiny-btn" data-action="sell" data-pick-id="${pickIdSafe}" type="button" ${canSell ? "" : "disabled"}>売却</button>`;
    const removeBtn = canRemove
      ? `<button class="tiny-btn" data-action="remove" data-pick-id="${pickIdSafe}" type="button">削除</button>`
      : "";

    const symEsc = escapeHtml(pick.symbol || "");
    const mktEsc = escapeHtml(marketLabel(pick.market));
    tr.innerHTML = `
      <td data-label="銘柄">${escapeHtml(resolvePickDisplayName(pick))}<br><small class="pick-symbol-line"><span class="pick-symbol-code">${symEsc}</span><span class="pick-market-inline"> ${mktEsc}</span></small></td>
      <td data-label="状態" class="${statusClass}">${statusHtml}</td>
      <td data-label="約定値" class="price-cell-num">${entryText}</td>
      <td data-label="現在の株価" class="price-cell-num">${latestText}</td>
      <td data-label="騰落率" class="${pctClass}">${pct == null ? "-" : formatPct(pct)}</td>
      <td data-label="操作" class="pick-action-cell">
        ${sellBtn}
        ${removeBtn}
      </td>
    `;
    body.appendChild(tr);
  }
}

function renderPickConfirmState() {
  const user = getCurrentUser();
  if (!user) {
    app.els.pickConfirmState.textContent = "";
    return;
  }

  if (user.needsPickConfirm) {
    app.els.pickConfirmState.textContent = "銘柄が未確定です。移動前に「銘柄の確定」を押してください。";
    return;
  }

  const openPicks = (user.picks || []).filter((p) => p.status !== "CLOSED");
  const pendingCount = openPicks.filter((p) => p.entryPending).length;
  if (pendingCount > 0) {
    app.els.pickConfirmState.textContent = `買い注文中: ${pendingCount}銘柄が約定待ちです。`;
    return;
  }

  if (user.lastPickConfirmAt) {
    app.els.pickConfirmState.textContent = `最終確定: ${formatDateTimeJst(user.lastPickConfirmAt)}`;
    return;
  }

  app.els.pickConfirmState.textContent = "銘柄を追加したら「銘柄の確定」を押してください。";
}

function renderApiDiagMessage() {
  const box = app.els.apiDiagMessage;
  if (!(box instanceof HTMLElement)) return;
  box.classList.remove("error", "success");

  if (!app.lastApiFailure) {
    box.classList.remove("hidden");
    box.classList.add("success");
    box.textContent = "通信: 正常";
    return;
  }

  const text = formatApiFailureDetails(app.lastApiFailure);
  if (!text) {
    box.classList.add("hidden");
    box.textContent = "";
    return;
  }
  box.classList.remove("hidden");
  box.classList.add("error");
  box.textContent = text;
}

function pickStatusLabel(pick) {
  if (pick.status === "CLOSED") return "売却済";
  if (pick.sellPending) {
    const reason = pick.sellPendingReason ? `（${getPendingReasonLabel(pick.sellPendingReason)}）` : "";
    return "売り注文中" + reason;
  }
  if (pick.entryPending) {
    const reason = pick.entryPendingReason ? `（${getPendingReasonLabel(pick.entryPendingReason)}）` : "";
    return "買い注文中" + reason;
  }
  return "保有中";
}

/** 価格＋日付を2行に分け、狭い幅でも … に切らない（銘柄選択・マイ取引） */
function formatPriceDateStackHtml(price, market, date, pendingLabel) {
  if (price == null) {
    const pl = pendingLabel != null && pendingLabel !== "" ? String(pendingLabel) : "";
    return pl ? escapeHtml(pl) : `<span class="price-line-primary">-</span>`;
  }
  const p = formatPrice(price, market);
  const d = date != null && String(date).trim() && String(date).trim() !== "-" ? String(date).trim() : "";
  const primary = `<span class="price-line-primary">${escapeHtml(p)}</span>`;
  if (!d) return primary;
  return `${primary}<br><span class="price-line-date">(${escapeHtml(d)})</span>`;
}

/** 状態セル: 「買い注文中」と「（市場時間待ち）」を改行（銘柄選択・マイ取引） */
function formatPickStatusCellHtml(pick) {
  const longNote =
    pick.entryPending && isLongPending(pick.orderDate)
      ? ' <small class="section-note">（3日以上未約定）</small>'
      : pick.sellPending && pick.sellOrderDate && isLongPending(pick.sellOrderDate)
        ? ' <small class="section-note">（3日以上未約定）</small>'
        : "";
  if (pick.status === "CLOSED") {
    return escapeHtml("売却済") + longNote;
  }
  if (pick.sellPending) {
    const reason = pick.sellPendingReason ? getPendingReasonLabel(pick.sellPendingReason) : "";
    const main = escapeHtml("売り注文中");
    const sub = reason
      ? `<br><span class="status-reason-line">（${escapeHtml(reason)}）</span>`
      : "";
    return `<span class="status-stack">${main}${sub}</span>${longNote}`;
  }
  if (pick.entryPending) {
    const reason = pick.entryPendingReason ? getPendingReasonLabel(pick.entryPendingReason) : "";
    const main = escapeHtml("買い注文中");
    const sub = reason
      ? `<br><span class="status-reason-line">（${escapeHtml(reason)}）</span>`
      : "";
    return `<span class="status-stack">${main}${sub}</span>${longNote}`;
  }
  return escapeHtml("保有中") + longNote;
}

function renderMyTradeReport() {
  const user = getCurrentUser();
  const body = app.els.myTradeBody;
  body.innerHTML = "";

  if (!user) {
    app.els.myTradeSummary.textContent = "取引レポートを見るにはログインしてください。";
    body.innerHTML = `<tr class="rank-table-empty"><td colspan="6" data-label="">ログインが必要です</td></tr>`;
    app.els.downloadReportBtn.disabled = true;
    return;
  }

  const picks = [...(user.picks || [])].sort((a, b) => String(b.orderedAt || "").localeCompare(String(a.orderedAt || "")));
  if (!picks.length) {
    app.els.myTradeSummary.textContent = "まだ取引がありません。";
    body.innerHTML = `<tr class="rank-table-empty"><td colspan="6" data-label="">取引データがありません</td></tr>`;
    app.els.downloadReportBtn.disabled = true;
    return;
  }

  const closedCount = picks.filter((p) => p.status === "CLOSED").length;
  const openCount = picks.length - closedCount;
  app.els.myTradeSummary.textContent = `合計 ${picks.length} 件 / 保有中 ${openCount} / 売却済 ${closedCount}`;

  for (const pick of picks) {
    const pct = computePickPct(pick);
    const pctClass = pct == null ? "pct-flat" : pct > 0 ? "pct-up" : pct < 0 ? "pct-down" : "pct-flat";
    const statusOrSellDateHtml =
      pick.status === "CLOSED"
        ? escapeHtml(pick.exitDate || "-")
        : formatPickStatusCellHtml(pick);
    const entryPriceText = pick.entryPrice != null ? formatPrice(pick.entryPrice, pick.market) : "約定待ち";
    const currentOrExitPriceHtml =
      pick.status === "CLOSED"
        ? (pick.exitPrice != null
          ? formatPriceDateStackHtml(pick.exitPrice, pick.market, pick.exitDate, null)
          : `<span class="price-line-primary">-</span>`)
        : (pick.latestPrice != null
          ? formatPriceDateStackHtml(pick.latestPrice, pick.market, pick.latestDate, null)
          : `<span class="price-line-primary">-</span>`);
    const symbolDisplayName = resolvePickDisplayName(pick);
    const symEsc = escapeHtml(pick.symbol || "");
    const mktEsc = escapeHtml(marketLabel(pick.market));
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="my-report-symbol-cell" data-label="銘柄"><span class="my-report-symbol-name" title="${escapeHtml(symbolDisplayName)}">${escapeHtml(symbolDisplayName)}</span><small class="pick-symbol-line"><span class="pick-symbol-code">${symEsc}</span><span class="pick-market-inline"> ${mktEsc}</span></small></td>
      <td data-label="買付日">${escapeHtml(pick.entryDate || pick.orderDate || "-")}</td>
      <td class="price-cell-num my-report-price-num" data-label="取得単価">${escapeHtml(entryPriceText)}</td>
      <td class="price-cell-num my-report-price-num" data-label="現在・売却価格">${currentOrExitPriceHtml}</td>
      <td data-label="状態／売却日">${statusOrSellDateHtml}</td>
      <td class="${pctClass}" data-label="損益">${pct == null ? "-" : formatPct(pct)}</td>
    `;
    body.appendChild(tr);
  }

  app.els.downloadReportBtn.disabled = false;
}

function getTop10TitleEmoji(rank) {
  switch (rank) {
    case 1: return "👑";
    case 2: return "🥈";
    case 3: return "🥉";
    case 4: return "💎";
    case 5: return "⭐";
    case 6: return "🔥";
    case 7: return "🎯";
    case 8: return "🛡️";
    case 9: return "🧠";
    case 10: return "🌱";
    default: return "";
  }
}

function renderRankBadge(rank) {
  const emoji = getTop10TitleEmoji(rank);
  if (!emoji) return "";
  if (rank === 1) return `<span class="rank-badge rank-badge--gold" aria-label="1位">${emoji}</span>`;
  if (rank === 2) return `<span class="rank-badge rank-badge--silver" aria-label="2位">${emoji}</span>`;
  if (rank === 3) return `<span class="rank-badge rank-badge--bronze" aria-label="3位">${emoji}</span>`;
  return `<span class="rank-title" aria-label="${rank}位">${emoji}</span>`;
}

function buildLiveRankingSnapshotKey(ranking, season, currentUser) {
  const reports = app.state.reports || [];
  const lines = ranking.map((r) => {
    const hasReportedByMe =
      Boolean(currentUser) &&
      reports.some((rep) => rep.season === season && rep.targetUserId === r.userId && rep.reporterId === currentUser.id);
    const trades = r.trades || [];
    const tradeSig = trades.map((t) => `${String(t.symbol ?? "")}:${String(t.returnPct)}`).join("|");
    return [
      r.userId,
      String(r.returnPct),
      String(r.displayName ?? ""),
      String(r.symbolsHtml ?? r.symbolsText ?? ""),
      r.isAnonymized ? "1" : "0",
      hasReportedByMe ? "1" : "0",
      tradeSig,
      r.note || "",
      r.pendingOrderCount != null ? String(r.pendingOrderCount) : ""
    ].join("\x1e");
  });
  return `LRv9|${season}|m${currentUser ? "1" : "0"}\n${lines.join("\n")}`;
}

/** アカウント表示名の文字数（ID は最大8文字・絵文字等は 1 字として数える） */
function getAccountNameDisplayLen(text) {
  const s = String(text ?? "").trim();
  if (!s || s === "-") return 0;
  return [...s].length;
}

/** 2〜6文字は大きめ、7〜8文字は枠に収まりやすいよう段階的に小さく */
function rankAccountCellLenClass(displayName) {
  const len = getAccountNameDisplayLen(displayName);
  if (len >= 8) return "rank-account-cell--n8";
  if (len >= 7) return "rank-account-cell--n7";
  return "rank-account-cell--n6";
}

/** 通報匿名時: 1行目「通報で匿名表示」、2行目に動物名（表示名） */
function renderAnonymousRankLabel(displayName, history) {
  const d = escapeHtml(String(displayName || "-"));
  const line1 = history ? "通報で匿名表示（履歴）" : "通報で匿名表示";
  return `<span class="tag-muted tag-muted--stacked"><span class="tag-muted__line1">${line1}</span><span class="tag-muted__line2">${d}</span></span>`;
}

/** ログイン時のみ詳細・通報・⋮ を表示（未ログインは空セル＋CSSで列ごと非表示） */
function renderRankMenuCell(row, seasonKey, currentUser) {
  if (!row.userId) return `<td class="col-menu" data-label=""></td>`;
  if (!currentUser) return `<td class="col-menu" data-label=""></td>`;
  const hasReportedByMe = (app.state.reports || []).some(
    (r) => r.season === seasonKey && r.targetUserId === row.userId && r.reporterId === currentUser.id
  );
  const reportBtnClass = "rank-menu-report-btn hidden" + (hasReportedByMe ? " rank-menu-report-btn-hidden" : "");
  const unreportBtnClass = "rank-menu-unreport-btn hidden" + (!hasReportedByMe ? " rank-menu-report-btn-hidden" : "");
  return `<td class="col-menu" data-label="操作"><span class="rank-menu-wrap"><button type="button" class="rank-menu-trigger" data-user-id="${escapeHtml(row.userId)}" aria-label="メニューを開く">\u22EE</button><div class="rank-menu-panel hidden"><button type="button" class="rank-menu-detail-btn" data-action="open-rank-report">詳細</button><button type="button" class="${reportBtnClass}" data-action="report-rank" data-user-id="${escapeHtml(row.userId)}">通報する</button><button type="button" class="${unreportBtnClass}" data-action="unreport-rank" data-user-id="${escapeHtml(row.userId)}">通報を解除</button></div></span></td>`;
}

function renderLiveRanking() {
  const body = app.els.liveRankBody;
  const ranking = buildLiveRanking();
  const season = app.state.currentSeason || getSeasonKeyJst(new Date());
  const currentUser = getCurrentUser();

  if (!ranking.length) {
    const emptyHtml = `<tr class="rank-table-empty"><td colspan="6" data-label="">ランキングデータがありません。</td></tr>`;
    if (app._lastLiveRankKey === "__empty__" && body.querySelector("tr.rank-table-empty")) {
      return;
    }
    body.innerHTML = emptyHtml;
    app._lastLiveRankKey = "__empty__";
    return;
  }

  const snapKey = buildLiveRankingSnapshotKey(ranking, season, currentUser);
  if (snapKey === app._lastLiveRankKey && body.querySelector("tr.rank-row")) {
    return;
  }
  app._lastLiveRankKey = snapKey;

  body.innerHTML = "";
  let scoreRank = 0;
  ranking.forEach((row, idx) => {
    const tr = document.createElement("tr");
    tr.classList.add("rank-row");
    const hasScore = row.returnPct != null;
    const ranked = Boolean(hasScore);
    if (ranked) scoreRank += 1;
    const displayRank = ranked ? scoreRank : null;
    if (displayRank && displayRank <= 5) tr.classList.add(`rank-top-${displayRank}`);
    const pctClass = !hasScore ? "pct-flat" : row.returnPct > 0 ? "pct-up" : row.returnPct < 0 ? "pct-down" : "pct-flat";
    const pctText = !hasScore ? "-" : formatPct(row.returnPct);
    const accountHtml = row.isAnonymized
      ? renderAnonymousRankLabel(row.displayName, false)
      : escapeHtml(row.displayName);
    const tradesCell = row.trades.length
      ? renderTradeDetails(row.trades)
      : row.pendingOrderCount != null && row.pendingOrderCount > 0
        ? `<span class="rank-note rank-note--stacked"><span class="rank-note__line1">注文中</span><span class="rank-note__line2">${escapeHtml(`（${row.pendingOrderCount}銘柄が約定待ち）`)}</span></span>`
        : `<span class="rank-note">${escapeHtml(row.note || "未取引・未確定")}</span>`;
    const menuCell = renderRankMenuCell(row, season, currentUser);
    const rankBadge = displayRank ? renderRankBadge(displayRank) : "";
    const accountLenClass = rankAccountCellLenClass(row.displayName);
    tr.innerHTML = `
      <td class="rank-td" data-label="順位"><span class="rank-no">${rankBadge}<span class="rank-num">${displayRank ? displayRank : "-"}</span></span></td>
      <td class="rank-account-cell ${accountLenClass}${row.isAnonymized ? " rank-account-cell--anon" : ""}" data-label="アカウント名"><span class="rank-account-cell__inner">${accountHtml}</span></td>
      <td class="${pctClass}" data-label="上昇率"><span class="rank-pct-cell__inner">${pctText}</span></td>
      <td class="rank-symbols-cell" data-label="保有銘柄">${row.symbolsHtml != null ? row.symbolsHtml : escapeHtml(row.symbolsText || "-")}</td>
      <td class="rank-trade-col" data-label="取引内容">${tradesCell}</td>
      ${menuCell}
    `;
    tr.dataset.userId = row.userId || "";
    tr.dataset.season = season;
    tr.dataset.rowIndex = String(idx);
    body.appendChild(tr);
  });
}

function renderHistorySelect() {
  const select = app.els.historyMonthSelect;
  const currentValue = select.value;
  select.innerHTML = "";

  const bySeason = new Map((app.state.rankings || []).map((x) => [x.season, x]));
  // 過去のランキングは「直前の月」から表示する（現在月は除外）
  const seasonsAll = buildRollingSeasonKeys(CONFIG.rankingKeepMonths);
  const seasons = seasonsAll.length > 1 ? seasonsAll.slice(1) : seasonsAll;
  for (const season of seasons) {
    const item = bySeason.get(season);
    const option = document.createElement("option");
    option.value = season;
    option.textContent =
      item && item.rows && item.rows.length
        ? `${formatSeasonLabel(season)} (${item.rows.length}件)`
        : formatSeasonLabel(season);
    select.appendChild(option);
  }
  select.disabled = false;

  if (currentValue && seasons.includes(currentValue)) {
    select.value = currentValue;
  } else {
    select.selectedIndex = 0;
  }
}

function renderHistoryTable() {
  const season = app.els.historyMonthSelect.value;
  const body = app.els.historyTableBody;
  body.innerHTML = "";

  if (!season) {
    body.innerHTML = `<tr class="rank-table-empty"><td colspan="6" data-label="">月を選択してください。</td></tr>`;
    app.els.historyMeta.textContent = "";
    return;
  }

  const target = app.state.rankings.find((x) => x.season === season);
  if (!target || !target.rows.length) {
    body.innerHTML = `<tr class="rank-table-empty"><td colspan="6" data-label="">${escapeHtml(formatSeasonLabel(season))} の取引データがありません。</td></tr>`;
    app.els.historyMeta.textContent =
      target && target.settledAt ? `確定日時 ${formatDateTimeJst(target.settledAt)}` : "";
    return;
  }

  const currentUser = getCurrentUser();
  target.rows.forEach((row, idx) => {
    const tr = document.createElement("tr");
    tr.classList.add("rank-row");
    const rank = idx + 1;
    if (rank <= 5) tr.classList.add(`rank-top-${rank}`);
    const pctClass = row.returnPct > 0 ? "pct-up" : row.returnPct < 0 ? "pct-down" : "pct-flat";
    const histName = row.displayName || row.name || "-";
    const accountHtml = row.isAnonymized
      ? renderAnonymousRankLabel(histName, true)
      : escapeHtml(histName);
    const menuCell = renderRankMenuCell(row, season, currentUser);
    const rankBadge = renderRankBadge(rank);
    const histSymParts = (row.symbols || []).map((s) => escapeHtml(getSymbolDisplayName(s) || s)).filter(Boolean);
    const historySymbolsHtml = histSymParts.length
      ? joinRankHoldingsHtmlChunks(histSymParts.map((s, i, arr) => (i < arr.length - 1 ? `${s}、` : s)))
      : "-";
    const accountLenClass = rankAccountCellLenClass(histName);
    tr.innerHTML = `
      <td class="rank-td" data-label="順位"><span class="rank-no">${rankBadge}<span class="rank-num">${rank}</span></span></td>
      <td class="rank-account-cell ${accountLenClass}${row.isAnonymized ? " rank-account-cell--anon" : ""}" data-label="アカウント名"><span class="rank-account-cell__inner">${accountHtml}</span></td>
      <td class="${pctClass}" data-label="上昇率"><span class="rank-pct-cell__inner">${formatPct(row.returnPct)}</span></td>
      <td class="rank-symbols-cell" data-label="保有銘柄">${historySymbolsHtml}</td>
      <td class="rank-trade-col" data-label="取引内容">${renderTradeDetails(row.trades || [])}</td>
      ${menuCell}
    `;
    tr.dataset.userId = row.userId || "";
    tr.dataset.season = season;
    tr.dataset.rowIndex = String(idx);
    body.appendChild(tr);
  });

  app.els.historyMeta.textContent = target.settledAt
    ? `確定日時 ${formatDateTimeJst(target.settledAt)}`
    : "";
}

function renderReportTable() {
  const body = app.els.reportTableBody;
  body.innerHTML = "";

  const stats = buildReportStats();
  if (!stats.length) {
    body.innerHTML = `<tr><td colspan="4">通報対象のデータがありません。</td></tr>`;
    return;
  }

  for (const item of stats) {
    const tr = document.createElement("tr");
    const canDelete = item.count >= CONFIG.reportDeleteThreshold;
    tr.innerHTML = `
      <td>${escapeHtml(item.displayName)}</td>
      <td>${item.count}</td>
      <td>${escapeHtml(item.statusText)}</td>
      <td>
        <button class="tiny-btn tiny-btn-danger" data-action="delete-reported" data-user-id="${escapeHtml(item.userId)}" type="button" ${canDelete ? "" : "disabled"}>削除</button>
      </td>
    `;
    body.appendChild(tr);
  }
}

function updateActionAvailability() {
  const user = getCurrentUser();
  const activePickCount = user ? countOpenPicks(user.picks || []) : 0;

  // localStorage 保存が致命的に失敗している場合、状態の巻き戻りを防ぐため操作を無効化する
  if (app?.state?.security?.saveStateFailed) {
    if (app.els.addPickBtn) app.els.addPickBtn.disabled = true;
    if (app.els.previewBtn) app.els.previewBtn.disabled = true;
    if (app.els.confirmPicksBtn) app.els.confirmPicksBtn.disabled = true;
    if (app.els.undoPickBtn) app.els.undoPickBtn.disabled = true;
    if (app.els.refreshMyPricesBtn) app.els.refreshMyPricesBtn.disabled = true;
    if (app.els.apiDiagBtn) app.els.apiDiagBtn.disabled = true;
    if (app.els.refreshAccountPageBtn) app.els.refreshAccountPageBtn.disabled = true;
    if (app.els.menuPickBtn) app.els.menuPickBtn.disabled = true;
    return;
  }

  app.els.menuLoginBtn.textContent = user ? "マイページ" : "ログイン";
  app.els.menuRegisterBtn.classList.toggle("hidden", Boolean(user));
  app.els.topLogoutBtn.classList.toggle("hidden", !user);
  app.els.topLogoutBtn.disabled = !user;
  app.els.menuPickBtn.disabled = !user;
  app.els.menuPickBtn.classList.toggle("hidden", !user);
  app.els.confirmPicksBtn.disabled = !user || (user && user.needsPickConfirm === false);
  app.els.confirmPicksBtn.classList.remove("btn-confirm-pending", "btn-confirm-done");
  if (user) {
    app.els.confirmPicksBtn.classList.add(user.needsPickConfirm !== false ? "btn-confirm-pending" : "btn-confirm-done");
    if (app.els.pickUnconfirmedNotice) {
      app.els.pickUnconfirmedNotice.classList.toggle("hidden", user.needsPickConfirm === false);
    }
  } else if (app.els.pickUnconfirmedNotice) {
    app.els.pickUnconfirmedNotice.classList.add("hidden");
  }
  /* 確定前は追加・削除・売却を自由に可能。保有は最大5銘柄（売却確定前まで保有扱い） */
  if (user && user.needsPickConfirm !== false) app.addPickBtnJustAdded = false;
  app.els.addPickBtn.disabled = !user || activePickCount >= CONFIG.maxPicks;
  app.els.addPickBtn.classList.toggle("btn-add-done", app.addPickBtnJustAdded);
  app.els.previewBtn.disabled = !user;
  app.els.undoPickBtn.disabled = !user || !(app.pickUndoStack || []).length;
  app.els.refreshMyPricesBtn.disabled = !user;
  app.els.apiDiagBtn.disabled = !user;
  if (app.els.refreshAccountPageBtn) app.els.refreshAccountPageBtn.disabled = !user;
  if (app.els.menuCopySyncUrlBtn) {
    app.els.menuCopySyncUrlBtn.classList.toggle("hidden", !getFirebaseSyncConfig());
  }
}

async function onAuthSubmit(event) {
  event.preventDefault();
  clearMessage(app.els.authMessage);
  clearMessage(app.els.accountMessage);
  clearMessage(app.els.reportMessage);

  const mode = app.authMode === "register" ? "register" : "login";
  if (app.authMode === "reset") {
    setMessage(app.els.authMessage, "パスワードを忘れたときは専用フォームから実行してください。", true);
    return;
  }

  const name = app.els.authName.value.trim();
  const password = app.els.authPassword.value;
  const passwordConfirm = app.els.authPasswordConfirm.value;
  const recoveryQuestionId = app.els.authRecoveryQuestion?.value || "";
  const recoveryAnswer = app.els.authRecoveryAnswer?.value || "";

  const nameError = validateAccountName(name);
  if (nameError) {
    setMessage(app.els.authMessage, nameError, true);
    return;
  }

  // ログイン時は「禁止パスワード（連番など）」の判定をスキップする。
  // 既存ユーザーが（当時のルールで）登録した弱いパスワード（例: 1234）でも入れるようにする。
  const passwordError = mode === "register" ? validatePassword(password) : validatePasswordAllowedChars(password);
  if (passwordError) {
    setMessage(app.els.authMessage, passwordError, true);
    return;
  }

  if (mode === "register") {
    if (password !== passwordConfirm) {
      setMessage(app.els.authMessage, "パスワードが一致しません。", true);
      return;
    }
    const recoveryQError = validateRecoveryQuestion(recoveryQuestionId);
    if (recoveryQError) {
      setMessage(app.els.authMessage, recoveryQError, true);
      return;
    }
    const recoveryAError = validateRecoveryAnswer(recoveryAnswer);
    if (recoveryAError) {
      setMessage(app.els.authMessage, recoveryAError, true);
      return;
    }
  }

  if (!window.crypto?.subtle) {
    setMessage(app.els.authMessage, "このブラウザは暗号化APIに対応していません。", true);
    return;
  }

  if (mode === "login") {
    const rl = getClientRateLimitMessageIfRejected(
      "authSubmit",
      CONFIG.clientRateAuthSubmitMax,
      CONFIG.clientRateAuthSubmitWindowMs
    );
    if (rl) {
      setMessage(app.els.authMessage, rl, true);
      return;
    }
  }

  if (mode === "register") {
    const sel = app.els.authRecoveryQuestion;
    const questionLabel = (sel && sel.options[sel.selectedIndex]) ? sel.options[sel.selectedIndex].text : recoveryQuestionId;
    app.pendingRegistration = { name, password, recoveryQuestionId, recoveryAnswer };
    showRegisterConfirmModal(name, questionLabel, recoveryAnswer);
    return;
  }

  try {
    setBusy(true);
    await guardedSubmit("auth", async () => {
      if (!getSupabaseCloudConfig()) {
        await rollSeasonIfNeeded();
      }
      await loginAccount(name, password);
      if (getSupabaseCloudConfig()) {
        await rollSeasonIfNeeded();
      }
      setMessage(app.els.authMessage, "ログインしました。", false);
      app.els.authPassword.value = "";
      app.els.authPasswordConfirm.value = "";
      if (app.els.authRecoveryAnswer) app.els.authRecoveryAnswer.value = "";
      setCurrentView("mypage");
      showGlobalNotice("", false);
      renderAll();
    });
  } catch (error) {
    setMessage(app.els.authMessage, normalizeErrorMessage(error), true);
  } finally {
    setBusy(false);
  }
}

function showRegisterConfirmModal(name, questionLabel, answer) {
  if (app.els.registerConfirmId) app.els.registerConfirmId.textContent = escapeHtml(name);
  if (app.els.registerConfirmQuestion) app.els.registerConfirmQuestion.textContent = escapeHtml(questionLabel);
  if (app.els.registerConfirmAnswer) app.els.registerConfirmAnswer.textContent = escapeHtml(answer);
  if (app.els.registerConfirmStep) app.els.registerConfirmStep.classList.remove("hidden");
  if (app.els.registerRulesStep) app.els.registerRulesStep.classList.add("hidden");
  if (app.els.registerConfirmModal) {
    app.els.registerConfirmModal.classList.remove("hidden");
    app.els.registerConfirmModal.setAttribute("aria-hidden", "false");
  }
}

function closeRegisterConfirmModal() {
  if (app.els.registerConfirmModal) {
    app.els.registerConfirmModal.classList.add("hidden");
    app.els.registerConfirmModal.setAttribute("aria-hidden", "true");
  }
  app.pendingRegistration = null;
}

async function onRegisterConfirmOk() {
  const p = app.pendingRegistration;
  if (!p) return;
  const rl = getClientRateLimitMessageIfRejected(
    "authSubmit",
    CONFIG.clientRateAuthSubmitMax,
    CONFIG.clientRateAuthSubmitWindowMs
  );
  if (rl) {
    setMessage(app.els.authMessage, rl, true);
    return;
  }
  try {
    setBusy(true);
    await guardedSubmit("auth", async () => {
      await rollSeasonIfNeeded();
      await registerAccount(p.name, p.password, p.recoveryQuestionId, p.recoveryAnswer);
      // 登録直後は server の state が「自分の分」中心で返ることがあるため、
      // 公開ランキングスナップショットを即取り込み、他参加者の順位もすぐ表示できるようにする。
      if (getSupabaseCloudConfig()) {
        try {
          await pullPublicRankingSnapshot("boot");
        } catch (_) {}
      }
    });
    app.pendingRegistration = null;
    setMessage(app.els.authMessage, "アカウントを作成しました。", false);
    if (app.els.authPassword) app.els.authPassword.value = "";
    if (app.els.authPasswordConfirm) app.els.authPasswordConfirm.value = "";
    if (app.els.authRecoveryAnswer) app.els.authRecoveryAnswer.value = "";
    setCurrentView("mypage");
    showGlobalNotice("", false);
    if (app.els.registerConfirmStep) app.els.registerConfirmStep.classList.add("hidden");
    if (app.els.registerRulesStep) app.els.registerRulesStep.classList.remove("hidden");
  } catch (err) {
    setMessage(app.els.authMessage, normalizeErrorMessage(err), true);
  } finally {
    setBusy(false);
  }
}

function onRegisterRulesOk() {
  closeRegisterConfirmModal();
  renderAll();
}

function openIntroModal() {
  if (app.els.introModal) {
    app.els.introModal.classList.remove("hidden");
    app.els.introModal.setAttribute("aria-hidden", "false");
  }
}

function closeIntroModal() {
  if (app.els.introModal) {
    app.els.introModal.classList.add("hidden");
    app.els.introModal.setAttribute("aria-hidden", "true");
  }
  try {
    localStorage.setItem("stockgame_intro_seen", "1");
  } catch (_) {}
  if (app.pendingRegisterAfterIntro) {
    app.pendingRegisterAfterIntro = false;
    syncAuthMode("register");
  }
  renderAll();
  if (app.authMode === "register") void refreshCloudAccountRegistrationStats();
}

function onSwitchAuthMode() {
  clearMessage(app.els.authMessage);
  if (app.authMode !== "register") {
    if (!localStorage.getItem("stockgame_intro_seen")) {
      app.pendingRegisterAfterIntro = true;
      openIntroModal();
      return;
    }
  }
  syncAuthMode(app.authMode === "register" ? "login" : "register");
  renderAll();
  if (app.authMode === "register") void refreshCloudAccountRegistrationStats();
}

function onToggleResetForm() {
  clearMessage(app.els.authMessage);
  syncAuthMode("reset");
  setCurrentView("auth");
  renderAll();
}

function onResetBackClick() {
  clearMessage(app.els.authMessage);
  syncAuthMode("login");
  setCurrentView("auth");
  renderAll();
}

async function onResetPasswordSubmit(event) {
  event.preventDefault();
  clearMessage(app.els.authMessage);

  const name = app.els.resetName.value.trim();
  const rateKey = "reset:" + normalizeNameKey(name);
  const recoveryQuestionId = app.els.resetRecoveryQuestion?.value || "";
  const recoveryAnswer = app.els.resetRecoveryAnswer?.value || "";
  const newPassword = app.els.resetNewPassword.value;

  const nameError = validateAccountName(name);
  if (nameError) {
    setMessage(app.els.authMessage, nameError, true);
    return;
  }

  // 再設定フローも総当たりを避ける（ログインと同等のロック）
  enforceLoginRateLimit(rateKey);
  const recoveryQError = validateRecoveryQuestion(recoveryQuestionId);
  if (recoveryQError) {
    setMessage(app.els.authMessage, recoveryQError, true);
    return;
  }
  const recoveryAError = validateRecoveryAnswer(recoveryAnswer);
  if (recoveryAError) {
    setMessage(app.els.authMessage, recoveryAError, true);
    return;
  }
  const pwError = validatePassword(newPassword);
  if (pwError) {
    setMessage(app.els.authMessage, pwError, true);
    return;
  }

  const rlReset = getClientRateLimitMessageIfRejected(
    "authSubmit",
    CONFIG.clientRateAuthSubmitMax,
    CONFIG.clientRateAuthSubmitWindowMs
  );
  if (rlReset) {
    setMessage(app.els.authMessage, rlReset, true);
    return;
  }

  try {
    setBusy(true);
    await guardedSubmit("resetPassword", async () => {
      await resetPasswordByRecovery(name, recoveryQuestionId, recoveryAnswer, newPassword);
      clearFailedLogin(rateKey);
      app.els.resetName.value = "";
      if (app.els.resetRecoveryAnswer) app.els.resetRecoveryAnswer.value = "";
      app.els.resetNewPassword.value = "";
      syncAuthMode("login");
      setMessage(app.els.authMessage, "パスワードを再設定しました。", false);
      renderAll();
    });
  } catch (error) {
    recordFailedLogin(rateKey);
    setMessage(app.els.authMessage, normalizeErrorMessage(error), true);
  } finally {
    setBusy(false);
  }
}

async function onRenameSubmit(event) {
  event.preventDefault();
  clearMessage(app.els.accountMessage);
  const user = getCurrentUser();
  if (!user) {
    setMessage(app.els.accountMessage, "ログインしてください。", true);
    return;
  }

  const nextName = app.els.renameInput.value.trim();
  const nameError = validateAccountName(nextName);
  if (nameError) {
    setMessage(app.els.accountMessage, nameError, true);
    return;
  }

  const rlAcc = getClientRateLimitMessageIfRejected(
    "accountEdit",
    CONFIG.clientRateAccountEditMax,
    CONFIG.clientRateAccountEditWindowMs
  );
  if (rlAcc) {
    setMessage(app.els.accountMessage, rlAcc, true);
    return;
  }

  try {
    await renameAccount(user.id, nextName);
    app.els.renameInput.value = "";
    app.els.renameFormBlock.classList.add("hidden");
    setAccountChangeDoneMessage(app.els.accountMessage, "アカウント名（ID）を変更しました。上の「ログイン中」表示をご確認ください。");
    renderAll();
  } catch (error) {
    setMessage(app.els.accountMessage, normalizeErrorMessage(error), true);
  }
}

async function onChangePasswordSubmit(event) {
  event.preventDefault();
  clearMessage(app.els.accountMessage);
  const user = getCurrentUser();
  if (!user) {
    setMessage(app.els.accountMessage, "ログインしてください。", true);
    return;
  }
  const currentPassword = app.els.currentPasswordInput.value;
  const newPassword = app.els.nextPasswordInput.value;
  const confirmPassword = app.els.nextPasswordConfirmInput.value;
  if (!currentPassword) {
    setMessage(app.els.accountMessage, "現在のパスワードを入力してください。", true);
    return;
  }
  const newError = validatePassword(newPassword);
  if (newError) {
    setMessage(app.els.accountMessage, newError, true);
    return;
  }
  if (newPassword !== confirmPassword) {
    setMessage(app.els.accountMessage, "新しいパスワードと確認が一致しません。", true);
    return;
  }
  const rlPw = getClientRateLimitMessageIfRejected(
    "accountEdit",
    CONFIG.clientRateAccountEditMax,
    CONFIG.clientRateAccountEditWindowMs
  );
  if (rlPw) {
    setMessage(app.els.accountMessage, rlPw, true);
    return;
  }
  try {
    await rollSeasonIfNeeded();
  } catch (_) {}
  const userAfterRoll = getCurrentUser();
  if (!userAfterRoll || userAfterRoll.id !== user.id) {
    setMessage(app.els.accountMessage, "対戦月が切り替わったかセッションが無効です。再度ログインしてください。", true);
    renderAll();
    return;
  }
  try {
    if (String(user.passwordAlgo || "") === "remote" && getSupabaseCloudConfig()) {
      await supabaseCloudFetch("change-password", {
        body: JSON.stringify({ currentPassword, newPassword })
      });
      user.updatedAt = new Date().toISOString();
      saveState();
    } else {
      const ok = await verifyPassword(user, currentPassword);
      if (!ok) {
        setMessage(app.els.accountMessage, "現在のパスワードが正しくありません。", true);
        return;
      }
      const newSalt = createSalt();
      user.passwordSalt = newSalt;
      user.passwordHash = await hashPassword(newPassword, newSalt);
      user.passwordAlgo = "pbkdf2";
      user.updatedAt = new Date().toISOString();
      saveState();
    }
    app.els.currentPasswordInput.value = "";
    app.els.nextPasswordInput.value = "";
    app.els.nextPasswordConfirmInput.value = "";
    app.els.changePasswordFormBlock.classList.add("hidden");
    setAccountChangeDoneMessage(app.els.accountMessage, "パスワードを変更しました。");
    renderAll();
  } catch (error) {
    setMessage(app.els.accountMessage, normalizeErrorMessage(error), true);
  }
}

function bindPasswordToggle(inputEl, btnEl) {
  if (!inputEl || !btnEl) return;
  const show = () => { inputEl.type = "text"; };
  const hide = () => { inputEl.type = "password"; };
  btnEl.addEventListener("mousedown", (e) => { e.preventDefault(); show(); });
  btnEl.addEventListener("mouseup", hide);
  btnEl.addEventListener("mouseleave", hide);
  btnEl.addEventListener("pointerdown", (e) => { e.preventDefault(); show(); });
  btnEl.addEventListener("pointerup", hide);
  btnEl.addEventListener("pointercancel", hide);
  btnEl.addEventListener("touchstart", (e) => { e.preventDefault(); show(); }, { passive: false });
  btnEl.addEventListener("touchend", (e) => { e.preventDefault(); hide(); }, { passive: false });
  btnEl.addEventListener("touchcancel", hide);
  inputEl.addEventListener("blur", hide);
}

function toggleAccountForm(which) {
  const renameBlock = app.els.renameFormBlock;
  const passwordBlock = app.els.changePasswordFormBlock;
  if (which === "rename") {
    const isHidden = renameBlock.classList.contains("hidden");
    passwordBlock.classList.add("hidden");
    renameBlock.classList.toggle("hidden", !isHidden);
  } else {
    const isHidden = passwordBlock.classList.contains("hidden");
    renameBlock.classList.add("hidden");
    passwordBlock.classList.toggle("hidden", !isHidden);
  }
}

async function onUndoPickClick() {
  try {
    await rollSeasonIfNeeded();
  } catch (_) {}
  const user = getCurrentUser();
  if (!user) return;
  const rlUndo = getClientRateLimitMessageIfRejected(
    "pickAction",
    CONFIG.clientRatePickActionMax,
    CONFIG.clientRatePickActionWindowMs
  );
  if (rlUndo) {
    setMessage(app.els.pickMessage, rlUndo, true);
    return;
  }
  const stack = app.pickUndoStack || [];
  if (!stack.length) {
    setMessage(app.els.pickMessage, "戻せる履歴がありません。", true);
    return;
  }
  const pick = stack.pop();
  if (!pick || !pick.id) return;
  const exists = (user.picks || []).some((p) => p.id === pick.id);
  if (exists) {
    setMessage(app.els.pickMessage, "その銘柄はすでに一覧にあります。", true);
    return;
  }
  user.picks = [...(user.picks || []), pick];
  user.needsPickConfirm = true;
  user.pickListModified = true;
  user.updatedAt = new Date().toISOString();
  saveState();
  setMessage(app.els.pickMessage, "一つ戻しました。", false);
  renderAll();
}

function onDownloadReportClick() {
  const user = getCurrentUser();
  if (!user) {
    setMessage(app.els.accountMessage, "ログインしてください。", true);
    return;
  }

  const picks = user.picks || [];
  if (!picks.length) {
    setMessage(app.els.accountMessage, "PDFの生成に失敗しました。", true);
    return;
  }

  const season = app.state.currentSeason || getSeasonKeyJst(new Date());
  const score = calcUserScore(user, "latest", season);
  const getPdfPctColor = (v) => {
    if (typeof v !== "number" || !Number.isFinite(v)) return "#ffffff"; // 0/不明は白（指定通り）
    if (v > 0) return "#d13232"; // プラス=赤
    if (v < 0) return "#0d47a1"; // マイナス=青
    return "#ffffff"; // 0=白
  };
  const returnPctNum = score != null ? score.returnPct : null;
  const returnPctText = score != null ? formatPct(score.returnPct) : "-";
  const returnPctColor = getPdfPctColor(returnPctNum);

  const rowsHtml = picks.map((pick) => {
    const pct = computePickPct(pick);
    const pctText = pct == null ? "-" : formatPct(pct);
    const pctColor = getPdfPctColor(pct);
    const statusOrSellDate = pick.status === "CLOSED" ? (pick.exitDate || "-") : pickStatusLabel(pick);
    return `
      <tr>
        <td>${escapeHtml(pick.displayName || pick.symbol)}<br><small>${escapeHtml(pick.symbol)}</small></td>
        <td>${escapeHtml(pick.entryDate || pick.orderDate || "-")}</td>
        <td>${escapeHtml(statusOrSellDate)}</td>
        <td><span style="color: ${pctColor}; font-weight: 700;">${escapeHtml(pctText)}</span></td>
      </tr>
    `;
  }).join("");

  const title = `売買履歴・成果_${getDisplayName(user)}_${getDateKeyJst(new Date())}`;
  const htmlContent = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif; margin: 28px; color: #0e2a2b; }
    .head { border-bottom: 3px solid #0d8f8d; margin-bottom: 18px; padding-bottom: 10px; }
    h1 { margin: 0; font-size: 24px; }
    .meta { color: #3e6061; margin-top: 8px; font-size: 13px; }
    .result-line { font-size: 18px; font-weight: 700; margin: 12px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 14px; }
    th, td { border: 1px solid #cfe0df; padding: 8px 10px; font-size: 12px; text-align: left; }
    th { background: #edf7f6; }
    .foot { margin-top: 18px; color: #48696a; font-size: 12px; }
  </style>
</head>
<body>
  <div class="head">
    <h1>株のタカ 🦅 売買履歴・成果</h1>
    <div class="meta">${escapeHtml(getDisplayName(user))} ／ 取得日時 ${escapeHtml(formatDateTimeJst(new Date()))}</div>
    <div class="result-line">今月のリターン: <span style="color: ${returnPctColor};">${escapeHtml(returnPctText)}</span></div>
  </div>
  <table>
    <thead>
      <tr>
        <th>銘柄</th>
        <th>取得日</th>
        <th>状態／売却日</th>
        <th>損益</th>
      </tr>
    </thead>
    <tbody>${rowsHtml}</tbody>
  </table>
  <div class="foot">売買履歴と今月の成果。</div>
</body>
</html>`;

  let printFrame = document.getElementById("printFrame");
  if (!printFrame) {
    printFrame = document.createElement("iframe");
    printFrame.id = "printFrame";
    printFrame.setAttribute("aria-hidden", "true");
    printFrame.style.cssText = "position:absolute;width:0;height:0;border:0;visibility:hidden;";
    document.body.appendChild(printFrame);
  }
  const win = printFrame.contentWindow;
  if (!win) {
    setMessage(app.els.accountMessage, "PDF用の表示に失敗しました。", true);
    return;
  }
  win.document.open();
  win.document.write(htmlContent);
  win.document.close();
  const done = (ok) => {
    setMessage(app.els.accountMessage, ok ? "印刷ダイアログを表示しました。「保存」でPDFにできます。" : "印刷の呼び出しに失敗しました。", !ok);
  };
  setTimeout(() => {
    try {
      win.focus();
      win.print();
      done(true);
    } catch (e) {
      done(false);
    }
  }, 250);
}

async function onLogout() {
  const user = getCurrentUser();
  if (user && hasUncommittedPickChanges(user)) {
    const ok = confirm(
      "銘柄が確定されておりません。変更内容は削除されます。\n\nログアウトしますか？\n（OK＝ログアウトする／キャンセル＝とどまる）"
    );
    if (!ok) return;
    discardPickDraft(user);
  }
  const supaTokenSnap = getSupabaseSessionToken();
  await notifySupabaseLogoutBestEffort(supaTokenSnap);
  app.sessionUserId = null;
  app.state.sessionUserId = null;
  clearSupabaseSessionToken();
  setCurrentView("ranking");
  saveState();
  showGlobalNotice("", false);
  clearMessage(app.els.accountMessage);
  clearMessage(app.els.pickMessage);
  clearMessage(app.els.reportMessage);
  showPreview(null);
  renderAll();
}

function onCopySyncUrlClick() {
  const rlSync = getClientRateLimitMessageIfRejected(
    "syncCopy",
    CONFIG.clientRateSyncCopyMax,
    CONFIG.clientRateSyncCopyWindowMs
  );
  if (rlSync) {
    showGlobalNotice(rlSync, true);
    return;
  }
  const cfg = getFirebaseSyncConfig();
  if (!cfg) {
    showGlobalNotice(
      "Firebase の同期が無効です。GitHub の firebase-config.js で enabled と projectId 等を設定してください（README_CLOUD_SYNC.md）。",
      true
    );
    return;
  }
  const id = getOrCreateSyncId();
  let text;
  try {
    const u = new URL(window.location.href);
    u.searchParams.set("sync", id);
    text = u.toString();
  } catch (_) {
    text = `${window.location.origin}${window.location.pathname}?sync=${encodeURIComponent(id)}`;
  }
  const done = () => showGlobalNotice("同期URLをコピーしました。別ブラウザのアドレス欄に貼り付けて開いてください。", false);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(() => {
      window.prompt("同期URL（コピーしてください）", text);
      done();
    });
  } else {
    window.prompt("同期URL（コピーしてください）", text);
    done();
  }
}

async function onDeleteAccountClick() {
  const user = getCurrentUser();
  if (!user) {
    setMessage(app.els.accountMessage, "ログインしてください。", true);
    return;
  }
  const userId = user.id;
  const ok1 = confirm("アカウントを削除すると、今月のランキング・保有銘柄・通報履歴などの関連データも消去され、復元できません。\n\n本当に削除しますか？（1回目）");
  if (!ok1) return;
  const ok2 = confirm("削除すると元に戻せません。もう一度「OK」を押すとアカウントが削除されます。（2回目）");
  if (!ok2) return;
  // API や purge より先に枠を解放（401 でユーザーが先に消えると release が効かない取りこぼしを防ぐ）
  releaseDeviceSeasonSlotForDeletedUser(user);
  releaseDeviceSeasonSlotForThisBrowserThisMonth();
  let serverDeleted = false;
  if (getSupabaseCloudConfig()) {
    try {
      await supabaseCloudFetch("delete-account", { body: "{}" });
      serverDeleted = true;
    } catch (e) {
      console.warn("delete-account edge failed", e);
    }
  } else {
    serverDeleted = true;
  }
  purgeUserCompletely(userId);

  saveState();
  clearMessage(app.els.accountMessage);
  const doneMsg = serverDeleted
    ? "アカウントを削除しました。ランキング画面に戻りました。"
    : "この端末の表示データを消去してログアウトしました。サーバー側の削除に失敗した場合、同じIDで再登録できないことがあります。Supabase に delete-account 関数をデプロイするか、ダッシュボードでユーザーを削除してください。";
  showPreview(null);
  setCurrentView("ranking");
  renderAll();
  if (getSupabaseCloudConfig()) void refreshCloudAccountRegistrationStats();
  showGlobalNotice(doneMsg, !serverDeleted);
}

async function onPreviewClick() {
  clearMessage(app.els.pickMessage);
  const user = getCurrentUser();
  if (!user) {
    setMessage(app.els.pickMessage, "ログインしてください。", true);
    return;
  }

  const raw = sanitizePickInput(app.els.symbolInput.value);
  if (!raw) {
    setMessage(app.els.pickMessage, "銘柄コードを入力してください。", true);
    return;
  }

  const previewR = checkAndRecordClientRateLimitWithEscalation(
    "previewQuote",
    CONFIG.clientRatePreviewMax,
    CONFIG.clientRatePreviewWindowMs,
    "preview-soft"
  );
  if (!previewR.ok) {
    const w = Math.ceil(CONFIG.clientRatePreviewWindowMs / 1000);
    const previewMsg =
      previewR.kind === "escalation"
        ? previewR.message
        : `「現在値を確認」は短時間に繰り返さないでください。約${previewR.retryAfterSec}秒後に再度お試しください。（${w}秒間に${CONFIG.clientRatePreviewMax}回まで）※繰り返し連打すると制限が強くなります。`;
    setMessage(app.els.pickMessage, previewMsg, true);
    return;
  }

  const marketType = app.els.marketType.value;
  setMessage(app.els.pickMessage, "取得中...", false);

  if (marketType === "JP" || marketType === "AUTO") await loadJpCompanyMaster();

  let resolved = null;
  try {
    try {
      resolved = resolveSymbolInput(raw, marketType);
    } catch (_) {
      resolved = null;
    }

    if (resolved) {
      const cache = app.state.apiCache.quote[resolved.symbol];
      const now = Date.now();
      const cacheAge = cache ? now - cache.ts : Infinity;
      const cacheFresh = cache && cache.data?.price != null && cacheAge < CONFIG.quoteTtlMs;
      const cacheShowable = cache && cache.data?.price != null && cacheAge < CONFIG.previewCacheMaxAgeMs;

      if (cacheShowable) {
        const name = cache.data.name || getJpDisplayName(resolved.symbol) || resolved.nameGuess || resolved.symbol;
        showPreview({
          symbol: resolved.symbol,
          market: resolved.market,
          name,
          price: cache.data.price,
          asOfMs: cache.data.asOfMs
        });
        setMessage(
          app.els.pickMessage,
          cacheFresh ? "キャッシュを表示中。最新値を取得しています..." : "キャッシュを表示中。更新しています...",
          false
        );
        hideSymbolSuggestions();
        renderApiDiagMessage();
        setBusy(false);
        app.interactiveFetch = false;
        void fetchQuote(resolved.symbol, true).then((data) => {
          if (data?.price != null) {
            const n = data.name || getJpDisplayName(resolved.symbol) || resolved.nameGuess || resolved.symbol;
            showPreview({ symbol: resolved.symbol, market: resolved.market, name: n, price: data.price, asOfMs: data.asOfMs });
            setMessage(app.els.pickMessage, "最新値を更新しました。", false);
          }
        }).catch(() => {});
        return;
      }

      showPreview({
        symbol: resolved.symbol,
        market: resolved.market,
        name: getJpDisplayName(resolved.symbol) || resolved.nameGuess || resolved.symbol,
        price: null,
        asOfMs: null
      });
      setBusy(true);
      app.interactiveFetch = true;
      const quote = await fetchQuote(resolved.symbol, true);
      const nameResolved = quote.name || getJpDisplayName(resolved.symbol) || resolved.nameGuess || resolved.symbol;
      showPreview({
        symbol: resolved.symbol,
        market: resolved.market,
        name: nameResolved,
        price: quote.price,
        asOfMs: quote.asOfMs
      });
      app.lastApiFailure = null;
      hideSymbolSuggestions();
      setMessage(app.els.pickMessage, "現在値を取得しました。", false);
      renderApiDiagMessage();
      return;
    }

    setBusy(true);
    app.interactiveFetch = true;
    resolved = await resolveSymbolForAction(raw, marketType);
    const cache = app.state.apiCache.quote[resolved.symbol];
    const now = Date.now();
    const cacheAge = cache ? now - cache.ts : Infinity;
    const cacheFresh = cache && cache.data?.price != null && cacheAge < CONFIG.quoteTtlMs;
    const cacheShowable = cache && cache.data?.price != null && cacheAge < CONFIG.previewCacheMaxAgeMs;

    const nameForPreview = () => cache?.data?.name || getJpDisplayName(resolved.symbol) || resolved.nameGuess || resolved.symbol;
    if (!cacheShowable) {
      showPreview({
        symbol: resolved.symbol,
        market: resolved.market,
        name: nameForPreview(),
        price: null,
        asOfMs: null
      });
    }
    if (cacheShowable) {
      const nameCache = nameForPreview();
      showPreview({
        symbol: resolved.symbol,
        market: resolved.market,
        name: nameCache,
        price: cache.data.price,
        asOfMs: cache.data.asOfMs
      });
      setMessage(
        app.els.pickMessage,
        cacheFresh ? "キャッシュを表示中。最新値を取得しています..." : "キャッシュを表示中。更新しています...",
        false
      );
      hideSymbolSuggestions();
      setBusy(false);
      app.interactiveFetch = false;
      void fetchQuote(resolved.symbol, true).then((data) => {
        if (data?.price != null) {
          const n = data.name || getJpDisplayName(resolved.symbol) || resolved.nameGuess || resolved.symbol;
          showPreview({ symbol: resolved.symbol, market: resolved.market, name: n, price: data.price, asOfMs: data.asOfMs });
          setMessage(app.els.pickMessage, "最新値を更新しました。", false);
        }
      }).catch(() => {});
      renderApiDiagMessage();
      return;
    }

    const quote = await fetchQuote(resolved.symbol, true);
    const nameFinal = quote.name || getJpDisplayName(resolved.symbol) || resolved.nameGuess || resolved.symbol;
    showPreview({
      symbol: resolved.symbol,
      market: resolved.market,
      name: nameFinal,
      price: quote.price,
      asOfMs: quote.asOfMs
    });
    app.lastApiFailure = null;
    hideSymbolSuggestions();
    setMessage(app.els.pickMessage, "現在値を取得しました。", false);
    renderApiDiagMessage();
  } catch (error) {
    const fallback = resolved ? app.state.apiCache.quote[resolved.symbol]?.data : null;
    if (fallback?.price != null && resolved) {
      showPreview({
        symbol: resolved.symbol,
        market: resolved.market,
        name: fallback.name || resolved.nameGuess || resolved.symbol,
        price: fallback.price,
        asOfMs: fallback.asOfMs
      });
      setMessage(app.els.pickMessage, "最新取得に失敗したため、キャッシュ値を表示しています。", true);
    } else {
      captureApiFailure(error, normalizeSymbolInput(raw), "quote");
      const errMsg = normalizeErrorMessage(error);
      if (resolved) {
        showPreview({
          symbol: resolved.symbol,
          market: resolved.market,
          name: pickBestDisplayName(resolved.symbol, resolved.market, null, resolved.nameGuess || resolved.symbol),
          price: null,
          failReason: errMsg
        });
      } else {
        try {
          const r = resolveSymbolInput(raw, marketType);
          showPreview({
            symbol: r.symbol,
            market: r.market,
            name: pickBestDisplayName(r.symbol, r.market, null, r.nameGuess || r.symbol),
            price: null,
            failReason: errMsg
          });
        } catch (_) {
          showPreview(null);
        }
      }
      setMessage(app.els.pickMessage, errMsg, true);
    }
    renderApiDiagMessage();
  } finally {
    app.interactiveFetch = false;
    setBusy(false);
    app.addPickBtnJustAdded = false;
    updateActionAvailability();
  }
}

async function onAddPickSubmit(event) {
  event.preventDefault();
  clearMessage(app.els.pickMessage);

  const user = getCurrentUser();
  if (!user) {
    setMessage(app.els.pickMessage, "ログインしてください。", true);
    return;
  }

  const raw = sanitizePickInput(app.els.symbolInput.value);
  if (!raw) {
    setMessage(app.els.pickMessage, "銘柄コードを入力してください。", true);
    return;
  }

  if (countOpenPicks(user.picks || []) >= CONFIG.maxPicks) {
    setMessage(app.els.pickMessage, `銘柄は最大${CONFIG.maxPicks}件までです。`, true);
    return;
  }

  const rlPick = getClientRateLimitMessageIfRejected(
    "pickAction",
    CONFIG.clientRatePickActionMax,
    CONFIG.clientRatePickActionWindowMs
  );
  if (rlPick) {
    setMessage(app.els.pickMessage, rlPick, true);
    return;
  }

  try {
    setBusy(true);
    app.interactiveFetch = true;
    await guardedSubmit("addPick", async () => {
      const marketType = app.els.marketType.value;
      if (marketType === "JP" || marketType === "AUTO") await loadJpCompanyMaster();
      const resolved = await resolveSymbolForAction(raw, marketType);
      const addResult = await addPickToCurrentUser(resolved);
      user.needsPickConfirm = true;
      user.updatedAt = new Date().toISOString();
      saveState();
      app.els.symbolInput.value = "";
      hideSymbolSuggestions();
      const addName = addResult?.quoteData?.name || getJpDisplayName(resolved.symbol) || resolved.nameGuess || resolved.symbol;
      showPreview({
        symbol: resolved.symbol,
        market: resolved.market,
        name: addName,
        price: addResult?.quoteData?.price ?? null,
        asOfMs: addResult?.quoteData?.asOfMs ?? null
      });
      if (addResult?.quoteData?.price != null) {
        setMessage(
          app.els.pickMessage,
          `銘柄を追加しました。現在値 ${formatPrice(addResult.quoteData.price, resolved.market)} を表示しています。`,
          false
        );
      } else if (addResult?.apiFallback) {
        setMessage(app.els.pickMessage, "銘柄を追加しました。API取得は反映に時間がかかります。", false);
      } else {
        setMessage(app.els.pickMessage, "銘柄を追加しました。", false);
      }
      app.els.marketType.value = "AUTO";
      renderApiDiagMessage();
      renderAll();
    });
  } catch (error) {
    captureApiFailure(error, normalizeSymbolInput(raw), "history");
    setMessage(app.els.pickMessage, normalizeErrorMessage(error), true);
    renderApiDiagMessage();
  } finally {
    app.interactiveFetch = false;
    setBusy(false);
  }
}

async function onConfirmPicksClick() {
  clearMessage(app.els.pickMessage);
  const user = getCurrentUser();
  if (!user) {
    setMessage(app.els.pickMessage, "ログインしてください。", true);
    return;
  }
  try {
    await ensureGameplaySeasonAlignedOrThrow();
  } catch (e) {
    setMessage(app.els.pickMessage, e instanceof Error ? e.message : "対戦月の確認に失敗しました。", true);
    return;
  }

  const rlConf = getClientRateLimitMessageIfRejected(
    "pickAction",
    CONFIG.clientRatePickActionMax,
    CONFIG.clientRatePickActionWindowMs
  );
  if (rlConf) {
    setMessage(app.els.pickMessage, rlConf, true);
    return;
  }

  if (user.needsPickConfirm === false) {
    setMessage(app.els.pickMessage, "変更はすでに確定済みです。", false);
    return;
  }

  const openPicks = (user.picks || []).filter((p) => p.status !== "CLOSED");
  if (CONFIG.minPicks > 0 && openPicks.length < CONFIG.minPicks) {
    setMessage(app.els.pickMessage, `銘柄は${CONFIG.minPicks}銘柄以上で確定してください。`, true);
    return;
  }

  const lines = openPicks.map((p, idx) => `${idx + 1}. ${p.symbol}`);
  const msg = `以下の銘柄で確定しますか？\n${lines.join("\n")}\n\nOKで確定します。`;
  const ok = confirm(msg);
  if (!ok) return;

  try {
    await guardedSubmit("confirmPicks", async () => {
      user.needsPickConfirm = false;
      user.pickListModified = false;
      user.picksLastConfirmed = clonePicksForDraft(user.picks || []);
      user.lastPickConfirmAt = new Date().toISOString();
      user.updatedAt = new Date().toISOString();
      app.pickUndoStack = [];
      app.addPickBtnJustAdded = true;
      saveState();
      capturePickDraft(user);
      showGlobalNotice("", false);
      setMessage(app.els.pickMessage, "銘柄確定に成功しました。", false);
      renderAll();
    });
  } catch (error) {
    setMessage(app.els.pickMessage, normalizeErrorMessage(error), true);
  }
}

async function runWithButtonBusy(button, busyText, task) {
  const oldText = button?.textContent;
  const oldDisabled = button?.disabled;
  if (button) {
    button.disabled = true;
    button.textContent = busyText;
  }
  try {
    return await task();
  } finally {
    if (button) {
      button.disabled = oldDisabled;
      button.textContent = oldText;
    }
  }
}

async function onRefreshMyPrices() {
  clearMessage(app.els.pickMessage);
  const user = getCurrentUser();
  if (!user) {
    setMessage(app.els.pickMessage, "ログインしてください。", true);
    return;
  }

  const myPrR = checkAndRecordClientRateLimitWithEscalation(
    "myPricesRefresh",
    CONFIG.clientRateMyPricesMax,
    CONFIG.clientRateMyPricesWindowMs
  );
  if (!myPrR.ok) {
    const w = Math.ceil(CONFIG.clientRateMyPricesWindowMs / 1000);
    const myPrMsg =
      myPrR.kind === "escalation"
        ? myPrR.message
        : `保有銘柄の更新は短時間に繰り返さないでください。約${myPrR.retryAfterSec}秒後に再度お試しください。（${w}秒間に${CONFIG.clientRateMyPricesMax}回まで）※繰り返し連打すると制限が強くなります。`;
    setMessage(app.els.pickMessage, myPrMsg, true);
    return;
  }

  try {
    await runWithButtonBusy(app.els.refreshMyPricesBtn, "更新中...", async () => {
      await refreshCurrentUserLatest(true);
    });
    app.state.lastDailyRefreshDate = getDateKeyJst(new Date());
    saveState();
    setMessage(app.els.pickMessage, "銘柄の現在値を更新しました。", false);
    renderAll();
  } catch (error) {
    captureApiFailure(error, "", "history");
    setMessage(app.els.pickMessage, normalizeErrorMessage(error), true);
    renderApiDiagMessage();
  }
}

async function onRefreshSeason() {
  if (app.submitLocks?.has("refreshSeason")) return;
  const rankR = checkAndRecordClientRateLimitWithEscalation(
    "rankBulkRefresh",
    CONFIG.clientRateRankMax,
    CONFIG.clientRateRankWindowMs
  );
  if (!rankR.ok) {
    const w = Math.ceil(CONFIG.clientRateRankWindowMs / 1000);
    if (rankR.kind === "escalation") {
      showGlobalNotice(rankR.message, true);
      clearMessage(app.els.pickMessage);
      setMessage(app.els.pickMessage, rankR.message, true);
    } else {
      showGlobalNotice(
        `順位の一括更新は負荷が大きいため制限しています。約${rankR.retryAfterSec}秒後に再度お試しください。（${w}秒間に${CONFIG.clientRateRankMax}回まで）※繰り返し連打すると制限が強くなります。`,
        true
      );
      clearMessage(app.els.pickMessage);
      setMessage(
        app.els.pickMessage,
        `「最新の順位を見る」は短時間に繰り返さないでください。約${rankR.retryAfterSec}秒後に再度お試しください。※繰り返し連打すると制限が強くなります。`,
        true
      );
    }
    return;
  }
  return guardedSubmit("refreshSeason", async () => {
    clearMessage(app.els.pickMessage);
    showGlobalNotice("銘柄の現在値を更新しています...", false);
    try {
      setBusy(true);
      await rollSeasonIfNeeded();
      await refreshAllUsersLatest(true);
      app.state.lastDailyRefreshDate = getDateKeyJst(new Date());
      app.state.lastRankUpdateAt = new Date().toISOString();
      saveState();
      renderAll();
      showGlobalNotice("", false);
    } catch (error) {
      captureApiFailure(error, "", "history");
      showGlobalNotice(normalizeErrorMessage(error), true);
      renderApiDiagMessage();
    } finally {
      setBusy(false);
    }
  });
}

async function onRefreshFromAccountPage() {
  const user = getCurrentUser();
  if (!user) {
    if (app.els.accountMessage) setMessage(app.els.accountMessage, "ログインしてください。", true);
    return;
  }
  const accR = checkAndRecordClientRateLimitWithEscalation(
    "accountPageRefresh",
    CONFIG.clientRateAccountMax,
    CONFIG.clientRateAccountWindowMs
  );
  if (!accR.ok) {
    const w = Math.ceil(CONFIG.clientRateAccountWindowMs / 1000);
    const msg =
      accR.kind === "escalation"
        ? accR.message
        : `データの更新は短時間に繰り返さないでください。約${accR.retryAfterSec}秒後に再度お試しください。（${w}秒間に${CONFIG.clientRateAccountMax}回まで）※繰り返し連打すると制限が強くなります。`;
    if (app.els.accountMessage) setMessage(app.els.accountMessage, msg, true);
    showGlobalNotice(
      accR.kind === "escalation"
        ? `マイページ更新: ${accR.message}`
        : `マイページ更新: 操作が多すぎます。約${accR.retryAfterSec}秒後に再試行してください。※繰り返し連打すると制限が強くなります。`,
      true
    );
    return;
  }
  clearMessage(app.els.accountMessage);
  const btn = app.els.refreshAccountPageBtn;
  try {
    await runWithButtonBusy(btn, "更新中...", async () => {
      await rollSeasonIfNeeded();
      // Yahooアクセスを最小化するため、ランキングへの反映に必要な「自分の銘柄だけ」を最新化する。
      await refreshCurrentUserLatest(true);
    });
    app.state.lastDailyRefreshDate = getDateKeyJst(new Date());
    app.state.lastRankUpdateAt = new Date().toISOString();
    saveState();
    if (app.els.accountMessage) setMessage(app.els.accountMessage, "保有銘柄とランキングを更新しました。", false);
    renderAll();
  } catch (error) {
    captureApiFailure(error, "", "history");
    if (app.els.accountMessage) setMessage(app.els.accountMessage, normalizeErrorMessage(error), true);
    renderApiDiagMessage();
  }
}

async function onApiDiagClick() {
  clearMessage(app.els.pickMessage);
  const diagR = checkAndRecordClientRateLimitWithEscalation(
    "apiConnectionDiag",
    CONFIG.clientRateDiagMax,
    CONFIG.clientRateDiagWindowMs
  );
  if (!diagR.ok) {
    const w = Math.ceil(CONFIG.clientRateDiagWindowMs / 1000);
    const diagMsg =
      diagR.kind === "escalation"
        ? diagR.message
        : `通信の確認は短時間に繰り返さないでください。約${diagR.retryAfterSec}秒後に再度お試しください。（${w}秒間に${CONFIG.clientRateDiagMax}回まで）※繰り返し連打すると制限が強くなります。`;
    setMessage(app.els.pickMessage, diagMsg, true);
    return;
  }
  const box = app.els.apiDiagMessage;
  box.classList.remove("hidden", "error", "success");
  box.textContent = "API接続を確認しています...";

  const checks = [
    { symbol: "7203.T", market: "JP", label: "JP" },
    { symbol: "AAPL", market: "US", label: "US" },
    { symbol: "BTC-USD", market: "CRYPTO", label: "CRYPTO" }
  ];
  const lines = [];
  let hasError = false;
  let diagFailure = null;

  try {
    setBusy(true);
    for (const item of checks) {
      try {
        const quote = await fetchQuote(item.symbol, true);
        lines.push(`${item.label}: 成功 ${quote.symbol} ${formatPrice(quote.price, item.market)}`);
      } catch (error) {
        hasError = true;
        captureApiFailure(error, item.symbol, "quote");
        diagFailure = app.lastApiFailure ? { ...app.lastApiFailure } : diagFailure;
        lines.push(`${item.label}: 失敗 ${summarizeApiError(error)}`);
      }
    }

    if (hasError && diagFailure) {
      app.lastApiFailure = diagFailure;
    } else if (!hasError) {
      app.lastApiFailure = null;
    }

    box.classList.toggle("error", hasError);
    box.classList.toggle("success", !hasError);
    box.textContent = hasError
      ? `API診断: 一部失敗\n${lines.join("\n")}`
      : `API診断: 成功\n${lines.join("\n")}`;
    if (hasError) {
      setMessage(app.els.pickMessage, "一部市場でAPI診断に失敗しました。上記の詳細を確認してください。", true);
    } else {
      setMessage(app.els.pickMessage, "API診断に合格しました。", false);
    }
  } finally {
    setBusy(false);
  }
}

async function onPickTableAction(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const action = target.dataset.action;
  if (!["remove", "sell", "cancelSell"].includes(action)) return;

  const user = getCurrentUser();
  if (!user) return;

  try {
    await ensureGameplaySeasonAlignedOrThrow();
  } catch (e) {
    setMessage(app.els.pickMessage, e instanceof Error ? e.message : "対戦月の確認に失敗しました。", true);
    return;
  }

  const rlTbl = getClientRateLimitMessageIfRejected(
    "pickAction",
    CONFIG.clientRatePickActionMax,
    CONFIG.clientRatePickActionWindowMs
  );
  if (rlTbl) {
    setMessage(app.els.pickMessage, rlTbl, true);
    return;
  }

  const pickId = target.dataset.pickId;
  if (!pickId) return;

  if (action === "remove") {
    const pick = (user.picks || []).find((p) => p.id === pickId);
    if (pick && pick.status === "CLOSED") return;
    if (pick && !pick.entryPending && !pick.sellPending) {
      setMessage(app.els.pickMessage, "保有中は削除できません。", true);
      return;
    }
    if (pick) {
      const copy = { ...pick };
      app.pickUndoStack = (app.pickUndoStack || []).slice(-19);
      app.pickUndoStack.push(copy);
    }
    user.picks = (user.picks || []).filter((p) => p.id !== pickId);
    user.needsPickConfirm = true;
    user.pickListModified = true;
    user.updatedAt = new Date().toISOString();
    saveState();
    setMessage(app.els.pickMessage, "銘柄を削除しました。「一つ戻る」で元に戻せます。", false);
    renderAll();
    return;
  }

  if (action === "cancelSell") {
    const pick = (user.picks || []).find((p) => p.id === pickId);
    if (pick && pick.sellPending) {
      pick.sellPending = false;
      pick.sellOrderDate = null;
      pick.sellOrderSlot = null;
      user.needsPickConfirm = true;
      user.pickListModified = true;
      user.updatedAt = new Date().toISOString();
      saveState();
      setMessage(app.els.pickMessage, "売却予約を取消しました。", false);
      renderAll();
    }
    return;
  }

  try {
    setBusy(true);
    await sellPickForCurrentUser(pickId);
    user.needsPickConfirm = true;
    user.pickListModified = true;
    user.updatedAt = new Date().toISOString();
    saveState();
    setMessage(app.els.pickMessage, "売却注文を記録しました。", false);
    renderAll();
  } catch (error) {
    setMessage(app.els.pickMessage, normalizeErrorMessage(error), true);
  } finally {
    setBusy(false);
  }
}

async function onReportTableAction(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const action = target.dataset.action;
  if (action !== "delete-reported") return;
  const actor = getCurrentUser();
  if (!actor) {
    setMessage(app.els.reportMessage, "ログインしてください。", true);
    return;
  }
  try {
    await rollSeasonIfNeeded();
  } catch (_) {}
  const userId = target.dataset.userId;
  if (!userId) return;
  const season = app.state.currentSeason || getSeasonKeyJst(new Date());
  const count = (app.state.reports || []).filter((r) => r.season === season && r.targetUserId === userId).length;
  if (count < CONFIG.reportDeleteThreshold) {
    setMessage(app.els.reportMessage, `削除は通報が${CONFIG.reportDeleteThreshold}件以上必要です。`, true);
    return;
  }

  if (!confirm("このアカウントを削除します。よろしいですか？")) return;
  hardDeleteUser(userId);
  setMessage(app.els.reportMessage, "アカウントを削除しました。", false);
  renderAll();
}

function rankReportTradesTooLarge(row) {
  const n = Array.isArray(row?.trades) ? row.trades.length : 0;
  return n >= 7;
}

function closeAllRankMenuPanels() {
  document.querySelectorAll(".rank-menu-panel").forEach((el) => el.classList.add("hidden"));
  document.querySelectorAll(".rank-menu-report-btn, .rank-menu-unreport-btn").forEach((el) => el.classList.add("hidden"));
  document.querySelectorAll(".rank-menu-dropdown").forEach((el) => el.classList.add("hidden"));
  if (app.rankMenuAutoCloseTimer) {
    clearTimeout(app.rankMenuAutoCloseTimer);
    app.rankMenuAutoCloseTimer = 0;
  }
}

function onLiveRankBodyClick(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const openBtn = target.closest("button[data-action='open-rank-report']");
  if (openBtn instanceof HTMLButtonElement) {
    event.preventDefault();
    event.stopPropagation();
    closeAllRankMenuPanels();
    const body = event.currentTarget;
    const tr = openBtn.closest("tr");
    if (!tr) return;
    const season = tr.dataset.season;
    const rowIndex = parseInt(tr.dataset.rowIndex || "", 10);
    if (Number.isNaN(rowIndex)) return;
    let row;
    if (body && body.id === "liveRankBody") {
      row = buildLiveRanking()[rowIndex];
    } else {
      const targetSeason = (app.state.rankings || []).find((x) => x.season === season);
      row = targetSeason?.rows?.[rowIndex];
    }
    if (!row) return;
    if (rankReportTradesTooLarge(row)) {
      showGlobalNotice("取引件数が多いため、このレポートの詳細表示・PDFは利用できません。", true);
      return;
    }
    openRankReportModal(row, season);
    return;
  }
  const trigger = target.closest(".rank-menu-trigger");
  if (trigger instanceof HTMLButtonElement) {
    event.stopPropagation();
    const wrap = trigger.closest(".rank-menu-wrap");
    const panel = wrap?.querySelector(".rank-menu-panel");
    const menuBtns = wrap?.querySelectorAll(".rank-menu-report-btn, .rank-menu-unreport-btn");
    const wasOpen = Boolean(panel && !panel.classList.contains("hidden"));
    document.querySelectorAll(".rank-menu-wrap").forEach((w) => {
      if (w === wrap) return;
      w.querySelectorAll(".rank-menu-panel").forEach((el) => el.classList.add("hidden"));
      w.querySelectorAll(".rank-menu-report-btn, .rank-menu-unreport-btn").forEach((el) => el.classList.add("hidden"));
      w.querySelectorAll(".rank-menu-dropdown").forEach((el) => el.classList.add("hidden"));
    });
    if (wasOpen) {
      panel?.classList.add("hidden");
      menuBtns?.forEach((el) => el.classList.add("hidden"));
      if (app.rankMenuAutoCloseTimer) {
        clearTimeout(app.rankMenuAutoCloseTimer);
        app.rankMenuAutoCloseTimer = 0;
      }
    } else {
      panel?.classList.remove("hidden");
      menuBtns?.forEach((el) => el.classList.remove("hidden"));
      if (app.rankMenuAutoCloseTimer) clearTimeout(app.rankMenuAutoCloseTimer);
      app.rankMenuAutoCloseTimer = setTimeout(() => {
        closeAllRankMenuPanels();
      }, 10000);
    }
    return;
  }
  const unreportBtn = target.closest("button[data-action='unreport-rank']");
  if (unreportBtn instanceof HTMLButtonElement) {
    const userId = unreportBtn.dataset.userId;
    const reporter = getCurrentUser();
    if (userId && reporter) {
      closeAllRankMenuPanels();
      void (async () => {
        try {
          await removeReportByReporter(reporter.id, userId);
          showGlobalNotice("通報を解除しました。", false);
          renderAll();
        } catch (error) {
          showGlobalNotice(error instanceof Error ? error.message : "解除に失敗しました。", true);
        }
      })();
    }
    return;
  }
  const btn = target.closest("button[data-action='report-rank']");
  if (btn instanceof HTMLButtonElement) {
    const userId = btn.dataset.userId;
    const reporter = getCurrentUser();
    if (userId) {
      closeAllRankMenuPanels();
      if (reporter && userId === reporter.id) {
        showGlobalNotice("自分自身は通報できません。", true);
        return;
      }
      app.pendingReportUserId = userId;
      if (app.els.reportReasonModal) {
        app.els.reportReasonModal.classList.remove("hidden");
        app.els.reportReasonModal.setAttribute("aria-hidden", "false");
      }
    }
  }
}

function onRankRowContextMenu(event) {
  event.preventDefault();
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (target.closest(".rank-menu-wrap")) return;
  const tr = target.closest("tr");
  if (!tr || !tr.dataset.userId) return;
  const season = tr.dataset.season;
  const rowIndex = parseInt(tr.dataset.rowIndex, 10);
  if (Number.isNaN(rowIndex)) return;
  const body = event.currentTarget;
  let row;
  if (body && body.id === "liveRankBody") {
    const ranking = buildLiveRanking();
    row = ranking[rowIndex];
  } else {
    const targetSeason = (app.state.rankings || []).find((x) => x.season === season);
    row = targetSeason?.rows?.[rowIndex];
  }
  if (!row) return;
  const tradesCount = Array.isArray(row.trades) ? row.trades.length : 0;
  // 取引が多い場合はモーダル表示を抑止してレイアウト崩れを防ぐ。
  if (tradesCount >= 7) {
    if (!app.rankReportLargeTradesBlocked) {
      app.rankReportLargeTradesBlocked = true;
      showGlobalNotice("取引件数が多いため、このレポートの詳細・PDFは表示しません（「詳細」ボタンも同様です）。", true);
    }
    return;
  }
  openRankReportModal(row, season);
}

function openRankReportModal(row, season) {
  app.rankReportCurrent = { row, season };
  const displayName = escapeHtml(row.displayName || row.name || "-");
  const seasonLabel = formatSeasonLabel(season);
  if (app.els.rankReportTitle) app.els.rankReportTitle.textContent = `${row.displayName || row.name || "-"} のレポート（${seasonLabel}）`;
  const curSeason = app.state.currentSeason || getSeasonKeyJst(new Date());
  const metaKind = String(season) === String(curSeason) ? "今月暫定ランキング" : "確定ランキング（過去月）";
  if (app.els.rankReportMeta) {
    app.els.rankReportMeta.textContent = `${seasonLabel} のリターン: ${formatPct(row.returnPct)}（${metaKind}）`;
  }
  const resultEl = document.querySelector("#rankReportModal .rank-report-result");
  if (resultEl) resultEl.textContent = "";
  const body = app.els.rankReportBody;
  if (!body) return;
  body.innerHTML = "";
  const trades = Array.isArray(row.trades) ? row.trades : [];
  for (const t of trades) {
    const tr = document.createElement("tr");
    const name = getSymbolDisplayName(t.symbol);
    const statusOrSell = t.exitDate && t.exitDate !== "-" ? t.exitDate : "保有";
    const pctClass = t.returnPct > 0 ? "pct-up" : t.returnPct < 0 ? "pct-down" : "pct-flat";
    tr.innerHTML = `
      <td>${escapeHtml(name)}</td>
      <td>${escapeHtml(t.entryDate || "-")}</td>
      <td>${escapeHtml(statusOrSell)}</td>
      <td class="${pctClass}">${formatPct(t.returnPct)}</td>
    `;
    body.appendChild(tr);
  }
  if (app.els.rankReportModal) {
    app.els.rankReportModal.classList.remove("hidden");
    app.els.rankReportModal.setAttribute("aria-hidden", "false");
  }
}

function closeRankReportModal() {
  app.rankReportCurrent = null;
  if (app.els.rankReportModal) {
    app.els.rankReportModal.classList.add("hidden");
    app.els.rankReportModal.setAttribute("aria-hidden", "true");
  }
}

function onRankReportPdfClick() {
  const cur = app.rankReportCurrent;
  if (!cur || !cur.row || !app.els.rankReportBody) return;
  const { row, season } = cur;
  const trades = Array.isArray(row.trades) ? row.trades : [];
  const getPdfPctColor = (v) => {
    if (typeof v !== "number" || !Number.isFinite(v)) return "#ffffff";
    if (v > 0) return "#d13232";
    if (v < 0) return "#0d47a1";
    return "#ffffff";
  };
  const rowsHtml = trades.map((t) => {
    const name = getSymbolDisplayName(t.symbol);
    const statusOrSell = t.exitDate && t.exitDate !== "-" ? t.exitDate : "保有";
    const pctText = formatPct(t.returnPct);
    const pctColor = getPdfPctColor(t.returnPct);
    return `<tr><td>${escapeHtml(name)}</td><td>${escapeHtml(t.entryDate || "-")}</td><td>${escapeHtml(statusOrSell)}</td><td><span style="color: ${pctColor}; font-weight: 700;">${escapeHtml(pctText)}</span></td></tr>`;
  }).join("");
  const safeName = String(row.displayName || row.name || "ranking").replace(/[<>"&]/g, "");
  const title = `売買履歴・成果_${safeName}_${season}`;
  const curSeasonPdf = app.state.currentSeason || getSeasonKeyJst(new Date());
  const pdfMetaKind = String(season) === String(curSeasonPdf) ? "今月暫定ランキング" : "確定ランキング（過去月）";
  const htmlContent = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <style>
    body { font-family: "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif; margin: 28px; color: #0e2a2b; }
    .head { border-bottom: 3px solid #0d8f8d; margin-bottom: 18px; padding-bottom: 10px; }
    h1 { margin: 0; font-size: 24px; }
    .meta { color: #3e6061; margin-top: 8px; font-size: 13px; }
    .result-line { font-size: 18px; font-weight: 700; margin: 12px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 14px; }
    th, td { border: 1px solid #cfe0df; padding: 8px 10px; font-size: 12px; text-align: left; }
    th { background: #edf7f6; }
    .foot { margin-top: 18px; color: #48696a; font-size: 12px; }
  </style>
</head>
<body>
  <div class="head">
    <h1>株のタカ 🦅 売買履歴・成果</h1>
    <div class="meta">${escapeHtml(row.displayName || row.name || "-")} ／ ${formatSeasonLabel(season)} ${escapeHtml(pdfMetaKind)}</div>
    <div class="result-line">${formatSeasonLabel(season)} のリターン: <span style="color: ${getPdfPctColor(row.returnPct)};">${formatPct(row.returnPct)}</span></div>
  </div>
  <table>
    <thead><tr><th>銘柄</th><th>取得日</th><th>状態／売却日</th><th>損益</th></tr></thead>
    <tbody>${rowsHtml}</tbody>
  </table>
  <div class="foot">先月のランキング</div>
</body>
</html>`;
  let printFrame = document.getElementById("printFrame");
  if (!printFrame) {
    printFrame = document.createElement("iframe");
    printFrame.id = "printFrame";
    printFrame.setAttribute("aria-hidden", "true");
    printFrame.style.cssText = "position:absolute;width:0;height:0;border:0;visibility:hidden;";
    document.body.appendChild(printFrame);
  }
  const win = printFrame.contentWindow;
  if (!win) return;
  win.document.open();
  win.document.write(htmlContent);
  win.document.close();
  try {
    win.focus();
    win.print();
  } catch (_) {}
}

function onDocumentClick(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const clickedSuggest = target.closest("#symbolSuggestList") || target.closest("#symbolInput");
  if (!clickedSuggest) {
    hideSymbolSuggestions();
  }
  if (!target.closest(".rank-menu-wrap")) {
    closeAllRankMenuPanels();
  }

  // 「取引内容」を開いた/閉じた時にテーブル全体の横スクロールへ切り替える
  const details = target.closest("details.rank-trade-details");
  if (details) {
    // details の open 反映後に判定したいのでマイクロタスクで遅延
    queueMicrotask(() => {
      const table = details.closest("table");
      if (!table) return;
      const anyOpen = Boolean(table.querySelector("details.rank-trade-details[open]"));
      table.classList.toggle("rank-table--trade-expanded", anyOpen);
    });
  }
}

async function loadJpCompanyMaster() {
  if (app.jpSuggestEngine != null) return;
  if (typeof window.StockgameJpAutocomplete === "undefined" || typeof window.StockgameJpAutocomplete.createEngine !== "function") return;
  try {
    const res = await fetch("./company_master.json");
    if (!res.ok) return;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return;
    app.jpCompanyMaster = data;
    app.jpSuggestEngine = window.StockgameJpAutocomplete.createEngine(data);
  } catch (_) {
    app.jpCompanyMaster = null;
    app.jpSuggestEngine = null;
    app.jpMasterLoadFailed = true;
    if (typeof showGlobalNotice === "function") showGlobalNotice("銘柄マスタ(company_master.json)の読込に失敗しました。銘柄名がシンボル表示になる場合があります。", true);
  }
}

function getSymbolSuggestDebounceMs() {
  try {
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 720px)").matches) {
      return CONFIG.symbolSuggestDebounceMsMobile;
    }
  } catch (_) {}
  return CONFIG.symbolSuggestDebounceMsDesktop;
}

function onSymbolInputInput() {
  // 空欄に戻したときは、市場タイプを「自動判定」に戻す。
  // ただし空欄の状態でユーザーが市場を手動変更するのは許可するため、
  // 「空欄への遷移」が起きたときだけ戻す（常時上書きしない）。
  const isEmpty = !app.els.symbolInput.value.trim();
  if (isEmpty && app.symbolInputWasEmpty !== true) {
    app.symbolSuggestFreezeUntilEdit = false;
    app.symbolSuggestFreezeBaseline = "";
    app.els.marketType.value = "AUTO";
    app.addPickBtnJustAdded = false;
    void updateSymbolSuggestions();
    if (app.lastPreview?.symbol) setChartLinkContext(app.lastPreview.symbol, app.lastPreview.market);
    else clearChartLinkContext();
    renderAll();
  }
  app.symbolInputWasEmpty = isEmpty;

  if (app.symbolSuggestTimer) {
    clearTimeout(app.symbolSuggestTimer);
  }
  app.symbolSuggestTimer = window.setTimeout(() => {
    void updateSymbolSuggestions();
  }, getSymbolSuggestDebounceMs());
}

function onSymbolInputKeydown(event) {
  if (event.key === "Escape") {
    hideSymbolSuggestions();
  }
  if (event.key === "Enter" && !app.els.symbolSuggestList.classList.contains("hidden")) {
    const first = app.els.symbolSuggestList.querySelector("button[data-action='apply-suggest']");
    if (first instanceof HTMLButtonElement) {
      event.preventDefault();
      first.click();
    }
  }
}

function onSymbolSuggestClick(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const button = target.closest("button[data-action='apply-suggest']");
  if (!(button instanceof HTMLButtonElement)) return;

  const symbol = button.dataset.symbol || "";
  const market = button.dataset.market || "AUTO";
  if (!symbol) return;
  if (app.symbolSuggestTimer) {
    clearTimeout(app.symbolSuggestTimer);
    app.symbolSuggestTimer = 0;
  }
  app.els.symbolInput.value = symbol;
  if (market === "JP" || market === "US" || market === "CRYPTO") {
    app.els.marketType.value = market;
  }
  hideSymbolSuggestions();
  app.symbolSuggestFreezeUntilEdit = true;
  app.symbolSuggestFreezeBaseline = sanitizePickInput(app.els.symbolInput.value);
  app.els.symbolInput.focus();
  app.addPickBtnJustAdded = false;
  updateActionAvailability();
  app.symbolInputWasEmpty = !app.els.symbolInput.value.trim();
  const symU = symbol.toUpperCase();
  const mkt = market === "JP" || market === "US" || market === "CRYPTO" ? market : inferMarketFromKnownSymbol(symU);
  setChartLinkContext(symU, mkt);
}

function getJpDisplayName(symbol) {
  if (!symbol) return null;
  if (app.jpSuggestEngine) {
    const row = app.jpSuggestEngine.findBySymbol(symbol);
    if (row) return row.name;
  }
  if (Array.isArray(app.jpCompanyMaster)) {
    const key = String(symbol).toUpperCase().trim();
    const found = app.jpCompanyMaster.find(
      (r) => (r.symbol && String(r.symbol).toUpperCase() === key) ||
        (r.code && String(r.code).trim() === key.replace(/\.T$/i, ""))
    );
    if (found) return found.name || found.銘柄名 || found.company || null;
  }
  return null;
}

/** quoteName がシンボル/コードのみの場合は getJpDisplayName を優先。米国株は Yahoo の社名（longName）を優先 */
function pickBestDisplayName(symbol, market, quoteName, nameGuess) {
  const sym = String(symbol || "").trim();
  const qRaw = quoteName != null && String(quoteName).trim() !== "" ? String(quoteName).trim() : "";
  const codeLikeJp =
    market === "JP" &&
    (!qRaw || qRaw === sym || /^\d{4}\.T$/i.test(qRaw) || /^\d{4}$/.test(String(qRaw).replace(/\.T$/i, "")));
  if (codeLikeJp) {
    const jpName = getJpDisplayName(sym);
    if (jpName) return jpName;
  }
  if ((market === "US" || market === "CRYPTO") && qRaw) {
    if (qRaw.toUpperCase() !== sym.toUpperCase()) return qRaw;
    if (qRaw.includes(" ") || qRaw.length > 8) return qRaw;
  }
  return qRaw || (market === "JP" ? getJpDisplayName(sym) : null) || nameGuess || sym;
}

/** ランキング・履歴用: シンボルから表示名を取得（キャッシュの Yahoo 社名を利用可） */
function getSymbolDisplayName(symbol) {
  if (!symbol) return "";
  const s = String(symbol).trim();
  const sNoT = s.replace(/\.T$/i, "");
  const preset =
    symbolPresetMap.get(s)?.name ||
    symbolPresetMap.get(s + ".T")?.name ||
    symbolPresetMap.get(s + "-USD")?.name;
  if (preset) return preset;
  const jp = getJpDisplayName(s) || getJpDisplayName(sNoT);
  if (jp) return jp;
  try {
    const q = app?.state?.apiCache?.quote?.[s]?.data;
    const nm = q && q.name != null ? String(q.name).trim() : "";
    if (nm && nm !== s && nm.toUpperCase() !== s.toUpperCase()) return nm;
  } catch (_) {}
  return s;
}

/** マイページ・ランキング: 銘柄表示名（pick に保存された表示名＋APIキャッシュで米国株の社名を補完） */
function resolvePickDisplayName(p) {
  if (!p) return "";
  const sym = p.symbol || "";
  const fromPick = (p.displayName && String(p.displayName).trim()) || "";
  try {
    const q = app?.state?.apiCache?.quote?.[sym]?.data;
    const qn = q && q.name != null ? String(q.name).trim() : "";
    if (qn) {
      const merged = pickBestDisplayName(sym, p.market, qn, fromPick || null);
      if (merged) return merged;
    }
  } catch (_) {}
  return fromPick || getSymbolDisplayName(sym) || sym;
}

function isCompleteSymbolForm(query) {
  const q = query.trim().toUpperCase();
  if (/^\.T$/.test(q)) return true;
  return /^\d{4}\.T$/.test(q) || /^\d{3}[A-Z]\.T$/.test(q);
}

async function updateSymbolSuggestions() {
  const query = sanitizePickInput(app.els.symbolInput.value);
  if (app.symbolSuggestFreezeUntilEdit) {
    const base = sanitizePickInput(app.symbolSuggestFreezeBaseline || "");
    if (query === base) {
      hideSymbolSuggestions();
      return;
    }
    app.symbolSuggestFreezeUntilEdit = false;
    app.symbolSuggestFreezeBaseline = "";
  }
  if (!query) {
    hideSymbolSuggestions();
    return;
  }
  if (isCompleteSymbolForm(query)) {
    hideSymbolSuggestions();
    return;
  }

  const marketType = app.els.marketType.value;
  const requestId = ++app.symbolSuggestRequestId;
  let local = buildLocalSymbolSuggestions(query, marketType, 8);
  if ((marketType === "JP" || marketType === "AUTO") && app.jpSuggestEngine) {
    const jpRows = app.jpSuggestEngine.suggest(query, { marketType, limit: 10 });
    const jpForMerge = jpRows.map((r) => ({
      symbol: r.symbol,
      market: r.market || "JP",
      nameGuess: r.nameGuess || (r.displayName && r.code ? `${r.displayName} (${r.code})` : r.symbol)
    }));
    local = mergeSymbolSuggestions(jpForMerge, local, 10);
  }
  let remote = [];

  const hasJpMasterResults = (marketType === "JP" || marketType === "AUTO") && app.jpSuggestEngine && local.length >= 1;
  const skipRemote = hasJpMasterResults || ((marketType === "JP" || marketType === "AUTO") && local.length >= 8);
  if (!skipRemote && query.length >= 3) {
    try {
      remote = await searchSymbolsByName(query, marketType, 8);
      if (!remote.length) {
        const kanaQuery = hiraToKatakana(query);
        if (kanaQuery !== query) {
          remote = await searchSymbolsByName(kanaQuery, marketType, 8);
        }
      }
    } catch (error) {
      remote = [];
    }
  }

  if (requestId !== app.symbolSuggestRequestId) return;
  const merged = mergeSymbolSuggestions(local, remote, 10);
  renderSymbolSuggestions(merged);
}

function buildLocalSymbolSuggestions(query, marketType, limit) {
  const key = normalizeSearchKey(query);
  if (!key) return [];
  const out = [];
  const seen = new Set();

  for (const preset of SYMBOL_PRESETS) {
    if (!isMarketAllowed(preset.market, marketType)) continue;
    const fields = [preset.symbol, preset.name, ...(preset.aliases || [])]
      .map((s) => normalizeSearchKey(s));
    if (!fields.some((f) => f.includes(key))) continue;
    if (seen.has(preset.symbol)) continue;

    out.push({
      symbol: preset.symbol,
      market: preset.market,
      nameGuess: preset.name
    });
    seen.add(preset.symbol);
    if (out.length >= limit) break;
  }
  return out;
}

function mergeSymbolSuggestions(local, remote, limit) {
  const out = [];
  const seen = new Set();
  for (const item of [...local, ...remote]) {
    const symbol = String(item?.symbol || "").toUpperCase();
    const market = normalizeMarket(item?.market, item?.symbol || symbol);
    if (!symbol || seen.has(symbol)) continue;
    out.push({
      symbol,
      market,
      nameGuess: String(item?.nameGuess || item?.name || symbol)
    });
    seen.add(symbol);
    if (out.length >= limit) break;
  }
  return out;
}

function renderSymbolSuggestions(list) {
  if (!Array.isArray(list) || !list.length) {
    hideSymbolSuggestions();
    return;
  }
  app.els.symbolSuggestList.innerHTML = list
    .map((item) => {
      const symbol = escapeHtml(item.symbol);
      const market = escapeHtml(item.market);
      const name = escapeHtml(item.nameGuess || item.symbol);
      return `
        <button type="button" class="suggest-item" data-action="apply-suggest" data-symbol="${symbol}" data-market="${market}">
          <span class="suggest-name">${name}</span>
          <span class="suggest-meta suggest-meta--market">${symbol} / ${escapeHtml(marketLabel(item.market))}</span>
        </button>
      `;
    })
    .join("");
  app.els.symbolSuggestList.classList.remove("hidden");
}

function hideSymbolSuggestions() {
  app.els.symbolSuggestList.innerHTML = "";
  app.els.symbolSuggestList.classList.add("hidden");
}

function renderTradeDetails(trades) {
  const safeTrades = Array.isArray(trades) ? trades : [];
  return renderTradeDetailsBlock(safeTrades);
}

function renderTradeDetailsBlock(safeTrades) {
  if (!safeTrades.length) {
    return `<span class="rank-note">履歴なし</span>`;
  }
  const n = safeTrades.length;
  const listItems = safeTrades.map((t) => {
    const name = getSymbolDisplayName(t.symbol);
    const entryStr = t.entryPrice != null ? formatPrice(t.entryPrice, t.market) : "-";
    const exitStr = t.exitPrice != null ? formatPrice(t.exitPrice, t.market) : (t.exitDate && t.exitDate !== "-" ? t.exitDate : "保有");
    const pctClass = t.returnPct > 0 ? "pct-up" : t.returnPct < 0 ? "pct-down" : "pct-flat";
    return `<li class="rank-trade-inline-item">
      <span class="rank-trade-line rank-trade-line--name"><span class="rank-trade-name">${escapeHtml(name)}</span></span>
      <span class="rank-trade-line rank-trade-line--kv">購入：${escapeHtml(entryStr)}</span>
      <span class="rank-trade-line rank-trade-line--kv">現在/売却：${escapeHtml(exitStr)}</span>
      <span class="rank-trade-line rank-trade-line--pct ${pctClass}">${escapeHtml(formatPct(t.returnPct))}</span>
    </li>`;
  }).join("");
  return `
    <details class="rank-trade-details">
      <summary class="rank-trade-summary"><span class="rank-trade-summary__label">取引内容</span><span class="rank-trade-summary__count">（${n}）</span><span class="rank-trade-summary__hint"> — 「詳細」で確認・PDF保存（PCは行の右クリックでも可）</span></summary>
      <ul class="rank-trade-inline-list">${listItems}</ul>
    </details>
  `;
}

async function refreshDailyPricesIfNeeded() {
  const today = getDateKeyJst(new Date());
  if (app.state.lastDailyRefreshDate === today) return;
  await refreshAllUsersLatest(false);
  app.state.lastDailyRefreshDate = today;
  app.state.lastRankUpdateAt = new Date().toISOString();
  saveState();
}

function buildReportStats() {
  const targetMap = new Map();
  const season = app.state.currentSeason || getSeasonKeyJst(new Date());
  for (const user of getActiveUsers()) {
    targetMap.set(user.id, {
      userId: user.id,
      displayName: getDisplayName(user),
      count: 0,
      statusText: "未通報"
    });
  }
  for (const report of app.state.reports || []) {
    if (report.season !== season) continue;
    const item = targetMap.get(report.targetUserId);
    if (!item) continue;
    item.count += 1;
  }
  for (const item of targetMap.values()) {
    if (!item || item.count <= 0) continue;
    if (item.count >= CONFIG.reportDeleteThreshold) item.statusText = "削除段階";
    else if (item.count >= CONFIG.reportAliasThreshold) item.statusText = "通報で匿名表示";
    else item.statusText = "通報あり";
  }
  return [...targetMap.values()]
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count || a.displayName.localeCompare(b.displayName, "ja"));
}

function isOlderThanHours(isoString, hours) {
  if (!isoString || typeof isoString !== "string") return false;
  const t = new Date(isoString).getTime();
  if (Number.isNaN(t)) return false;
  return Date.now() - t >= hours * 60 * 60 * 1000;
}

function canReport(reporter) {
  if (!reporter) return false;
  if (!isOlderThanHours(reporter.createdAt, 24)) return false;
  const snap = getPicksForRankingSnapshot(reporter);
  const hasConfirmedPick = snap.some((p) => !p.entryPending && p.entryPrice != null);
  return hasConfirmedPick;
}

async function reportUser(targetUserId, reason) {
  await ensureGameplaySeasonAlignedOrThrow();
  const reporter = getCurrentUser();
  if (!reporter) throw new Error("ログイン後に通報できます。");
  const rlRep = getClientRateLimitMessageIfRejected(
    "report",
    CONFIG.clientRateReportMax,
    CONFIG.clientRateReportWindowMs
  );
  if (rlRep) throw new Error(rlRep);
  if (!canReport(reporter)) {
    throw new Error("通報するには、アカウント作成から24時間経過し、かつ確定済みの銘柄が1件以上必要です。");
  }

  const target = app.state.users.find((u) => u.id === targetUserId);
  if (!target || target.isDeleted) throw new Error("指定のユーザーが見つかりません。");
  if (target.id === reporter.id) throw new Error("自分自身は通報できません。");

  const todayKey = getDateKeyJst(new Date());
  const reportsToday = (app.state.reports || []).filter((r) => {
    if (r.reporterId !== reporter.id) return false;
    return getDateKeyJst(new Date(r.createdAt)) === todayKey;
  });
  if (reportsToday.length >= 2) {
    throw new Error("通報は1日2回までです。");
  }

  const season = app.state.currentSeason || getSeasonKeyJst(new Date());
  const already = (app.state.reports || []).find((r) => r.season === season && r.targetUserId === targetUserId && r.reporterId === reporter.id);
  if (already) throw new Error("今月はすでにこのユーザーを通報済みです。");

  const usedReporterAliases = new Set(
    (app.state.reports || []).filter((r) => r.reporterId === reporter.id && r.season === season).map((r) => r.aliasForReporter).filter(Boolean)
  );
  let aliasForReporter = generateAnimalAlias();
  let aliasGuard = 0;
  while (usedReporterAliases.has(aliasForReporter) && aliasGuard < 48) {
    aliasForReporter = generateAnimalAlias();
    aliasGuard += 1;
  }
  if (usedReporterAliases.has(aliasForReporter)) {
    aliasForReporter = "\u901a\u5831" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  const reasonSafe = sanitizeFreeTextForStorage(reason, CONFIG.maxReportReasonLength);
  app.state.reports.push({
    id: createId("rep"),
    season,
    targetUserId,
    reporterId: reporter.id,
    reason: reasonSafe.trim() ? reasonSafe : "ランキングから通報",
    aliasForReporter,
    createdAt: new Date().toISOString()
  });
  applyReportModeration(targetUserId);
  saveState();
}

async function removeReportByReporter(reporterId, targetUserId) {
  await rollSeasonIfNeeded();
  const rlUnrep = getClientRateLimitMessageIfRejected(
    "report",
    CONFIG.clientRateReportMax,
    CONFIG.clientRateReportWindowMs
  );
  if (rlUnrep) throw new Error(rlUnrep);
  const season = app.state.currentSeason || getSeasonKeyJst(new Date());
  app.state.reports = (app.state.reports || []).filter(
    (r) => !(r.season === season && r.targetUserId === targetUserId && r.reporterId === reporterId)
  );
  applyReportModeration(targetUserId);
  saveState();
}

function applyReportModeration(targetUserId) {
  const user = app.state.users.find((u) => u.id === targetUserId);
  if (!user || user.isDeleted) return;

  const season = app.state.currentSeason || getSeasonKeyJst(new Date());
  const count = (app.state.reports || []).filter((r) => r.season === season && r.targetUserId === targetUserId).length;
  if (count >= CONFIG.reportAliasThreshold) {
    if (!user.aliasName) user.aliasName = generateAnimalAlias();
  } else {
    user.aliasName = "";
  }
  if (count >= CONFIG.reportDeleteThreshold) {
    hardDeleteUser(targetUserId);
  }
}

function generateAnimalAlias() {
  const withAlias = (app.state.users || []).filter((u) => u.aliasName && String(u.aliasName).trim());
  if (withAlias.length >= 20) {
    const usedNumbers = new Set();
    withAlias.forEach((u) => {
      const m = String(u.aliasName).match(/^\u30ad\u30ea\u30f3(\d+)$/);
      if (m) usedNumbers.add(Number(m[1]));
    });
    let n = 1;
    while (usedNumbers.has(n)) n += 1;
    return "\u30ad\u30ea\u30f3" + n;
  }
  const used = new Set(withAlias.map((u) => u.aliasName));
  const pool = ANIMAL_ALIASES.filter((a) => !used.has(a));
  const base = pool.length ? pool[Math.floor(Math.random() * pool.length)] : ANIMAL_ALIASES[Math.floor(Math.random() * ANIMAL_ALIASES.length)];
  return base;
}

function seasonFromDateKey(dateKey) {
  return String(dateKey || "").slice(0, 7);
}

function removeUserSecurityLocksByNameKey(nameKey) {
  if (!nameKey || !app?.state?.security) return;
  delete app.state.security.failed?.[nameKey];
  delete app.state.security.lockUntil?.[nameKey];
  delete app.state.security.lockCount?.[nameKey];
}

function purgeUserCompletely(userId) {
  if (!userId) return;
  const user = (app.state.users || []).find((u) => u && u.id === userId);
  const userNameKey = user?.nameKey;
  if (user) releaseDeviceSeasonSlotForDeletedUser(user);

  app.state.users = (app.state.users || []).filter((u) => u.id !== userId);

  app.state.rankings = (app.state.rankings || [])
    .map((r) => ({
      ...r,
      rows: (r.rows || []).filter((row) => row.userId !== userId)
    }))
    .filter((r) => (r.rows || []).length > 0);

  app.state.reports = (app.state.reports || []).filter(
    (r) => r.targetUserId !== userId && r.reporterId !== userId
  );

  if (app.pickDraftByUser instanceof Map) app.pickDraftByUser.delete(userId);
  if (app.pendingReportUserId === userId) app.pendingReportUserId = null;

  if (app.sessionUserId === userId || app.state.sessionUserId === userId) {
    const supaTokenSnap = getSupabaseSessionToken();
    app.sessionUserId = null;
    app.state.sessionUserId = null;
    clearSupabaseSessionToken();
    if (supaTokenSnap) void notifySupabaseLogoutBestEffort(supaTokenSnap);
    app.pickUndoStack = [];
    if (typeof showPreview === "function") showPreview(null);
  }

  if (userNameKey) removeUserSecurityLocksByNameKey(userNameKey);
}

const MAX_TRADES_PER_SEASON = 40;

function countMonthlyTradeActions(user, season) {
  const s = season || (app?.state?.currentSeason || getSeasonKeyJst(new Date()));
  const picks = user?.picks || [];
  let count = 0;
  for (const pick of picks) {
    if (seasonFromDateKey(pick.orderDate) === s) count += 1;
    if (seasonFromDateKey(pick.sellOrderDate) === s) count += 1;
  }
  return count;
}

function enforceMonthlyTradeLimit(user, nextTrades = 1) {
  const season = app?.state?.currentSeason || getSeasonKeyJst(new Date());
  const used = countMonthlyTradeActions(user, season);
  if (used + nextTrades > MAX_TRADES_PER_SEASON) {
    throw new Error(`今月の取引は${MAX_TRADES_PER_SEASON}回までです。来月までお待ちください。`);
  }
}

function hardDeleteUser(userId) {
  purgeUserCompletely(userId);
  saveState();
}

/** Yahoo Finance のチャートページ（別タブ）。iframe 埋め込みや当サイトからの取得は行わない。 */
function buildYahooFinanceChartUrl(symbol) {
  const s = String(symbol || "").trim();
  if (!s) return "";
  return `https://finance.yahoo.com/chart/${encodeURIComponent(s)}`;
}

function setChartLinkContext(symbol, market) {
  const sym = String(symbol || "").trim().toUpperCase();
  if (!sym) {
    clearChartLinkContext();
    return;
  }
  app.chartLinkContext = {
    symbol: sym,
    market: market && market !== "AUTO" ? market : inferMarketFromKnownSymbol(sym)
  };
  if (app.els.chartExternalBtn) app.els.chartExternalBtn.classList.remove("hidden");
}

function clearChartLinkContext() {
  app.chartLinkContext = null;
  if (app.els.chartExternalBtn) app.els.chartExternalBtn.classList.add("hidden");
}

function onChartExternalClick() {
  const sym = app.chartLinkContext?.symbol || app.lastPreview?.symbol || "";
  if (!sym) {
    setMessage(
      app.els.pickMessage,
      "先に銘柄を検索候補から選ぶか、「現在値を確認」で銘柄を確定してください。",
      true
    );
    return;
  }
  const url = buildYahooFinanceChartUrl(sym);
  window.open(url, "_blank", "noopener,noreferrer");
}

function showPreview(preview) {
  if (!preview) {
    app.els.previewCard.classList.add("hidden");
    app.lastPreview = null;
    clearChartLinkContext();
    return;
  }

  app.lastPreview = preview;
  app.els.previewCard.classList.remove("hidden");
  const displayName = pickBestDisplayName(preview.symbol, preview.market, preview.name, preview.nameGuess || preview.symbol);
  app.els.previewName.textContent = displayName;
  app.els.previewSymbol.textContent = ` / ${preview.symbol} / ${marketLabel(preview.market)}`;
  app.els.previewPrice.textContent = preview.price != null ? formatPrice(preview.price, preview.market) : (preview.failReason || "取得中...");
  app.els.previewAsOf.textContent = preview.asOfMs ? `(${formatDateTimeJst(preview.asOfMs)})` : "";
  setChartLinkContext(preview.symbol, preview.market);
}

function enforceRegistrationRateLimit() {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const timestamps = (app.state.security.registrationTimestamps || []).filter((t) => now - t < windowMs);
  if (timestamps.length >= CONFIG.maxRegistrationsPerHour) {
    throw new Error("登録回数の上限に達しました。1時間後に再度お試しください。");
  }
}

function getDeviceId() {
  const key = "stockgame_device_id";
  let id = localStorage.getItem(key);
  if (!id) {
    try {
      id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : "dev-" + Date.now() + "-" + Math.random().toString(36).slice(2);
    } catch (_) {
      id = "dev-" + Date.now() + "-" + Math.random().toString(36).slice(2);
    }
    localStorage.setItem(key, id);
  }
  return id;
}

function buildDeviceSeasonKey(season, deviceId) {
  return `${String(season || "")}::${String(deviceId || "")}`;
}

function countUsersForDeviceAndSeason(season, deviceId) {
  if (!season || !deviceId) return 0;
  return (app.state.users || []).filter((u) => {
    if (!u || u.isDeleted) return false;
    if (u.season !== season) return false;
    // registeredDeviceId が無い旧ユーザーは「同一端末」とみなさない（誤カウント防止）
    if (!u.registeredDeviceId) return false;
    return u.registeredDeviceId === deviceId;
  }).length;
}

// 同一端末・同一月で作成できるアカウント数（最大1）
const MAX_REGISTRATIONS_PER_DEVICE_PER_MONTH = 1;

function hydrateDeviceSeasonConsumedFromStorage(season, deviceId) {
  if (!season || !deviceId || !app?.state?.security) return;
  const k = buildDeviceSeasonKey(season, deviceId);
  try {
    if (localStorage.getItem("stockgame_device_month_slot_used_" + season + "_" + deviceId) === "1") {
      if (!app.state.security.deviceSeasonConsumed || typeof app.state.security.deviceSeasonConsumed !== "object") {
        app.state.security.deviceSeasonConsumed = {};
      }
      app.state.security.deviceSeasonConsumed[k] = true;
    }
  } catch (_) {}
}

function isDeviceSeasonSlotUsed(season, deviceId) {
  if (!season || !deviceId) return false;
  const k = buildDeviceSeasonKey(season, deviceId);
  if (app?.state?.security?.deviceSeasonConsumed?.[k]) return true;
  try {
    return localStorage.getItem("stockgame_device_month_slot_used_" + season + "_" + deviceId) === "1";
  } catch (_) {
    return false;
  }
}

function markDeviceSeasonConsumed(season, deviceId) {
  if (!season || !deviceId) return;
  if (!app.state.security) app.state.security = createDefaultSecurityState();
  if (!app.state.security.deviceSeasonConsumed || typeof app.state.security.deviceSeasonConsumed !== "object") {
    app.state.security.deviceSeasonConsumed = {};
  }
  const k = buildDeviceSeasonKey(season, deviceId);
  app.state.security.deviceSeasonConsumed[k] = true;
  try {
    localStorage.setItem("stockgame_device_month_slot_used_" + season + "_" + deviceId, "1");
  } catch (_) {}
}

/** 指定の対戦月×端末IDの登録枠を state / localStorage から除去 */
function clearDeviceSeasonSlotForSeasonAndDevice(season, deviceId) {
  const s = String(season || "").trim();
  const d = String(deviceId || "").trim();
  if (!s || !d || !/^\d{4}-\d{2}$/.test(s)) return;
  if (!app?.state) return;
  if (!app.state.security) app.state.security = createDefaultSecurityState();
  const k = buildDeviceSeasonKey(s, d);
  if (app.state.security.deviceSeasonConsumed && typeof app.state.security.deviceSeasonConsumed === "object") {
    delete app.state.security.deviceSeasonConsumed[k];
  }
  if (app.state.security.deviceSeasonCounts && typeof app.state.security.deviceSeasonCounts === "object") {
    delete app.state.security.deviceSeasonCounts[k];
  }
  try {
    localStorage.removeItem("stockgame_device_month_slot_used_" + s + "_" + d);
    localStorage.removeItem("stockgame_device_reg_" + s + "_" + d);
  } catch (_) {}
}

/** 削除されたアカウントが使っていた端末×月の枠を解放 */
function releaseDeviceSeasonSlotForDeletedUser(user) {
  if (!user) return;
  clearDeviceSeasonSlotForSeasonAndDevice(user.season, user.registeredDeviceId);
}

/** このブラウザの端末ID×今月（JST）の枠を解放（削除直後の再登録用） */
function releaseDeviceSeasonSlotForThisBrowserThisMonth() {
  clearDeviceSeasonSlotForSeasonAndDevice(getSeasonKeyJst(new Date()), getDeviceId());
}

function enforceDeviceRegistrationLimit() {
  /* Supabase では register Edge が device_season_registrations で強制する。
   * ダッシュボードで app_users を消したあと、ローカルの月枠フラグだけ残ると再登録できなくなるためクラウド時はサーバーに任せる。 */
  if (getSupabaseCloudConfig()) {
    return;
  }
  const deviceId = getDeviceId();
  const season = getSeasonKeyJst(new Date());
  hydrateDeviceSeasonConsumedFromStorage(season, deviceId);
  let linkedCount = countUsersForDeviceAndSeason(season, deviceId);
  // 同月・同端末の残アカウントが誰もいないのに枠だけ残っている（削除フローで取りこぼし等）なら掃除
  if (linkedCount === 0 && isDeviceSeasonSlotUsed(season, deviceId)) {
    clearDeviceSeasonSlotForSeasonAndDevice(season, deviceId);
  }
  linkedCount = countUsersForDeviceAndSeason(season, deviceId);
  if (isDeviceSeasonSlotUsed(season, deviceId)) {
    throw new Error(`この端末では今月の新規登録上限（${MAX_REGISTRATIONS_PER_DEVICE_PER_MONTH}件）に達しています。`);
  }
  if (linkedCount >= MAX_REGISTRATIONS_PER_DEVICE_PER_MONTH) {
    throw new Error(`この端末では今月の新規登録上限（${MAX_REGISTRATIONS_PER_DEVICE_PER_MONTH}件）に達しています。`);
  }
}

function syncDeviceRegistrationCountForSeason(season, deviceId) {
  if (!season || !deviceId) return;
  const storageKey = "stockgame_device_reg_" + season + "_" + deviceId;
  const stateKey = buildDeviceSeasonKey(season, deviceId);
  const linkedCount = countUsersForDeviceAndSeason(season, deviceId);

  // 端末×月のカウントは「同じ月に作成した人数」で上限を判定しているため、
  // 削除（ユーザー消去）時は累計ではなく残数に合わせて揃える。
  try {
    localStorage.setItem(storageKey, String(linkedCount));
  } catch (_) {
    // ローカルストレージが無効な環境は無視
  }
  if (!app.state.security) app.state.security = {};
  if (!app.state.security.deviceSeasonCounts || typeof app.state.security.deviceSeasonCounts !== "object") {
    app.state.security.deviceSeasonCounts = {};
  }
  app.state.security.deviceSeasonCounts[stateKey] = linkedCount;
}

function recordDeviceRegistration() {
  const deviceId = getDeviceId();
  const season = getSeasonKeyJst(new Date());
  markDeviceSeasonConsumed(season, deviceId);
  const storageKey = "stockgame_device_reg_" + season + "_" + deviceId;
  const count = parseInt(localStorage.getItem(storageKey) || "0", 10) || 0;
  localStorage.setItem(storageKey, String(count + 1));
  const stateKey = buildDeviceSeasonKey(season, deviceId);
  if (!app.state.security.deviceSeasonCounts || typeof app.state.security.deviceSeasonCounts !== "object") {
    app.state.security.deviceSeasonCounts = {};
  }
  app.state.security.deviceSeasonCounts[stateKey] = Number(app.state.security.deviceSeasonCounts[stateKey] || 0) + 1;
}

function recordRegistration() {
  const arr = app.state.security.registrationTimestamps || [];
  arr.push(Date.now());
  const windowMs = 60 * 60 * 1000;
  const now = Date.now();
  app.state.security.registrationTimestamps = arr.filter((t) => now - t < windowMs);
  saveState();
}

/** ひらがなをカタカナに統一し、再設定回答の比較でひらがな・カタカナ両方を許容する */
function hiraganaToKatakanaForRecovery(s) {
  return String(s || "").replace(/[\u3041-\u3096\u3099-\u309C]/g, (ch) => {
    const c = ch.charCodeAt(0);
    return c >= 0x3041 && c <= 0x3096 ? String.fromCharCode(c + 0x60) : ch;
  });
}

function normalizeRecoveryAnswer(answer) {
  const t = String(answer || "")
    .normalize("NFKC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return hiraganaToKatakanaForRecovery(t).slice(0, CONFIG.maxRecoveryAnswerLength);
}

function buildRecoverySecret(questionId, answer) {
  const q = String(questionId || "").trim();
  const a = normalizeRecoveryAnswer(answer);
  return `${q}|${a}`;
}

function getRecoveryPlaceholder(questionId) {
  switch (String(questionId || "").trim()) {
    case "JUNIOR_HIGH":
    case "ELEMENTARY":
      return "2文字以上（ひらがな・カタカナどちらでも可）";
    default:
      return "回答を入力（2文字以上・ひらがな/カタカナどちらでも可）";
  }
}

function syncRecoveryAnswerHints() {
  const q1 = app.els.authRecoveryQuestion?.value || "BIRTH_CITY";
  const q2 = app.els.resetRecoveryQuestion?.value || "BIRTH_CITY";
  const ph1 = getRecoveryPlaceholder(q1);
  const ph2 = getRecoveryPlaceholder(q2);
  if (app.els.authRecoveryAnswer) app.els.authRecoveryAnswer.placeholder = ph1;
  if (app.els.resetRecoveryAnswer) app.els.resetRecoveryAnswer.placeholder = ph2;
  const hintText = "ひらがなとカタカナは同じとして扱います。";
  if (app.els.authRecoveryAnswerHint) app.els.authRecoveryAnswerHint.textContent = hintText;
  if (app.els.resetRecoveryAnswerHint) app.els.resetRecoveryAnswerHint.textContent = hintText;

  // 項目変更時は回答欄をいったん消す。中学校/小学校選択時のみ強制で「中学校」「小学校」を入れる
  const setRecoveryAnswer = (inputEl, text) => {
    if (!(inputEl instanceof HTMLInputElement)) return;
    inputEl.value = text;
  };
  if (q1 === "JUNIOR_HIGH") setRecoveryAnswer(app.els.authRecoveryAnswer, "中学校");
  else if (q1 === "ELEMENTARY") setRecoveryAnswer(app.els.authRecoveryAnswer, "小学校");
  else setRecoveryAnswer(app.els.authRecoveryAnswer, "");
  if (q2 === "JUNIOR_HIGH") setRecoveryAnswer(app.els.resetRecoveryAnswer, "中学校");
  else if (q2 === "ELEMENTARY") setRecoveryAnswer(app.els.resetRecoveryAnswer, "小学校");
  else setRecoveryAnswer(app.els.resetRecoveryAnswer, "");
}

async function registerAccount(name, password, recoveryQuestionId, recoveryAnswer) {
  if (getSupabaseCloudConfig()) {
    enforceRegistrationRateLimit();
    enforceDeviceRegistrationLimit();
    const key = normalizeNameKey(name);
    if (findUserByNameKey(key, true)) {
      throw new Error("このアカウント名はすでに登録済みです。");
    }
    const deviceId = getDeviceId();
    const data = await supabaseCloudFetch("register", {
      body: JSON.stringify({
        name,
        password,
        recoveryQuestionId,
        recoveryAnswer,
        deviceId
      })
    });
    if (!data?.sessionToken || !data?.state || !data?.user?.id) {
      throw new Error("サーバーからの登録応答が不正です。");
    }
    setSupabaseSessionToken(data.sessionToken);
    app.state = normalizeState(data.state);
    app.sessionUserId = data.user.id;
    app.state.sessionUserId = data.user.id;
    recordRegistration();
    recordDeviceRegistration();
    saveState();
    void refreshCloudAccountRegistrationStats();
    return;
  }

  enforceRegistrationRateLimit();
  enforceDeviceRegistrationLimit();
  if (getActiveUsers().length >= CONFIG.maxUsers) {
    throw new Error(`登録可能なアカウントは最大${CONFIG.maxUsers}件です。`);
  }

  const key = normalizeNameKey(name);
  if (findUserByNameKey(key, true)) {
    throw new Error("このアカウント名はすでに登録済みです。");
  }

  const salt = createSalt();
  const hash = await hashPassword(password, salt);
  const recoverySalt = createSalt();
  const recoveryHash = await hashPassword(buildRecoverySecret(recoveryQuestionId, recoveryAnswer), recoverySalt);
  const nowIso = new Date().toISOString();
  // 月をまたいだ状態でアプリを開きっぱなしでも、登録したユーザーは常に当月として保存する
  const season = getSeasonKeyJst(new Date());
  const deviceId = getDeviceId();
  const user = {
    id: createId("usr"),
    name,
    nameKey: key,
    season,
    passwordSalt: salt,
    passwordHash: hash,
    passwordAlgo: "pbkdf2",
    recoveryQuestionId: String(recoveryQuestionId || ""),
    recoverySalt,
    recoveryHash,
    registeredDeviceId: deviceId,
    createdAt: nowIso,
    updatedAt: nowIso,
    aliasName: "",
    isDeleted: false,
    needsPickConfirm: false,
    pickListModified: false,
    lastPickConfirmAt: "",
    picks: [],
    picksLastConfirmed: []
  };

  app.state.users.push(user);
  app.sessionUserId = user.id;
  app.state.sessionUserId = user.id;
  recordRegistration();
  recordDeviceRegistration();
  saveState();
}

async function loginAccount(name, password) {
  const key = normalizeNameKey(name);
  enforceLoginRateLimit(key);

  if (getSupabaseCloudConfig()) {
    const data = await supabaseCloudFetch("login", {
      body: JSON.stringify({ name, password })
    });
    if (!data?.sessionToken || !data?.state || !data?.user?.id) {
      throw new Error("サーバーからのログイン応答が不正です。");
    }
    const seasonNow = getSeasonKeyJst(new Date());
    const normalized = normalizeState(data.state);
    const uid = data.user.id;
    const rowUser = (normalized.users || []).find((x) => x && x.id === uid);
    if (!rowUser || String(rowUser.season || "") !== String(seasonNow)) {
      throw new Error(
        "このアカウントは先月以前の対象月のままです。今月の参加には、新しいアカウントを登録してください。"
      );
    }
    if (String(normalized.currentSeason || "") !== String(seasonNow)) {
      normalized.currentSeason = seasonNow;
    }
    setSupabaseSessionToken(data.sessionToken);
    clearFailedLogin(key);
    app.state = normalized;
    app.sessionUserId = data.user.id;
    app.state.sessionUserId = data.user.id;
    saveState();
    return;
  }

  const user = findUserByNameKey(key, true);
  if (!user) {
    recordFailedLogin(key);
    throw new Error("IDまたはパスワードが正しくありません。");
  }
  if (user.isDeleted) {
    throw new Error("ランキングに表示名がありません。ログインしてください。");
  }

  const ok = await verifyPassword(user, password);
  if (!ok) {
    recordFailedLogin(key);
    throw new Error("IDまたはパスワードが正しくありません。");
  }

  const seasonNowLocal = getSeasonKeyJst(new Date());
  if (user.season && String(user.season) !== String(seasonNowLocal)) {
    recordFailedLogin(key);
    throw new Error("このアカウントは先月までのものです。今月用に新しいアカウントを作成してください。");
  }

  clearFailedLogin(key);
  app.sessionUserId = user.id;
  app.state.sessionUserId = user.id;
  saveState();
}

async function resetPasswordByRecovery(name, recoveryQuestionId, recoveryAnswer, newPassword) {
  if (getSupabaseCloudConfig()) {
    await supabaseCloudFetch("reset-password", {
      body: JSON.stringify({
        name,
        recoveryQuestionId,
        recoveryAnswer,
        newPassword
      })
    });
    const key = normalizeNameKey(name);
    const user = findUserByNameKey(key, true);
    if (user && String(user.passwordAlgo || "") !== "remote") {
      const newSalt = createSalt();
      user.passwordSalt = newSalt;
      user.passwordHash = await hashPassword(newPassword, newSalt);
      user.passwordAlgo = "pbkdf2";
      user.updatedAt = new Date().toISOString();
      saveState();
    }
    return;
  }

  const key = normalizeNameKey(name);
  const user = findUserByNameKey(key, true);
  if (!user || user.isDeleted) throw new Error("ランキングユーザーが見つかりません。");
  if (!user.recoverySalt || !user.recoveryHash) {
    throw new Error("パスワード再設定キーワードが一致しません。");
  }

  const secret = user.recoveryQuestionId
    ? buildRecoverySecret(recoveryQuestionId, recoveryAnswer)
    : String(recoveryAnswer || "").trim(); // 旧方式互換（質問なし・回答のみ）
  const recoveryCheck = await hashPassword(secret, user.recoverySalt);
  if (recoveryCheck !== user.recoveryHash) {
    throw new Error("再設定キーワードまたはパスワードが正しくありません。");
  }

  const newSalt = createSalt();
  user.passwordSalt = newSalt;
  user.passwordHash = await hashPassword(newPassword, newSalt);
  user.passwordAlgo = "pbkdf2";
  user.updatedAt = new Date().toISOString();
  saveState();
}

async function renameAccount(userId, nextName) {
  await rollSeasonIfNeeded();
  const user = app.state.users.find((x) => x.id === userId);
  if (!user) throw new Error("ランキングユーザーが見つかりません。");
  if (user.isDeleted) throw new Error("削除済みのためランキングから操作できません。");

  const season = app.state.currentSeason || getSeasonKeyJst(new Date());
  const reportCount = (app.state.reports || []).filter((r) => r.season === season && r.targetUserId === userId).length;
  if (reportCount >= CONFIG.reportAliasThreshold) {
    throw new Error("通報対応中のためID変更はできません。");
  }

  const key = normalizeNameKey(nextName);
  const collision = app.state.users.find((x) => x.nameKey === key && x.id !== userId);
  if (collision) throw new Error("このアカウント名はすでに使用されています。");

  if (String(user.passwordAlgo || "") === "remote" && getSupabaseCloudConfig()) {
    await supabaseCloudFetch("rename-account", {
      body: JSON.stringify({ name: nextName })
    });
  }

  user.name = nextName;
  user.nameKey = key;
  user.updatedAt = new Date().toISOString();
  saveState();
}

async function addPickToCurrentUser(resolved) {
  await ensureGameplaySeasonAlignedOrThrow();
  const user = getCurrentUser();
  if (!user) throw new Error("ログイン後に銘柄を追加してください。");
  if (user.isDeleted) throw new Error("削除済みのためランキングから操作できません。");
  if (!isPurchaseWindowOpen(new Date())) throw new Error(`売買は毎月1日～${CONFIG.purchaseDays}日のみ可能です。`);
  enforceMonthlyTradeLimit(user, 1);

  if (countOpenPicks(user.picks || []) >= CONFIG.maxPicks) {
    throw new Error(`銘柄は最大${CONFIG.maxPicks}件までです。`);
  }

  if ((user.picks || []).some((pick) => pick.symbol === resolved.symbol && pick.status !== "CLOSED")) {
    throw new Error("同じ銘柄は1銘柄につき1回までです。");
  }

  const orderDate = computeEffectiveOrderDate(resolved.market, new Date());
  const orderSlot = getOrderSlotForMarket(resolved.market, new Date());
  let apiFallback = false;
  let rows = app.state.apiCache.history[resolved.symbol]?.rows || null;
  let quoteData = null;

  try {
    quoteData = await fetchQuote(resolved.symbol, false);
    app.lastApiFailure = null;
  } catch (error) {
    captureApiFailure(error, resolved.symbol, "quote");
  }

  if (!rows?.length && !quoteData?.price) {
    try {
      const history = await fetchHistory(resolved.symbol, false);
      rows = history.rows;
    } catch (error) {
      const cached = app.state.apiCache.history[resolved.symbol];
      if (cached?.rows?.length) {
        rows = cached.rows;
      } else {
        captureApiFailure(error, resolved.symbol, "history");
      }
    }
  }

  const entry = rows?.length ? resolveFillByOrderDate(rows, orderDate, orderSlot, resolved.market) : { price: null, date: null, pending: true };
  const slotPassed = hasOrderSlotPassed(orderDate, orderSlot, resolved.market);
  const marketClosedNow = isMarketClosedNow(resolved.market, new Date());
  let entryStillPending = entry.pending || !slotPassed;
  let latest = rows?.length ? getLatestFromRows(rows) : null;
  if (quoteData?.price != null) {
    latest = {
      price: quoteData.price,
      date: getDateKeyJst(new Date(quoteData.asOfMs || Date.now()))
    };
  } else if (!latest) {
    const quote = app.state.apiCache.quote[resolved.symbol]?.data;
    if (quote?.price != null) {
      latest = { price: quote.price, date: getDateKeyJst(new Date(quote.asOfMs || Date.now())) };
      quoteData = quote;
    }
  }
  apiFallback = !latest || latest.price == null;
  if (!apiFallback) {
    app.lastApiFailure = null;
  }

  const entryPriceFinal = entryStillPending ? null : (entry.price ?? latest?.price);
  const entryDateFinal = entryStillPending ? null : (entry.date ?? orderDate);

  const displayName =
    pickBestDisplayName(resolved.symbol, resolved.market, quoteData?.name, resolved.nameGuess) ||
    symbolPresetMap.get(resolved.symbol)?.name ||
    resolved.symbol;
  const pick = {
    id: createId("pick"),
    symbol: resolved.symbol,
    market: resolved.market,
    displayName,
    orderDate,
    orderSlot,
    orderedAt: new Date().toISOString(),
    status: "OPEN",
    entryPrice: entryPriceFinal,
    entryDate: entryDateFinal,
    entryPending: entryStillPending,
    // 市場時間外（JP/US）は、slotPassed が偶然 true でも「価格データ待ち」表示にせず統一する
    entryPendingReason: entryStillPending
      ? (!slotPassed || marketClosedNow || resolved.market === "CRYPTO" ? "SLOT_WAIT" : (entry.reason || "DATA_WAIT"))
      : "",
    latestPrice: latest?.price ?? null,
    latestDate: latest?.date ?? null,
    sellPending: false,
    sellOrderDate: null,
    sellPendingReason: "",
    exitPrice: null,
    exitDate: null
  };

  user.picks = [...(user.picks || []), pick];
  user.pickListModified = true;
  user.updatedAt = new Date().toISOString();
  saveState();
  return { apiFallback, quoteData };
}

async function sellPickForCurrentUser(pickId) {
  await ensureGameplaySeasonAlignedOrThrow();
  const user = getCurrentUser();
  if (!user) throw new Error("ログイン後に売却できます。");
  if (user.isDeleted) throw new Error("削除済みのためランキングから操作できません。");
  if (!isPurchaseWindowOpen(new Date())) throw new Error(`売買は毎月1日～${CONFIG.purchaseDays}日のみ可能です。`);

  const pick = (user.picks || []).find((x) => x.id === pickId);
  if (!pick) throw new Error("銘柄が見つかりません。");
  if (pick.status === "CLOSED") throw new Error("この銘柄はすでに売却済みです。");
  if (pick.entryPending) throw new Error("注文が確定するまで売却できません。");

  const season = app?.state?.currentSeason || getSeasonKeyJst(new Date());
  const alreadyCountedThisMonth = seasonFromDateKey(pick.sellOrderDate) === season;
  if (!alreadyCountedThisMonth) {
    enforceMonthlyTradeLimit(user, 1);
  }

  const sellOrderDate = computeEffectiveOrderDate(pick.market, new Date());
  const sellOrderSlot = getOrderSlotForMarket(pick.market, new Date());
  let exit = { price: null, date: null, pending: true };
  try {
    const history = await fetchHistory(pick.symbol, false);
    exit = resolveFillByOrderDate(history.rows, sellOrderDate, sellOrderSlot, pick.market);
  } catch (error) {
    const cached = app.state.apiCache.history[pick.symbol];
    if (cached?.rows?.length) {
      exit = resolveFillByOrderDate(cached.rows, sellOrderDate, sellOrderSlot, pick.market);
    }
  }

  pick.sellOrderDate = sellOrderDate;
  pick.sellOrderSlot = sellOrderSlot;
  const nowSell = new Date();
  const sellSlotPassed = hasOrderSlotPassed(sellOrderDate, sellOrderSlot, pick.market, nowSell);
  // 買い注文と同様、約定スロットを過ぎるまで売却確定しない（履歴に終値があっても待つ）
  pick.sellPending = exit.pending || (!exit.pending && exit.price != null && !sellSlotPassed);
  if (!exit.pending && exit.price != null && sellSlotPassed) {
    pick.exitPrice = exit.price;
    pick.exitDate = exit.date;
    pick.status = "CLOSED";
    pick.sellPending = false;
  }
  pick.sellPendingReason = pick.sellPending
    ? computeSellPendingReasonForDisplay(pick, exit, nowSell)
    : "";
  pick.updatedAt = new Date().toISOString();
  saveState();
}

async function refreshCurrentUserLatest(force) {
  const user = getCurrentUser();
  if (!user) return;
  await refreshUsersLatest([user], force);
  saveState();
}

async function refreshAllUsersLatest(force) {
  await refreshUsersLatest(getActiveUsers(), force);
  saveState();
}

async function refreshUsersLatest(users, force) {
  const nowIso = new Date().toISOString();
  const nowObj = new Date();
  const symbols = new Set();
  if (force) {
    // force=true のときは OPEN/未確定だけを最新化対象にする（CLOSED は除外）
    users.forEach((user) => (user.picks || []).forEach((pick) => {
      if (!pick || pick.status === "CLOSED") return;
      symbols.add(pick.symbol);
    }));
  } else {
    users.forEach((user) => {
      (user.picks || []).forEach((pick) => {
        if (pick.entryPending || pick.entryPrice == null || pick.sellPending) symbols.add(pick.symbol);
      });
    });
  }
  if (!symbols.size) return;

  const rowsMap = new Map();
  for (const symbol of symbols) {
    try {
      const history = await fetchHistory(symbol, force);
      rowsMap.set(symbol, history.rows);
    } catch (error) {
      const cached = app.state.apiCache.history[symbol];
      if (cached?.rows?.length) rowsMap.set(symbol, cached.rows);
    }
  }

  for (const user of users) {
    for (const pick of user.picks || []) {
      const rows = rowsMap.get(pick.symbol);
      if (!rows || !rows.length) continue;

      if (pick.entryPending || pick.entryPrice == null) {
        const entry = resolveFillByOrderDate(rows, pick.orderDate, pick.orderSlot, pick.market);
        const slotPassed = hasOrderSlotPassed(pick.orderDate, pick.orderSlot, pick.market, nowObj);
        const marketClosedNow = isMarketClosedNow(pick.market, nowObj);
        pick.entryPendingReason = entry.pending
          ? (slotPassed && !(marketClosedNow || pick.market === "CRYPTO") ? (entry.reason || "DATA_WAIT") : "SLOT_WAIT")
          : "";
        if (!entry.pending && entry.price != null && slotPassed) {
          pick.entryPrice = entry.price;
          pick.entryDate = entry.date;
          pick.entryPending = false;
          pick.entrySettledAt = slotScheduledIso(pick.market, entry.date || pick.orderDate, pick.orderSlot);
        }
      } else if (!pick.entrySettledAt && pick.entryPrice != null) {
        // 既に約定済みだが、旧データで約定時刻だけ欠けている場合の補完
        const slotPassed = hasOrderSlotPassed(pick.orderDate, pick.orderSlot, pick.market);
        if (slotPassed) {
          pick.entrySettledAt = slotScheduledIso(pick.market, pick.entryDate || pick.orderDate, pick.orderSlot);
        }
      }

      const latest = getLatestFromRows(rows);
      if (latest) {
        pick.latestPrice = latest.price;
        pick.latestDate = latest.date;
        pick.latestResolvedAt = nowIso;
      }

      if (pick.sellPending && pick.sellOrderDate) {
        const exit = resolveFillByOrderDate(rows, pick.sellOrderDate, pick.sellOrderSlot, pick.market);
        const sellSlotPassed = hasOrderSlotPassed(pick.sellOrderDate, pick.sellOrderSlot, pick.market, nowObj);
        pick.sellPendingReason = computeSellPendingReasonForDisplay(pick, exit, nowObj);
        if (!exit.pending && exit.price != null && sellSlotPassed) {
          pick.exitPrice = exit.price;
          pick.exitDate = exit.date;
          pick.status = "CLOSED";
          pick.sellPending = false;
          pick.sellSettledAt = slotScheduledIso(pick.market, exit.date || pick.sellOrderDate, pick.sellOrderSlot);
        }
      }

      if (pick.status !== "CLOSED" && pick.displayName === pick.symbol) {
        const qd = app.state.apiCache.quote[pick.symbol]?.data;
        if (qd?.name) {
          const next = pickBestDisplayName(pick.symbol, pick.market, qd.name, pick.displayName);
          if (next && next !== pick.symbol) pick.displayName = next;
        }
      }
    }
    syncVolatilePickFieldsToLastConfirmed(user);
  }
}

/** キャッシュのみでランキングを再計算（Yahoo にアクセスしない）。12:00/24:00 自動更新用 */
function refreshUsersLatestCacheOnly(users) {
  const nowIso = new Date().toISOString();
  const nowObj = new Date();
  const symbols = new Set();
  users.forEach((user) => (user.picks || []).forEach((pick) => {
    if (!pick || pick.status === "CLOSED") return;
    symbols.add(pick.symbol);
  }));
  const rowsMap = new Map();
  for (const symbol of symbols) {
    const cached = app.state.apiCache.history[symbol];
    if (cached?.rows?.length) rowsMap.set(symbol, cached.rows);
  }
  for (const user of users) {
    for (const pick of user.picks || []) {
      const rows = rowsMap.get(pick.symbol);
      if (!rows || !rows.length) continue;
      if (pick.entryPending || pick.entryPrice == null) {
        const entry = resolveFillByOrderDate(rows, pick.orderDate, pick.orderSlot, pick.market);
        const slotPassed = hasOrderSlotPassed(pick.orderDate, pick.orderSlot, pick.market, nowObj);
        const marketClosedNow = isMarketClosedNow(pick.market, nowObj);
        pick.entryPendingReason = entry.pending
          ? (slotPassed && !(marketClosedNow || pick.market === "CRYPTO") ? (entry.reason || "DATA_WAIT") : "SLOT_WAIT")
          : "";
        if (!entry.pending && entry.price != null && slotPassed) {
          pick.entryPrice = entry.price;
          pick.entryDate = entry.date;
          pick.entryPending = false;
          pick.entrySettledAt = slotScheduledIso(pick.market, entry.date || pick.orderDate, pick.orderSlot);
        }
      } else if (!pick.entrySettledAt && pick.entryPrice != null) {
        const slotPassed = hasOrderSlotPassed(pick.orderDate, pick.orderSlot, pick.market);
        if (slotPassed) {
          pick.entrySettledAt = slotScheduledIso(pick.market, pick.entryDate || pick.orderDate, pick.orderSlot);
        }
      }
      const latest = getLatestFromRows(rows);
      if (latest) {
        pick.latestPrice = latest.price;
        pick.latestDate = latest.date;
        pick.latestResolvedAt = nowIso;
      }
      if (pick.sellPending && pick.sellOrderDate) {
        const exit = resolveFillByOrderDate(rows, pick.sellOrderDate, pick.sellOrderSlot, pick.market);
        const sellSlotPassed = hasOrderSlotPassed(pick.sellOrderDate, pick.sellOrderSlot, pick.market, nowObj);
        pick.sellPendingReason = computeSellPendingReasonForDisplay(pick, exit, nowObj);
        if (!exit.pending && exit.price != null && sellSlotPassed) {
          pick.exitPrice = exit.price;
          pick.exitDate = exit.date;
          pick.status = "CLOSED";
          pick.sellPending = false;
          pick.sellSettledAt = slotScheduledIso(pick.market, exit.date || pick.sellOrderDate, pick.sellOrderSlot);
        }
      }
    }
    syncVolatilePickFieldsToLastConfirmed(user);
  }
}

/** 注文中・売却予約中の判定理由を表示用ラベルに変換 */
function getPendingReasonLabel(reason) {
  if (!reason) return "";
  switch (reason) {
    case "SLOT_WAIT": return "市場時間待ち";
    case "STOP_LIMIT": return "停止日回避待ち";
    case "DATA_WAIT": return "価格データ待ち";
    default: return reason;
  }
}

/**
 * 売却未約定の理由コード（買い注文と同様）。
 * 履歴上は価格が取れても resolve が pending:false になるため、約定スロット前は必ず SLOT_WAIT（市場時間待ち）とする。
 */
function computeSellPendingReasonForDisplay(pick, exit, nowObj) {
  if (!pick.sellPending || !pick.sellOrderDate) return "";
  const slotPassed = hasOrderSlotPassed(pick.sellOrderDate, pick.sellOrderSlot, pick.market, nowObj);
  const marketClosedNow = isMarketClosedNow(pick.market, nowObj);
  // 価格は解決済みだが、売却スロット前 → 買い注文と同様に市場時間待ち
  if (!exit.pending && exit.price != null && !slotPassed) {
    return "SLOT_WAIT";
  }
  if (exit.pending) {
    return slotPassed && !(marketClosedNow || pick.market === "CRYPTO")
      ? (exit.reason || "DATA_WAIT")
      : "SLOT_WAIT";
  }
  return "";
}

function isLongPending(orderDate) {
  if (!orderDate || typeof orderDate !== "string") return false;
  const todayKey = getDateKeyJst(new Date());
  const a = new Date(orderDate).getTime();
  const b = new Date(todayKey).getTime();
  if (Number.isNaN(a) || Number.isNaN(b)) return false;
  const days = Math.floor((b - a) / (24 * 60 * 60 * 1000));
  return days >= 3;
}

function getDisplayNameForRanking(user, season) {
  if (!user) return "";
  if (user.aliasName) return user.aliasName;
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.id === user.id) return user.name || "";
  const myReport = (app.state.reports || []).find(
    (r) => r.season === season && r.targetUserId === user.id && r.reporterId === currentUser.id
  );
  return (myReport && myReport.aliasForReporter) ? myReport.aliasForReporter : (user.name || "");
}

/**
 * 保有銘柄 HTML 断片を結合。各 chunk には末尾「、」を既に含める（formatLiveRankingHoldingsLine / 履歴側）。
 * U+2060 は環境によって「⁠」と見えるため使わない。
 */
function joinRankHoldingsHtmlChunks(chunks) {
  if (!chunks.length) return "-";
  return chunks.map((c) => `<span class="rank-holding-pair">${c}</span>`).join("");
}

/**
 * ランキング「保有銘柄」列用: 約定済み保有に加え、注文中・売却予約中も銘柄名＋ラベルで並べる。
 * 並び: 保有（約定済み・売却予約中含む）を左から → 未約定の買注をその後ろ。
 * row.symbols 用の heldSymbols は従来どおり「確定保有」のみ（スコア・保存データとの整合）。
 */
function formatLiveRankingHoldingsLine(user) {
  const open = getPicksForRankingSnapshot(user).filter((p) => p.status !== "CLOSED");
  const heldOrder = open.filter((p) => !p.entryPending);
  const buyPendingOrder = open.filter((p) => p.entryPending);
  const ordered = [...heldOrder, ...buyPendingOrder];
  const parts = [];
  const htmlParts = [];
  for (let i = 0; i < ordered.length; i += 1) {
    const p = ordered[i];
    const isLast = i === ordered.length - 1;
    const sep = isLast ? "" : "、";
    const name = resolvePickDisplayName(p);
    const safeName = escapeHtml(String(name));
    if (p.entryPending) {
      parts.push(`${name}（買注）`);
      htmlParts.push(
        `<span class="rank-holding-pending"><span class="rank-symbol-name">${safeName}</span><span class="rank-order-note">（買注）</span>${sep}</span>`
      );
    } else if (p.sellPending) {
      parts.push(`${name}（売注）`);
      htmlParts.push(
        `<span class="rank-holding-pending"><span class="rank-symbol-name">${safeName}</span><span class="rank-order-note">（売注）</span>${sep}</span>`
      );
    } else {
      parts.push(String(name));
      htmlParts.push(safeName + sep);
    }
  }
  const symbolsText = parts.length ? parts.join("、") : "-";
  const symbolsHtml = htmlParts.length ? joinRankHoldingsHtmlChunks(htmlParts) : "-";
  const heldPicks = open.filter((p) => !p.entryPending && !p.sellPending);
  const heldSymbols = heldPicks.map((p) => p.symbol);
  return { symbolsText, symbolsHtml, heldSymbols };
}

function buildLiveRanking() {
  const season = app.state.currentSeason || getSeasonKeyJst(new Date());
  const rows = [];
  for (const user of getActiveUsers()) {
    const { symbolsText, symbolsHtml, heldSymbols } = formatLiveRankingHoldingsLine(user);
    const score = calcUserScore(user, "latest", season);
    const displayName = getDisplayNameForRanking(user, season);
    const isAnonymized = Boolean(user.aliasName) || displayName !== (user.name || "");
    if (!score) {
      const snap = getPicksForRankingSnapshot(user);
      const openPicks = snap.filter((p) => p.status !== "CLOSED").length;
      const openPending = snap.filter((p) => p.status !== "CLOSED" && p.entryPending).length;
      const hasUnconfirmed = hasUncommittedPickChanges(user);
      rows.push({
        userId: user.id,
        displayName,
        isAnonymized,
        returnPct: null,
        validPickCount: 0,
        symbols: heldSymbols,
        symbolsText,
        symbolsHtml,
        trades: [],
        winTrades: [],
        hasScore: false,
        pendingOrderCount: !hasUnconfirmed && openPending > 0 ? openPending : null,
        note: hasUnconfirmed
          ? (openPicks >= 1
            ? (CONFIG.minPicks > 0 ? `${CONFIG.minPicks}銘柄以上で確定してください` : "銘柄を確定してください")
            : "銘柄未登録")
          : (openPending > 0
            ? ""
            : (openPicks >= 1 ? "集計待ち" : "銘柄未登録"))
      });
      continue;
    }
    rows.push({
      userId: user.id,
      displayName,
      isAnonymized,
      returnPct: score.returnPct,
      validPickCount: score.validPickCount,
      symbols: heldSymbols,
      symbolsText,
      symbolsHtml,
      trades: score.trades,
      winTrades: score.winTrades,
      hasScore: true,
      pendingOrderCount: null,
      note: ""
    });
  }
  return rows.sort((a, b) => {
    const aRank = a.hasScore ? 1 : 0;
    const bRank = b.hasScore ? 1 : 0;
    if (aRank !== bRank) return bRank - aRank;
    if (a.hasScore && b.hasScore) {
      const diff = (b.returnPct || 0) - (a.returnPct || 0);
      if (Math.abs(diff) > 1e-9) return diff;
      if (b.validPickCount !== a.validPickCount) return b.validPickCount - a.validPickCount;
    }
    return a.displayName.localeCompare(b.displayName, "ja");
  });
}

function calcUserScore(user, mode, season) {
  const picks = getPicksForRankingSnapshot(user);
  const values = [];
  const trades = [];
  const symbols = new Set();

  for (const pick of picks) {
    // 確定ランキング（settled）で表示する「保有銘柄」は、最終営業日に保有していたものだけにしたい
    // そのため、ここでは評価開始時点の CLOSED/OPEN を覚えておく
    const wasClosedAtCalcStart = pick.status === "CLOSED";
    const entry = toFiniteNumber(pick.entryPrice);
    if (entry == null || entry <= 0) continue;

    let exit = null;
    let exitDate = null;
    let status = pick.status === "CLOSED" ? "CLOSED" : "OPEN";
    if (mode === "settled" && pick.settleExitPrice != null) {
      exit = toFiniteNumber(pick.settleExitPrice);
      exitDate = pick.settleExitDate || pick.exitDate || pick.latestDate;
      status = "CLOSED";
    } else if (pick.status === "CLOSED" && pick.exitPrice != null) {
      exit = toFiniteNumber(pick.exitPrice);
      exitDate = pick.exitDate;
      status = "CLOSED";
    } else {
      exit = toFiniteNumber(pick.latestPrice);
      exitDate = pick.latestDate;
      status = pick.sellPending ? "SELL_WAIT" : "OPEN";
    }

    /* 約定済み保有で評価額がない場合は 0% として履歴に含める（Yahoo 追加アクセスなし） */
    if (exit == null || exit <= 0) {
      exit = entry;
      exitDate = "-";
    }
    const entryDateKey = pick.entryDate || pick.orderDate;
    if (exitDate && exitDate !== "-" && entryDateKey && String(exitDate).localeCompare(entryDateKey) < 0) continue;
    const pct = ((exit - entry) / entry) * 100;
    values.push(pct);
    if (mode === "settled") {
      // 月内で売却済み（=CLOSED）の銘柄は「最終営業日時点の保有銘柄」から外す
      if (!wasClosedAtCalcStart) symbols.add(pick.symbol);
    } else {
      symbols.add(pick.symbol);
    }
    trades.push({
      symbol: pick.symbol,
      market: pick.market,
      status,
      entryDate: pick.entryDate || pick.orderDate,
      entryPrice: entry,
      exitDate: exitDate || "-",
      exitPrice: exit,
      returnPct: pct
    });
  }

  if (values.length === 0) return null;
  const avg = values.reduce((sum, x) => sum + x, 0) / values.length;
  const sortedTrades = trades.sort((a, b) => String(a.entryDate).localeCompare(String(b.entryDate)));
  const winTrades = sortedTrades.filter((t) => t.returnPct > 0);
  return {
    returnPct: roundTo(avg, 4),
    validPickCount: values.length,
    symbols: [...symbols].sort(),
    trades: sortedTrades,
    winTrades
  };
}

/** 日本株でストップ高・ストップ安の日は30分後・終値どちらも約定しない（米国株を除く）。終値が高値/安値一致かつ一定幅以上なら約定させない */
function isLikelyStopLimitDay(row, _slot, market) {
  if (market !== "JP" || !row || row.open == null || row.open <= 0) return false;
  const open = Number(row.open);
  const high = row.high != null ? Number(row.high) : open;
  const low = row.low != null ? Number(row.low) : open;
  const close = row.close != null ? Number(row.close) : open;
  const pctUp = (high - open) / open;
  const pctDown = (open - low) / open;
  if (close >= high - 1e-6 && pctUp >= 0.08) return true;
  if (close <= low + 1e-6 && pctDown >= 0.08) return true;
  return false;
}

function resolveFillByOrderDate(rows, orderDate, slot, market) {
  const startIdx = rows.findIndex((row) => row.date >= orderDate);
  if (startIdx < 0) return { price: null, date: null, pending: true, reason: "DATA_WAIT" };

  let skippedStop = false;
  for (let i = startIdx; i < rows.length; i += 1) {
    const row = rows[i];
    if (market && isLikelyStopLimitDay(row, slot, market)) {
      skippedStop = true;
      continue;
    }
    const price = (slot === "AM" || slot === "00") && row.open != null
      ? row.open
      : (row.close != null ? row.close : row.open);
    if (price != null) return { price, date: row.date, pending: false };
  }
  return { price: null, date: null, pending: true, reason: skippedStop ? "STOP_LIMIT" : "DATA_WAIT" };
}

function getLatestFromRows(rows) {
  if (!rows.length) return null;
  const last = rows[rows.length - 1];
  return { price: last.close, date: last.date };
}

/** @returns {Promise<boolean>} 状態を書き換えた（再描画が必要な）とき true */
async function rollSeasonIfNeeded() {
  if (app._rollSeasonPromise) return app._rollSeasonPromise;
  app._rollSeasonPromise = (async () => {
    try {
      const nowSeason = getSeasonKeyJst(new Date());
      if (!app.state.currentSeason) {
        app.state.currentSeason = nowSeason;
        saveState();
        return true;
      }

      if (app.state.currentSeason === nowSeason) return false;

      if (!/^\d{4}-\d{2}$/.test(String(app.state.currentSeason || ""))) {
        app.state.currentSeason = nowSeason;
        saveState();
        showGlobalNotice("保存されていた対戦月の形式が不正だったため、今月に合わせて修正しました。", true);
        return true;
      }

      const nowIdx = seasonToIndex(nowSeason);
      const curIdx = seasonToIndex(app.state.currentSeason);
      if (!Number.isFinite(curIdx)) {
        app.state.currentSeason = nowSeason;
        saveState();
        showGlobalNotice("保存されていた対戦月が解釈できなかったため、今月に合わせて修正しました。", true);
        return true;
      }
      if (curIdx > nowIdx) {
        app.state.currentSeason = nowSeason;
        saveState();
        showGlobalNotice("保存されていた対戦月が未来日付のため、今月に合わせて修正しました。", true);
        return true;
      }

      const oldSeason = app.state.currentSeason;

      /* 月初めの初回実行時に前月を確定し、全アカウント・通報をクリアする。確定履歴は rankings に残る。
       * 長期未利用で数か月ぶりに開いた場合でも、保存中の「直前の対戦月」を1回確定してから今月へ移行する。
       * （中間の空月はローカルにプレイデータが無いためスキップされる。）
       * archivedUsers への全ユーザー複製は未使用かつ容量を圧迫するため行わない。 */
      try {
        await settleSeason(oldSeason);
      } catch (error) {
        console.error("settleSeason failed", error);
        settleSeasonFallback(oldSeason);
      }

      try {
        if (!app.state.archivedUsers || typeof app.state.archivedUsers !== "object") app.state.archivedUsers = {};
        const minIndex = seasonToIndex(getSeasonKeyJst(new Date())) - (CONFIG.rankingKeepMonths - 1);
        for (const seasonKey of Object.keys(app.state.archivedUsers || {})) {
          if (seasonToIndex(seasonKey) < minIndex) delete app.state.archivedUsers[seasonKey];
        }
      } catch (_) {}

      app.state.users = [];
      app.state.reports = [];
      const prevSecurity = app.state.security || createDefaultSecurityState();
      app.state.security = createDefaultSecurityState();
      app.state.security.deviceSeasonConsumed = prevSecurity.deviceSeasonConsumed || {};
      app.state.security.deviceSeasonCounts = prevSecurity.deviceSeasonCounts || {};
      app.state.currentSeason = nowSeason;
      app.state.lastDailyRefreshDate = "";
      app.state.lastRankUpdateAt = "";
      app.state.sessionUserId = null;
      app.sessionUserId = null;
      saveState();

      showGlobalNotice(`${formatSeasonLabel(oldSeason)}を確定しました。${formatSeasonLabel(nowSeason)}を開始しました。`, false);
      return true;
    } catch (e) {
      console.error("rollSeasonIfNeeded failed", e);
      return false;
    } finally {
      app._rollSeasonPromise = null;
    }
  })();
  return app._rollSeasonPromise;
}

/** タブ放置で月が変わったあとも、売買・通報前に確実にロールしログインユーザーの対戦月と整合させる */
async function ensureGameplaySeasonAlignedOrThrow() {
  await rollSeasonIfNeeded();
  const user = getCurrentUser();
  if (!user) return;
  const season = app.state.currentSeason || getSeasonKeyJst(new Date());
  if (String(user.season || "") !== String(season)) {
    throw new Error("対戦月が切り替わりました。ページを再読み込みするか、今月用アカウントでログインしてください。");
  }
}

async function settleSeason(season) {
  if (app.state.rankings.some((x) => x.season === season)) return;

  const seasonFirst = getSeasonFirstDateKey(season);
  const seasonLast = getSeasonLastDateKey(season);

  const users = app.state.users.map((user) => {
    const snap = getPicksForRankingSnapshot(user);
    return {
      id: user.id,
      name: user.name,
      aliasName: user.aliasName || "",
      isDeleted: Boolean(user.isDeleted),
      needsPickConfirm: false,
      picks: snap.map((pick) => ({ ...pick }))
    };
  });

  const symbols = [...new Set(users.flatMap((u) => u.picks.map((p) => p.symbol)))];
  const rowsBySymbol = new Map();
  for (const symbol of symbols) {
    try {
      const history = await fetchHistory(symbol, true, season);
      rowsBySymbol.set(symbol, history.rows);
    } catch (error) {
      const cached = app.state.apiCache.history[symbol];
      if (cached?.rows?.length) rowsBySymbol.set(symbol, cached.rows);
    }
  }

  const rows = [];
  for (const user of users) {
    if (user.isDeleted) continue;
    const settledPicks = [];
    for (const pick of user.picks) {
      const entryDateKey = pick.entryDate || pick.orderDate;
      if (!entryDateKey || String(entryDateKey).localeCompare(seasonLast) > 0) continue;
      const exitDateKey = pick.exitDate || pick.latestDate;
      if (pick.status === "CLOSED" && exitDateKey && String(exitDateKey).localeCompare(seasonFirst) < 0) continue;

      const rowsForSymbol = rowsBySymbol.get(pick.symbol);
      if (!rowsForSymbol?.length) continue;

      const entry = pick.entryPrice != null
        ? { price: pick.entryPrice, date: pick.entryDate }
        : resolveFillByOrderDate(rowsForSymbol, pick.orderDate, pick.orderSlot, pick.market);
      const exit = (pick.status === "CLOSED" && pick.exitPrice != null)
        ? { price: pick.exitPrice, date: pick.exitDate || pick.latestDate }
        : resolveSeasonExit(rowsForSymbol, season);
      if (entry.price == null || exit.price == null || entry.price <= 0) continue;

      settledPicks.push({
        ...pick,
        settleExitPrice: exit.price,
        settleExitDate: exit.date
      });
    }

    const score = calcUserScore({ ...user, picks: settledPicks }, "settled", season);
    if (!score) continue;

    rows.push({
      userId: user.id,
      name: user.name,
      displayName: user.aliasName || user.name,
      isAnonymized: Boolean(user.aliasName),
      returnPct: score.returnPct,
      validPickCount: score.validPickCount,
      symbols: score.symbols,
      trades: score.trades,
      winTrades: score.winTrades
    });
  }

  rows.sort((a, b) => b.returnPct - a.returnPct || b.validPickCount - a.validPickCount || a.displayName.localeCompare(b.displayName, "ja"));
  app.state.rankings.push({
    season,
    settledAt: new Date().toISOString(),
    rows
  });
  trimRankings();
  saveState();
}

function settleSeasonFallback(season) {
  if (app.state.rankings.some((x) => x.season === season)) return;
  const rows = buildLiveRanking()
    .filter((row) => row.hasScore && Number.isFinite(row.returnPct))
    .map((row) => ({
      userId: row.userId,
      name: row.displayName,
      displayName: row.displayName,
      isAnonymized: row.isAnonymized,
      returnPct: row.returnPct,
      validPickCount: row.validPickCount,
      symbols: row.symbols,
      trades: row.trades,
      winTrades: row.winTrades
    }));
  app.state.rankings.push({
    season,
    settledAt: new Date().toISOString(),
    rows
  });
  trimRankings();
  saveState();
}

function resolveSeasonExit(rows, seasonKey) {
  const inMonth = rows.filter((r) => r.date.startsWith(`${seasonKey}-`));
  if (inMonth.length) {
    const last = inMonth[inMonth.length - 1];
    return { price: last.close, date: last.date };
  }
  return { price: null, date: null };
}

function trimRankings() {
  const minIndex = seasonToIndex(getSeasonKeyJst(new Date())) - (CONFIG.rankingKeepMonths - 1);
  app.state.rankings = app.state.rankings
    .filter((item) => seasonToIndex(item.season) >= minIndex)
    .sort((a, b) => a.season.localeCompare(b.season));
}

async function fetchQuote(symbol, force) {
  const cache = app.state.apiCache.quote[symbol];
  const market = inferMarketFromKnownSymbol(symbol);
  const now = new Date();
  const marketClosed = market !== "CRYPTO" && isMarketClosedNow(market, now);

  const buildQuoteFromLatest = (latest) => {
    const cachedQuoteName = app.state.apiCache.quote[symbol]?.data?.name;
    const name =
      (symbol && /\.T$/i.test(symbol) ? getJpDisplayName(symbol) : null) ||
      (cachedQuoteName && String(cachedQuoteName).trim() && String(cachedQuoteName).trim() !== symbol
        ? String(cachedQuoteName).trim()
        : null) ||
      symbolPresetMap.get(symbol)?.name ||
      symbol;
    return {
      symbol,
      name,
      price: latest.price,
      asOfMs: closeAsOfMsForMarket(market, latest.date) || Date.now()
    };
  };

  if (!force && cache && Date.now() - cache.ts < CONFIG.quoteTtlMs) {
    if (marketClosed) {
      const hist = app.state.apiCache.history[symbol];
      const latest = hist?.rows?.length ? getLatestFromRows(hist.rows) : null;
      if (latest?.price != null) {
        const data = buildQuoteFromLatest(latest);
        cacheQuoteData(symbol, data);
        app.lastApiFailure = null;
        return data;
      }
    }
    return cache.data;
  }

  // CRYPTO は Yahoo Quote を使わず CryptoCompare のみで取得する（Yahoo が不安定・負荷が高い）
  if (market === "CRYPTO") {
    try {
      const data = await fetchQuoteFromCryptoCompare(symbol);
      cacheQuoteData(symbol, data);
      app.lastApiFailure = null;
      return data;
    } catch (err) {
      // 取得に失敗してもキャッシュがあればそれを返す（緊急時の UX を維持）
      if (cache?.data?.price != null) return cache.data;
      const merged = buildApiError("現在値取得に失敗しました。", "quote", symbol, [], err);
      captureApiFailure(merged, symbol, "quote");
      throw merged;
    }
  }

  const attempts = [];
  // query1 のみ（query2 との二重ヒットをやめて Yahoo 負荷と待ち時間を削減。失敗時は履歴/フォールバックへ）
  const urls = [`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbol)}`];

  // Yahoo を叩かない（市場時間外など）場合は、終値（履歴キャッシュ）を優先して返す（疑似履歴を作らない）
  // ※ force=true は「ユーザーが明示的に最新化したい」ケースなので Yahoo 優先
  if (!force && marketClosed) {
    const hist = app.state.apiCache.history[symbol];
    const latest = hist?.rows?.length ? getLatestFromRows(hist.rows) : null;
    if (latest?.price != null) {
      const data = buildQuoteFromLatest(latest);
      cacheQuoteData(symbol, data);
      app.lastApiFailure = null;
      return data;
    }
  }

  if (!force && !isYahooAccessAllowed(symbol) && cache?.data?.price != null) {
    return cache.data;
  }

  // 市場クローズかつ日足が未キャッシュ: v7 を2回試すより chart 1 本の方が往復が少なく終値にも一致しやすい
  if (market !== "CRYPTO" && marketClosed) {
    const histPre = app.state.apiCache.history[symbol];
    const latestPre = histPre?.rows?.length ? getLatestFromRows(histPre.rows) : null;
    if (!latestPre?.price) {
      try {
        const history = await fetchHistory(symbol, force);
        const latestH = getLatestFromRows(history.rows || []);
        if (latestH?.price != null) {
          const data = buildQuoteFromLatest(latestH);
          cacheQuoteData(symbol, data);
          app.lastApiFailure = null;
          return data;
        }
      } catch (histErr) {
        recordApiAttempt(attempts, "HistoryFirst", "", histErr);
      }
    }
  }

  // force=true またはキャッシュに価格が無い場合は Yahoo を試す（初回は必ず取得できるようにする）
  if (force || isYahooAccessAllowed(symbol) || cache?.data?.price == null) {
  for (const url of urls) {
    try {
      const json = await queuedFetchJson(url);
      const result = json?.quoteResponse?.result?.[0];
      if (!result) throw new Error("Yahoo quote symbol not found");
      const price = toFiniteNumber(result.regularMarketPrice)
        ?? toFiniteNumber(result.postMarketPrice)
        ?? toFiniteNumber(result.preMarketPrice);
      if (price == null) throw new Error("Yahoo quote has no price");

      const rawName = (result.longName || result.shortName || "").trim();
      const data = {
        symbol,
        name: rawName || (symbol && /\.T$/i.test(symbol) ? getJpDisplayName(symbol) : null) || symbol,
        price,
        asOfMs: result.regularMarketTime ? Number(result.regularMarketTime) * 1000 : Date.now()
      };
      cacheQuoteData(symbol, data);
      app.lastApiFailure = null;
      return data;
    } catch (error) {
      recordApiAttempt(attempts, "Yahoo", url, error);
    }
  }
  }

  // Yahoo を叩いても失敗した場合（force=false）は、キャッシュがあればそれを返す
  if (!force && cache?.data?.price != null) {
    return cache.data;
  }

  try {
    const fallback = await fetchQuoteFallback(symbol, attempts);
    cacheQuoteData(symbol, fallback);
    app.lastApiFailure = null;
    return fallback;
  } catch (fallbackError) {
    recordApiAttempt(attempts, "Fallback", "", fallbackError);
  }

  try {
    const history = await fetchHistory(symbol, false);
    const latest = getLatestFromRows(history.rows || []);
    if (latest?.price != null) {
      const fallbackByHistory = buildQuoteFromLatest(latest);
      cacheQuoteData(symbol, fallbackByHistory);
      app.lastApiFailure = null;
      return fallbackByHistory;
    }
  } catch (historyError) {
    recordApiAttempt(attempts, "HistoryDerived", "", historyError);
  }

  const merged = buildApiError("現在値取得に失敗しました。", "quote", symbol, attempts, null);
  captureApiFailure(merged, symbol, "quote");
  throw merged;
}

/** 月次確定など「過去の特定月」の日足を取るため、JST で対象月±pad 日を Unix 範囲にする */
function getUnixRangeForSeasonChart(seasonKey, padDays = 21) {
  const first = getSeasonFirstDateKey(seasonKey);
  const last = getSeasonLastDateKey(seasonKey);
  if (!first || !last) return null;
  const startKey = shiftDateKey(first, -padDays);
  const endKey = shiftDateKey(last, padDays);
  const isoStart = isoFromZoneLocal(startKey, "00:00:00", "Asia/Tokyo");
  const isoEnd = isoFromZoneLocal(endKey, "23:59:59", "Asia/Tokyo");
  const t1 = Math.floor(Date.parse(isoStart) / 1000);
  const t2 = Math.floor(Date.parse(isoEnd) / 1000);
  if (!Number.isFinite(t1) || !Number.isFinite(t2) || t2 <= t1) return null;
  return { period1: t1, period2: t2 };
}

/**
 * @param {string} symbol
 * @param {boolean} force
 * @param {string} [settleSeasonKey] 月次確定時のみ: Yahoo の range=3mo では足りない過去月を period1/2 で取得
 */
async function fetchHistory(symbol, force, settleSeasonKey) {
  const cache = app.state.apiCache.history[symbol];
  const market = inferMarketFromKnownSymbol(symbol);
  const settleKey =
    typeof settleSeasonKey === "string" && /^\d{4}-\d{2}$/.test(settleSeasonKey) ? settleSeasonKey : "";

  // CRYPTO は Yahoo を使わず（CryptoCompareのみ）履歴を取る。
  // force=true でも Yahoo 側を触らないことで、余計な負荷/失敗を防ぐ。
  if (market === "CRYPTO") {
    if (!force && cache && Date.now() - cache.ts < CONFIG.historyTtlMs && Array.isArray(cache.rows)) {
      return { symbol, rows: cache.rows };
    }
    const crOpts =
      force && settleKey
        ? (() => {
            const r = getUnixRangeForSeasonChart(settleKey);
            return r ? { toTs: r.period2, limit: 2000 } : {};
          })()
        : {};
    try {
      const rows = await fetchHistoryFromCryptoCompare(symbol, crOpts);
      cacheHistoryRows(symbol, rows);
      app.lastApiFailure = null;
      return { symbol, rows: app.state.apiCache.history[symbol].rows };
    } catch (err) {
      // 失敗してもキャッシュがあればそれを返す（緊急時以外は無理に再試行しない）
      if (cache?.rows?.length) return { symbol, rows: cache.rows };
      const merged = buildApiError("履歴取得に失敗しました。", "history", symbol, [], err);
      captureApiFailure(merged, symbol, "history");
      throw merged;
    }
  }

  if (!force && cache && Date.now() - cache.ts < CONFIG.historyTtlMs && Array.isArray(cache.rows)) {
    return { symbol, rows: cache.rows };
  }

  const attempts = [];
  const rangeForSettle = force && settleKey ? getUnixRangeForSeasonChart(settleKey) : null;
  const rangeParam = rangeForSettle
    ? `period1=${rangeForSettle.period1}&period2=${rangeForSettle.period2}`
    : "range=3mo";
  const urls = [
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&${rangeParam}`
  ];

  // Yahoo 利用不可（市場時間外など）なら、疑似履歴を作らずキャッシュ履歴を返す
  // ※ force=true は「明示的に最新化したい」ケースなので Yahoo 優先
  if (!force && !isYahooAccessAllowed(symbol) && cache?.rows?.length) {
    return { symbol, rows: cache.rows };
  }

  // force=true またはキャッシュに履歴が無い場合は Yahoo を試す（初回は必ず取得できるようにする）
  if (force || isYahooAccessAllowed(symbol) || !(cache?.rows?.length)) {
  for (const url of urls) {
    try {
      const json = await queuedFetchJson(url);
      const result = json?.chart?.result?.[0];
      if (!result) throw new Error("Yahoo history symbol not found");
      const timestamps = result.timestamp || [];
      const quote = result.indicators?.quote?.[0] || {};
      const closes = quote.close || [];
      const opens = quote.open || [];
      const highs = quote.high || [];
      const lows = quote.low || [];
      const rows = [];

      for (let i = 0; i < timestamps.length; i += 1) {
        const close = toFiniteNumber(closes[i]);
        if (close == null) continue;
        const date = epochSecToDateKey(timestamps[i]);
        const open = toFiniteNumber(opens[i]);
        const high = toFiniteNumber(highs[i]);
        const low = toFiniteNumber(lows[i]);
        const o = open != null ? open : close;
        rows.push({
          date,
          open: o,
          high: high != null ? high : Math.max(o, close),
          low: low != null ? low : Math.min(o, close),
          close
        });
      }

      if (!rows.length) throw new Error("Yahoo history is empty");
      rows.sort((a, b) => a.date.localeCompare(b.date));
      cacheHistoryRows(symbol, rows);
      app.lastApiFailure = null;
      return { symbol, rows: app.state.apiCache.history[symbol].rows };
    } catch (error) {
      recordApiAttempt(attempts, "Yahoo", url, error);
    }
  }
  }

  try {
    const fallbackRows = await fetchHistoryFallback(symbol, attempts);
    cacheHistoryRows(symbol, fallbackRows);
    app.lastApiFailure = null;
    return { symbol, rows: app.state.apiCache.history[symbol].rows };
  } catch (fallbackError) {
    recordApiAttempt(attempts, "Fallback", "", fallbackError);
  }

  // 疑似履歴（現在値だけで1本履歴を作る）を作らない。
  // キャッシュがあればそれを使い、無ければエラーにする。
  if (cache?.rows?.length) {
    app.lastApiFailure = null;
    return { symbol, rows: cache.rows };
  }

  const merged = buildApiError("履歴取得に失敗しました。", "history", symbol, attempts, null);
  captureApiFailure(merged, symbol, "history");
  throw merged;
}
function cacheQuoteData(symbol, data) {
  app.state.apiCache.quote[symbol] = {
    ts: Date.now(),
    data
  };
  pruneApiCache(app.state.apiCache);
  scheduleSaveState();
}

function cacheHistoryRows(symbol, rows) {
  app.state.apiCache.history[symbol] = {
    ts: Date.now(),
    rows: rows.slice(-220)
  };
  pruneApiCache(app.state.apiCache);
  scheduleSaveState();
}

async function fetchQuoteFallback(symbol, attempts = []) {
  const market = inferMarketFromKnownSymbol(symbol);
  if (market === "CRYPTO") {
    try {
      return await fetchQuoteFromCryptoCompare(symbol);
    } catch (error) {
      recordApiAttempt(attempts, "CryptoCompare", "https://min-api.cryptocompare.com/data/price", error);
    }
  }
  // Stooq はブラウザCORSで失敗しやすいため、ここでは呼ばない。
  // 呼び出し元では fetchHistory（Yahoo）由来のフォールバックがあるため、そちらへ回す。
  const err = new Error("Stooq is not usable in browser (CORS).");
  recordApiAttempt(attempts, "Stooq", "https://stooq.com", err);
  throw buildApiError("株価APIの現在値取得に失敗しました。", "quote", symbol, attempts, err);
}

async function fetchQuoteFromCryptoCompare(symbol) {
  const base = symbol.replace(/-USD$/i, "").toUpperCase();
  const url = `https://min-api.cryptocompare.com/data/price?fsym=${encodeURIComponent(base)}&tsyms=USD`;
  const json = await queuedFetchJson(url);
  const price = toFiniteNumber(json?.USD);
  if (price == null) throw new Error("CryptoCompareの現在値取得に失敗しました。");
  return {
    symbol: `${base}-USD`,
    name: symbolPresetMap.get(`${base}-USD`)?.name || base,
    price,
    asOfMs: Date.now()
  };
}

/** Stooq は CORS を返さないためブラウザから直接取得すると network_or_cors で失敗する。米国株は isYahooAccessAllowed を NY 市場時間に広げて Yahoo を使うこと。 */
async function fetchQuoteFromStooq(symbol) {
  const stooqSymbol = toStooqSymbol(symbol);
  const url = `https://stooq.com/q/l/?s=${encodeURIComponent(stooqSymbol)}&f=sd2t2ohlcv&h&e=json`;
  const json = await queuedFetchJson(url);
  const item = Array.isArray(json?.symbols) ? json.symbols[0] : null;
  const price = toFiniteNumber(item?.close);
  if (!item || price == null || price <= 0) throw new Error("Stooqの現在値取得に失敗しました。");
  const name = /\.T$/i.test(symbol) ? (getJpDisplayName(symbol) || symbolPresetMap.get(symbol)?.name) : symbolPresetMap.get(symbol)?.name;
  return {
    symbol,
    name: name || symbol,
    price,
    asOfMs: Date.now()
  };
}

async function fetchHistoryFallback(symbol, attempts = []) {
  const market = inferMarketFromKnownSymbol(symbol);
  if (market === "CRYPTO") {
    try {
      return await fetchHistoryFromCryptoCompare(symbol);
    } catch (error) {
      recordApiAttempt(attempts, "CryptoCompare", "https://min-api.cryptocompare.com/data/v2/histoday", error);
    }
  }
  // Stooq はブラウザCORSで失敗しやすいため、ここでは呼ばない。
  // Yahoo history がダメな場合は最終的にエラーになる。
  const err = new Error("Stooq is not usable in browser (CORS).");
  recordApiAttempt(attempts, "Stooq", "https://stooq.com", err);
  throw buildApiError("株価APIの履歴取得に失敗しました。", "history", symbol, attempts, err);
}

async function fetchHistoryFromCryptoCompare(symbol, opts) {
  const options = opts && typeof opts === "object" ? opts : {};
  const base = symbol.replace(/-USD$/i, "").toUpperCase();
  const limit = Math.min(2000, Math.max(1, Number(options.limit) || 220));
  let url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${encodeURIComponent(base)}&tsym=USD&limit=${limit}`;
  const toTs = Number(options.toTs);
  if (Number.isFinite(toTs) && toTs > 0) url += `&toTs=${Math.floor(toTs)}`;
  const json = await queuedFetchJson(url);
  const arr = Array.isArray(json?.Data?.Data) ? json.Data.Data : [];
  const rows = [];
  for (const item of arr) {
    const close = toFiniteNumber(item?.close);
    const open = toFiniteNumber(item?.open);
    const high = toFiniteNumber(item?.high);
    const low = toFiniteNumber(item?.low);
    const t = toFiniteNumber(item?.time);
    if (close == null || t == null) continue;
    const o = open != null ? open : close;
    rows.push({
      date: epochSecToDateKey(t),
      open: o,
      high: high != null ? high : Math.max(o, close),
      low: low != null ? low : Math.min(o, close),
      close
    });
  }
  if (!rows.length) throw new Error("CryptoCompareの履歴取得に失敗しました。");
  rows.sort((a, b) => a.date.localeCompare(b.date));
  return rows;
}

async function fetchHistoryFromStooq(symbol) {
  const stooqSymbol = toStooqSymbol(symbol);
  const url = `https://stooq.com/q/d/l/?s=${encodeURIComponent(stooqSymbol)}&i=d`;
  const csv = await queuedFetchText(url);
  const lines = String(csv || "").split(/\r?\n/).filter(Boolean);
  if (lines.length <= 1) throw new Error("Stooqの履歴取得に失敗しました。");
  const rows = [];
  for (const line of lines.slice(1)) {
    const cols = line.split(",");
    if (cols.length < 5) continue;
    const date = String(cols[0] || "").trim();
    const open = toFiniteNumber(cols[1]);
    const high = toFiniteNumber(cols[2]);
    const low = toFiniteNumber(cols[3]);
    const close = toFiniteNumber(cols[4]);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || close == null) continue;
    const o = open != null ? open : close;
    rows.push({
      date,
      open: o,
      high: high != null ? high : Math.max(o, close),
      low: low != null ? low : Math.min(o, close),
      close
    });
  }
  if (!rows.length) throw new Error("Stooq履歴が取得できませんでした。");
  rows.sort((a, b) => a.date.localeCompare(b.date));
  return rows;
}

function inferMarketFromKnownSymbol(symbol) {
  const s = String(symbol || "").toUpperCase();
  if (s.endsWith(".T")) return "JP";
  if (s.endsWith("-USD")) return "CRYPTO";
  return "US";
}

function toStooqSymbol(symbol) {
  const upper = String(symbol || "").toUpperCase();
  if (upper.endsWith(".T")) {
    return `${upper.replace(/\.T$/i, "").toLowerCase()}.jp`;
  }
  if (upper.endsWith("-USD")) {
    return `${upper.replace(/-USD$/i, "").toLowerCase()}usd`;
  }
  return `${upper.toLowerCase()}.us`;
}

/** 全 fetch 合計のスライディングウィンドウ。超過時は一定時間すべての通信を拒否 */
const abuseFetchGate = { timestamps: [], blockedUntil: 0 };
/** クールダウン中の fetch 試行ごとにグローバル制限を積み上げすぎないよう間引き（ms） */
let lastFetchAbuseCooldownEscalationAt = 0;

/** Yahoo Finance ドメインへの連続リクエスト間隔（query1 / chart / search 共通） */
let lastYahooFinanceRequestAt = 0;

/** saveState でキャッシュ全消し通知を連打しない */
let saveStateCacheClearNoticeShown = false;

/** 価格キャッシュ更新のたびの saveState 連打を避ける（即時保存は saveState、タブ非表示で確実に書く） */
let saveStateDebounceTimer = null;
const SAVE_STATE_DEBOUNCE_MS = 500;

function scheduleSaveState() {
  if (saveStateDebounceTimer != null) clearTimeout(saveStateDebounceTimer);
  saveStateDebounceTimer = setTimeout(() => {
    saveStateDebounceTimer = null;
    persistStateToStorage();
  }, SAVE_STATE_DEBOUNCE_MS);
}

function registerSaveStateLifecycleHooks() {
  const flush = () => {
    try {
      saveState();
    } catch (_) {}
  };
  window.addEventListener("beforeunload", flush);
  window.addEventListener("pagehide", flush);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush();
  });
}

function isYahooFinanceUrl(url) {
  return /finance\.yahoo\.com/i.test(String(url || ""));
}

async function waitYahooFinanceMinIntervalIfNeeded(url) {
  if (!isYahooFinanceUrl(url)) return;
  const minGap = Number(CONFIG.yahooFinanceMinGapMs) || 0;
  if (minGap <= 0) return;
  const wait = Math.max(0, lastYahooFinanceRequestAt + minGap - Date.now());
  if (wait > 0) await sleep(wait);
  lastYahooFinanceRequestAt = Date.now();
}

/**
 * queuedFetch* の直前に呼ぶ。制限中・またはしきい値超過時は例外を投げる。
 */
function checkAbuseFetchGateOrThrow() {
  const now = Date.now();
  if (now < abuseFetchGate.blockedUntil) {
    if (now - lastFetchAbuseCooldownEscalationAt >= 5000) {
      lastFetchAbuseCooldownEscalationAt = now;
      recordFetchAbuseStrike("cooldown");
    }
    const sec = Math.ceil((abuseFetchGate.blockedUntil - now) / 1000);
    throw new Error(`サーバー負荷防止のため、あと${sec}秒間は通信が制限されています。`);
  }
  const win = CONFIG.abuseFetchWindowMs;
  const max = CONFIG.abuseFetchMaxPerWindow;
  abuseFetchGate.timestamps = abuseFetchGate.timestamps.filter((t) => now - t < win);
  abuseFetchGate.timestamps.push(now);
  if (abuseFetchGate.timestamps.length > max) {
    abuseFetchGate.blockedUntil = now + CONFIG.abuseFetchCooldownMs;
    abuseFetchGate.timestamps = [];
    const min = Math.max(1, Math.ceil(CONFIG.abuseFetchCooldownMs / 60000));
    showGlobalNotice(
      `短時間に通信が多すぎます。DDoSや過度な負荷を防ぐため、約${min}分間はデータ取得を制限します。`,
      true
    );
    recordFetchAbuseStrike("burst");
    throw new Error("通信が制限されています。しばらく待ってからお試しください。");
  }
}

async function queuedFetchJson(url) {
  const runner = async () => {
    checkAbuseFetchGateOrThrow();
    const waitMs = Math.max(0, app.nextFetchAt - Date.now());
    if (waitMs > 0) await sleep(waitMs);
    await waitYahooFinanceMinIntervalIfNeeded(url);
    const baseGap =
      app.interactiveFetch && Number.isFinite(CONFIG.interactiveFetchGapMs)
        ? CONFIG.interactiveFetchGapMs
        : CONFIG.fetchGapMs;
    const gapMs = isYahooFinanceUrl(url)
      ? Math.max(baseGap, Number(CONFIG.yahooFinanceMinGapMs) || 0)
      : baseGap;
    app.nextFetchAt = Date.now() + gapMs;
    const timeoutMs = app.interactiveFetch && CONFIG.interactiveFetchTimeoutMs
    ? CONFIG.interactiveFetchTimeoutMs
    : CONFIG.fetchTimeoutMs;
    return fetchJson(url, timeoutMs);
  };

  const chain = app.fetchChain.then(runner, runner);
  app.fetchChain = chain.catch(() => undefined);
  return chain;
}

async function queuedFetchText(url) {
  const runner = async () => {
    checkAbuseFetchGateOrThrow();
    const waitMs = Math.max(0, app.nextFetchAt - Date.now());
    if (waitMs > 0) await sleep(waitMs);
    await waitYahooFinanceMinIntervalIfNeeded(url);
    const baseGap =
      app.interactiveFetch && Number.isFinite(CONFIG.interactiveFetchGapMs)
        ? CONFIG.interactiveFetchGapMs
        : CONFIG.fetchGapMs;
    const gapMs = isYahooFinanceUrl(url)
      ? Math.max(baseGap, Number(CONFIG.yahooFinanceMinGapMs) || 0)
      : baseGap;
    app.nextFetchAt = Date.now() + gapMs;
    const timeoutMs = app.interactiveFetch && CONFIG.interactiveFetchTimeoutMs
    ? CONFIG.interactiveFetchTimeoutMs
    : CONFIG.fetchTimeoutMs;
    return fetchText(url, timeoutMs);
  };

  const chain = app.fetchChain.then(runner, runner);
  app.fetchChain = chain.catch(() => undefined);
  return chain;
}

function buildFetchRoutes(rawUrl) {
  const host = getHostFromUrl(rawUrl);
  const preferred = host ? app.fetchRouteByHost.get(host) : "";
  const allowProxy = shouldUseProxyForUrl(rawUrl);
  const prefixes = [];
  const addPrefix = (prefix) => {
    const safe = typeof prefix === "string" ? prefix : "";
    if (prefixes.includes(safe)) return;
    prefixes.push(safe);
  };

  if (typeof preferred === "string") addPrefix(preferred);
  addPrefix("");
  if (allowProxy) {
    for (const prefix of CONFIG.proxyPrefixes || []) {
      addPrefix(prefix);
    }
  }

  const routes = prefixes.map((prefix) => ({
    prefix,
    requestUrl: buildFetchUrl(rawUrl, prefix),
    label: prefix ? `proxy:${getHostFromUrl(prefix) || "custom"}` : "direct",
    host
  }));
  const maxRoutes = Number.isFinite(CONFIG.maxRouteAttemptsPerRequest)
    ? Math.max(1, Math.floor(CONFIG.maxRouteAttemptsPerRequest))
    : routes.length;
  return routes.slice(0, maxRoutes);
}

function shouldUseProxyForUrl(rawUrl) {
  const host = getHostFromUrl(rawUrl).toLowerCase();
  if (!host) return false;
  if (/[?&]key=/.test(String(rawUrl || ""))) return false;
  if (host.includes("script.google.com") || host.includes("script.googleusercontent.com")) return false;
  return true;
}

function buildFetchUrl(rawUrl, prefix) {
  if (!prefix) return rawUrl;
  if (prefix.includes("{url}")) {
    return prefix.replace("{url}", encodeURIComponent(rawUrl));
  }
  if (/[?&]url=$/.test(prefix)) {
    return `${prefix}${encodeURIComponent(rawUrl)}`;
  }
  return `${prefix}${rawUrl}`;
}

function rememberFetchRoute(rawUrl, prefix) {
  const host = getHostFromUrl(rawUrl);
  if (!host) return;
  app.fetchRouteByHost.set(host, prefix || "");
}

function getHostFromUrl(url) {
  try {
    return new URL(String(url || "")).host;
  } catch (error) {
    return "";
  }
}

async function fetchJson(url, timeoutMs) {
  let lastError = null;
  const routes = buildFetchRoutes(url);
  const routeAttempts = [];

  for (const route of routes) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(route.requestUrl, {
        method: "GET",
        cache: "no-store",
        signal: controller.signal
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const json = JSON.parse(text);
      rememberFetchRoute(url, route.prefix);
      return json;
    } catch (error) {
      const reason = summarizeApiError(error);
      routeAttempts.push({ route: route.label, reason });
      lastError = new Error(`${route.label} ${reason}`);
    } finally {
      clearTimeout(timer);
    }
  }

  if (lastError) {
    const joined = routeAttempts
      .slice(0, 4)
      .map((x) => `${x.route} ${x.reason}`)
      .join(" | ");
    lastError.message = joined || lastError.message;
    lastError.routeAttempts = routeAttempts;
    // Yahoo はブラウザCORSで落ちることがあるため、直取得失敗後は Jina で回復を試す。
    // ※対話中（現在値ボタン等）もここをスキップすると「全く取得できない」ことがあるため、Jina は常に試す。
    try {
      const rawUrl = String(url || "");
      if (/finance\.yahoo\.com/i.test(rawUrl)) {
        const jinaUrl = "https://r.jina.ai/" + rawUrl;
        const jinaTimeoutMs = Math.max(Number(timeoutMs) || 5000, app.interactiveFetch ? 12000 : 8000);
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), jinaTimeoutMs);
        const res = await fetch(jinaUrl, { method: "GET", cache: "no-store", signal: controller.signal });
        const text = await res.text();
        clearTimeout(timer);
        const trimmed = String(text || "").trim();
        const firstChar = trimmed[0] || "";
        if (firstChar === "{") {
          const lastIdx = trimmed.lastIndexOf("}");
          if (lastIdx > 0) return JSON.parse(trimmed.slice(0, lastIdx + 1));
        }
        if (firstChar === "[") {
          const lastIdx = trimmed.lastIndexOf("]");
          if (lastIdx > 0) return JSON.parse(trimmed.slice(0, lastIdx + 1));
        }
        // それ以外でも、JSON塊が含まれている可能性があるので最初の '{' から最後の '}' を抜く
        const i = trimmed.indexOf("{");
        const j = trimmed.lastIndexOf("}");
        if (i >= 0 && j > i) return JSON.parse(trimmed.slice(i, j + 1));
      }
    } catch (proxyErr) {
      // プロキシ失敗は元の lastError を優先
    }

    throw lastError;
  }
  throw new Error("fetchJson failed");
}

async function fetchText(url, timeoutMs) {
  let lastError = null;
  const routes = buildFetchRoutes(url);
  const routeAttempts = [];

  for (const route of routes) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(route.requestUrl, {
        method: "GET",
        cache: "no-store",
        signal: controller.signal
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      rememberFetchRoute(url, route.prefix);
      return text;
    } catch (error) {
      const reason = summarizeApiError(error);
      routeAttempts.push({ route: route.label, reason });
      lastError = new Error(`${route.label} ${reason}`);
    } finally {
      clearTimeout(timer);
    }
  }

  if (lastError) {
    const joined = routeAttempts
      .slice(0, 4)
      .map((x) => `${x.route} ${x.reason}`)
      .join(" | ");
    lastError.message = joined || lastError.message;
    lastError.routeAttempts = routeAttempts;
    // Yahoo のテキスト取得も CORS で失敗する場合があるため、最後に Jina を試す（対話中も同様）
    try {
      const rawUrl = String(url || "");
      if (/finance\.yahoo\.com/i.test(rawUrl)) {
        const jinaUrl = "https://r.jina.ai/" + rawUrl;
        const jinaTimeoutMs = Math.max(Number(timeoutMs) || 5000, app.interactiveFetch ? 12000 : 8000);
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), jinaTimeoutMs);
        const res = await fetch(jinaUrl, { method: "GET", cache: "no-store", signal: controller.signal });
        const text = await res.text();
        clearTimeout(timer);
        return String(text || "");
      }
    } catch (proxyErr) {
    }
    throw lastError;
  }
  throw new Error("fetchText failed");
}

async function resolveSymbolForAction(raw, marketType) {
  const cleaned = sanitizePickInput(raw);
  const tryMarkets = [marketType];
  if (marketType !== "AUTO") tryMarkets.push("AUTO");
  if (marketType === "JP") tryMarkets.push("US");
  if (marketType === "US") tryMarkets.push("JP");
  if (marketType === "CRYPTO") tryMarkets.push("JP", "US");
  const seen = new Set();
  let baseError = null;
  for (const mt of tryMarkets) {
    if (!mt || seen.has(mt)) continue;
    seen.add(mt);
    try {
      return resolveSymbolInput(cleaned, mt);
    } catch (e) {
      baseError = baseError || e;
    }
  }
  const query = toHalfWidth(cleaned || "").trim();
  if (!query) {
    throw baseError || new Error("銘柄名または銘柄コードを入力してください。");
  }
  try {
    const found = await searchSymbolByName(query, marketType);
    if (found) return found;
    const kanaQuery = hiraToKatakana(query);
    if (kanaQuery !== query) {
      const foundKana = await searchSymbolByName(kanaQuery, marketType);
      if (foundKana) return foundKana;
    }
  } catch (_) {
    /* 検索API不通時は baseError を優先 */
  }
  throw baseError || new Error("銘柄を特定できませんでした。市場の選択や表記（例: 7203.T）を確認してください。");
}

async function searchSymbolByName(query, marketType) {
  const found = await searchSymbolsByName(query, marketType, 1);
  return found[0] || null;
}

async function searchSymbolsByName(query, marketType, limit = 8) {
  const normalized = toHalfWidth(query || "").trim();
  if (!normalized) return [];
  const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(30, Math.floor(limit))) : 8;
  const cacheKey = `${marketType}:${normalizeSearchKey(normalized)}`;
  const cacheHit = app.symbolSuggestCache.get(cacheKey);
  if (cacheHit && Date.now() - cacheHit.ts < 5 * 60 * 1000) {
    const rows = cacheHit.rows.slice(0, safeLimit);
    if (marketType === "JP") {
      rows.sort((a, b) => {
        const aJp = String(a.symbol || "").endsWith(".T") ? 1 : 0;
        const bJp = String(b.symbol || "").endsWith(".T") ? 1 : 0;
        return bJp - aJp;
      });
    }
    return rows;
  }

  const rlMsg = getClientRateLimitMessageIfRejected(
    "yahooSearch",
    CONFIG.clientRateYahooSearchMax,
    CONFIG.clientRateYahooSearchWindowMs
  );
  if (rlMsg) {
    throw new Error(rlMsg);
  }

  const quotesCountPrimary = Math.min(20, Math.max(safeLimit + 4, 12));
  const primaryUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(normalized)}&quotesCount=${quotesCountPrimary}&newsCount=0`;
  const altUrl = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(normalized)}&quotesCount=${quotesCountPrimary}&newsCount=0`;
  const out = [];
  const seen = new Set();

  const pushFromQuotes = (quotes) => {
    for (const item of quotes) {
      const symbol = String(item?.symbol || "").toUpperCase();
      if (!symbol) continue;
      if (seen.has(symbol)) continue;
      const market = inferMarketFromSymbol(symbol, item?.quoteType);
      if (!market) continue;
      if (!isMarketAllowed(market, marketType)) continue;
      out.push({
        symbol,
        market,
        nameGuess: String(item?.shortname || item?.longname || symbol)
      });
      seen.add(symbol);
      if (out.length >= safeLimit) break;
    }
  };

  let json = null;
  try {
    json = await queuedFetchJson(primaryUrl);
  } catch (_) {
    json = null;
  }
  let quotes = Array.isArray(json?.quotes) ? json.quotes : [];
  pushFromQuotes(quotes);

  // query2 は「primary で1件も取れなかったとき」だけ（件数が足りないだけでは二重ヒットしない → Yahoo 負荷削減）
  if (out.length === 0) {
    try {
      json = await queuedFetchJson(altUrl);
      quotes = Array.isArray(json?.quotes) ? json.quotes : [];
      pushFromQuotes(quotes);
    } catch (_) {}
  }

  if (marketType === "JP" && out.length < safeLimit && !out.some((x) => String(x.symbol || "").endsWith(".T"))) {
    const url2 = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(normalized + " 株")}&quotesCount=12&newsCount=0`;
    try {
      const json = await queuedFetchJson(url2);
      const quotes = Array.isArray(json?.quotes) ? json.quotes : [];
      for (const item of quotes) {
        const symbol = String(item?.symbol || "").toUpperCase();
        if (!symbol || seen.has(symbol)) continue;
        const market = inferMarketFromSymbol(symbol, item?.quoteType);
        if (!market || !isMarketAllowed(market, marketType)) continue;
        out.push({
          symbol,
          market,
          nameGuess: String(item?.shortname || item?.longname || symbol)
        });
        seen.add(symbol);
        if (out.length >= safeLimit) break;
      }
    } catch (_) {}
  }

  out.sort((a, b) => {
    if (marketType !== "JP") return 0;
    const aJp = String(a.symbol || "").endsWith(".T") ? 1 : 0;
    const bJp = String(b.symbol || "").endsWith(".T") ? 1 : 0;
    return bJp - aJp;
  });

  // 連想キャッシュは TTL + 件数上限で抑制（長時間稼働のメモリ増を防ぐ）
  const nowTs = Date.now();
  const ttlMs = 5 * 60 * 1000;
  for (const [k, v] of app.symbolSuggestCache.entries()) {
    if (!v || !Number.isFinite(v.ts)) continue;
    if (nowTs - v.ts > ttlMs) app.symbolSuggestCache.delete(k);
  }
  const maxEntries = 120;
  if (app.symbolSuggestCache.size > maxEntries) {
    const entries = [...app.symbolSuggestCache.entries()].sort((a, b) => (a[1]?.ts || 0) - (b[1]?.ts || 0));
    const toRemove = app.symbolSuggestCache.size - maxEntries;
    for (let i = 0; i < toRemove; i += 1) app.symbolSuggestCache.delete(entries[i][0]);
  }

  app.symbolSuggestCache.set(cacheKey, { ts: nowTs, rows: out.slice(0, 12) });
  return out.slice(0, safeLimit);
}

function resolveSymbolInput(raw, marketType) {
  const normalized = normalizeSymbolInput(raw);
  if (!normalized) throw new Error("銘柄名または銘柄コードを入力してください。");

  const alias = aliasMap.get(normalized.toLowerCase());
  if (alias) {
    return {
      symbol: alias.symbol,
      market: alias.market,
      nameGuess: alias.name
    };
  }

  // 市場の取り違え: 米国株・仮想通貨モードでも東証の4桁・xxxx.T は日本株として解釈
  if (marketType === "US" || marketType === "CRYPTO") {
    const m = normalized.match(/^(\d{4})(\.T)?$/i);
    if (m) {
      const symbol = `${m[1]}.T`.toUpperCase();
      return {
        symbol,
        market: "JP",
        nameGuess: symbolPresetMap.get(symbol)?.name || symbol
      };
    }
  }

  if (marketType === "JP" || marketType === "AUTO") {
    const digits = normalized.match(/^\d{4}$/);
    if (digits) {
      const symbol = `${digits[0]}.T`;
      return {
        symbol,
        market: "JP",
        nameGuess: symbolPresetMap.get(symbol)?.name || symbol
      };
    }
    const alpha = normalized.match(/^\d{3}[A-Z]$/);
    if (alpha) {
      const symbol = `${alpha[0]}.T`;
      return {
        symbol,
        market: "JP",
        nameGuess: symbol
      };
    }
  }

  if ((marketType === "CRYPTO" || marketType === "AUTO") && /^[A-Z]{2,10}-USD$/.test(normalized)) {
    return {
      symbol: normalized,
      market: "CRYPTO",
      nameGuess: symbolPresetMap.get(normalized)?.name || normalized.replace(/-USD$/i, "")
    };
  }

  if ((marketType === "JP" || marketType === "AUTO") && /^[0-9]{4}\.T$/i.test(normalized)) {
    return {
      symbol: normalized.toUpperCase(),
      market: "JP",
      nameGuess: symbolPresetMap.get(normalized.toUpperCase())?.name || normalized.toUpperCase()
    };
  }

  if ((marketType === "JP" || marketType === "AUTO") && /^[0-9]{3}[A-Z]\.T$/i.test(normalized)) {
    return {
      symbol: normalized.toUpperCase(),
      market: "JP",
      nameGuess: normalized.toUpperCase()
    };
  }

  // 自動判定: 上場株のティッカーより先に「登録済み仮想通貨ベース」を判定（BTC 等が米国株扱いになるのを防ぐ）
  if (marketType === "AUTO") {
    const baseAuto = normalized.replace(/-USD$/i, "");
    if (/^[A-Z]{2,10}$/.test(baseAuto) && CRYPTO_BASE_SET.has(baseAuto)) {
      const symbol = `${baseAuto}-USD`;
      return {
        symbol,
        market: "CRYPTO",
        nameGuess: symbolPresetMap.get(symbol)?.name || baseAuto
      };
    }
  }

  if (marketType === "US" || marketType === "AUTO") {
    if (/^[A-Z][A-Z0-9.-]{0,11}$/.test(normalized)) {
      const normalizedSymbol = normalized.toUpperCase();
      return {
        symbol: normalizedSymbol,
        market: normalizedSymbol.endsWith(".T") ? "JP" : "US",
        nameGuess: symbolPresetMap.get(normalizedSymbol)?.name || normalizedSymbol
      };
    }
  }

  if (marketType === "CRYPTO") {
    const base = normalized.replace(/-USD$/i, "");
    if (/^[A-Z]{2,10}$/.test(base) && CRYPTO_BASE_SET.has(base)) {
      const symbol = `${base}-USD`;
      return {
        symbol,
        market: "CRYPTO",
        nameGuess: symbolPresetMap.get(symbol)?.name || base
      };
    }
    if (/^[A-Z]{2,10}$/.test(base)) {
      throw new Error(
        "仮想通貨として対応していないコードです。米国株（例: Cisco の CSCO）は市場を「米国株」または「自動判定」にしてください。"
      );
    }
  }

  throw new Error("入力形式を認識できませんでした。例: 7203 / 7203.T / AAPL / BTC（市場は「自動判定」がおすすめです）");
}

function inferMarketFromSymbol(symbol, quoteType) {
  const sym = String(symbol || "").toUpperCase();
  const qt = String(quoteType || "").toUpperCase();
  if (!sym) return "";
  if (sym.endsWith(".T")) return "JP";
  if (sym.endsWith("-USD") || qt.includes("CRYPTO")) return "CRYPTO";
  if (qt.includes("EQUITY") || qt.includes("ETF") || qt.includes("INDEX") || qt.includes("MUTUALFUND")) return "US";
  if (/^[A-Z][A-Z0-9.-]{0,11}$/.test(sym)) return "US";
  return "";
}

function isMarketAllowed(market, marketType) {
  if (marketType === "AUTO") return true;
  return market === marketType;
}

/** 検索・追加フォーム由来の表記ゆれを弱める（全角・括弧・カンマ等） */
function sanitizePickInput(raw) {
  let s = String(raw || "").normalize("NFKC").trim();
  s = s.replace(/[\u200B-\u200D\uFEFF]/g, "");
  s = s.replace(/^[「【［『（(]+/, "").replace(/[」】］』）)]+$/, "");
  s = s.replace(/[，,]/g, "");
  return s.trim();
}

function normalizeSymbolInput(text) {
  let half = toHalfWidth(sanitizePickInput(text));
  half = half.replace(/．/g, ".");
  half = half.replace(/\s+/g, "");
  half = half.replace(/\.{2,}/g, ".");
  return half.toUpperCase();
}

function normalizeNameKey(name) {
  return toHalfWidth(name || "").trim().toLowerCase();
}

function normalizeSearchKey(value) {
  const half = toHalfWidth(value || "").trim().toLowerCase();
  // normalize katakana to hiragana for fuzzy JP search
  return half.replace(/[\u30A1-\u30F6]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60));
}

function hiraToKatakana(value) {
  return String(value || "").replace(/[\u3041-\u3096]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) + 0x60));
}

function normalizeForModeration(text) {
  return String(text || "")
    .normalize("NFKC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/* 未対応の文字（韓国語・フランス語・キリル等）を含むか */
function containsUnsupportedScript(value) {
  const s = String(value || "").trim();
  if (!s.length) return false;
  if (NAME_REGEX.test(s)) return false;
  if (/[\uAC00-\uD7AF\u1100-\u11FF]/.test(s)) return true; /* 韓国語（ハングル） */
  if (/[\u0400-\u04FF]/.test(s)) return true; /* キリル */
  if (/[\u0600-\u06FF\u0750-\u077F]/.test(s)) return true; /* アラビア */
  if (/[\u0E00-\u0E7F]/.test(s)) return true; /* タイ */
  if (/[à-ÿÀ-ß\u0100-\u024F]/.test(s)) return true; /* ラテン拡張（フランス語等） */
  if (/[^\u3041-\u3096\u30A1-\u30FA\u30FC\u4E00-\u9FA0a-zA-Z0-9 _\-]/.test(s)) return true; /* その他未対応 */
  return false;
}

function validateAccountName(name) {
  const value = (name || "").trim();
  if (!value) return "アカウント名を入力してください。";
  if (containsUnsupportedScript(value)) return "韓国語・フランス語など未対応の言語が含まれています。日本語・英数字・_ - 空白のみ使用できます。";
  if (!NAME_REGEX.test(value)) return "アカウント名は2〜8文字で、日本語/英字/数字と記号（ASCII）を入力してください。";
  if (/^[-_ ]+$/.test(value)) return "記号だけのアカウント名は利用できません。";
  // 記号だらけのアカウント作成を避ける（嫌がらせ対策）
  if (!/[A-Za-z0-9\u3041-\u3096\u30A1-\u30FA\u30FC\u4E00-\u9FA0]/.test(value)) {
    return "アカウント名には英字または数字を含めてください。";
  }
  const normalized = normalizeForModeration(value);
  if (BANNED_NAME_PATTERNS.some((pat) => pat.test(normalized))) return "このアカウント名は利用できません。";
  if (BANNED_NAME_LIST.some((banned) => normalized.includes(normalizeForModeration(String(banned))))) return "このアカウント名は利用できません。";
  return "";
}

function isSequentialRun(run) {
  // run は「連番判定対象（digits または ASCII letters）のみ」想定
  if (run.length < 4) return false;
  let asc = true;
  let desc = true;
  for (let i = 1; i < run.length; i += 1) {
    const a = run.charCodeAt(i - 1);
    const b = run.charCodeAt(i);
    if (b !== a + 1) asc = false;
    if (b !== a - 1) desc = false;
    if (!asc && !desc) return false;
  }
  return asc || desc;
}

function containsSequentialPattern(value) {
  const v = String(value || "");
  // digits: 1234 / 4321 / 12345 など
  const digitRuns = v.match(/\d{4,}/g) || [];
  if (digitRuns.some((r) => isSequentialRun(r))) return true;
  // letters: abcd / dcba など
  const letterRuns = v.match(/[A-Za-z]{4,}/g) || [];
  if (letterRuns.some((r) => isSequentialRun(r.toUpperCase()))) return true;
  return false;
}

function validatePasswordAllowedChars(password) {
  const value = String(password || "");
  if (!value) return "パスワードを入力してください。";
  if (value.length < 4) return "パスワードは4文字以上で入力してください。";
  if (value.length > 30) return "パスワードは30文字以内で入力してください。";

  // 英語・数字・ASCII記号（空白なし）
  if (!/^[A-Za-z0-9!\"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/.test(value)) {
    return "パスワードは英字・数字・記号（ASCII）のみ使用できます。";
  }

  return "";
}

function validatePassword(password) {
  const allowedError = validatePasswordAllowedChars(password);
  if (allowedError) return allowedError;

  const value = String(password || "");
  if (containsSequentialPattern(value)) {
    return "連番（例: 1234 / abcd）は避けてください。";
  }
  return "";
}

function validateRecoveryQuestion(questionId) {
  const id = String(questionId || "").trim();
  if (!id) return "再設定質問を選択してください。";
  if (!RECOVERY_QUESTIONS.some((q) => q.id === id)) return "再設定質問が不正です。";
  return "";
}

function validateRecoveryAnswer(answer) {
  const value = normalizeRecoveryAnswer(answer);
  if (!value) return "再設定の回答を入力してください。";
  if (value.length < 2) return "再設定の回答は2文字以上で入力してください。";
  if (value.length > CONFIG.maxRecoveryAnswerLength) {
    return `再設定の回答は${CONFIG.maxRecoveryAnswerLength}文字以内で入力してください。`;
  }
  if (/[\u0000-\u001F\u007F]/.test(value)) return "再設定の回答に使用できない文字が含まれています。";
  return "";
}

function enforceLoginRateLimit(nameKey) {
  const lockUntil = app.state.security.lockUntil[nameKey] || 0;
  if (Date.now() < lockUntil) {
    const remainMs = lockUntil - Date.now();
    const remainMin = Math.max(1, Math.ceil(remainMs / 60000));
    throw new Error(`あと${remainMin}分でログインできるようになります。`);
  }
}

const LOGIN_LOCK_DURATIONS_MS = [60 * 1000, 2 * 60 * 1000, 5 * 60 * 1000, 10 * 60 * 1000, 15 * 60 * 1000];

function recordFailedLogin(nameKey) {
  const now = Date.now();
  const arr = (app.state.security.failed[nameKey] || []).filter((t) => now - t < CONFIG.loginFailWindowMs);
  arr.push(now);
  app.state.security.failed[nameKey] = arr;
  if (arr.length >= 5) {
    const lockCount = (app.state.security.lockCount[nameKey] || 0) + 1;
    app.state.security.lockCount[nameKey] = lockCount;
    const durationMs = LOGIN_LOCK_DURATIONS_MS[Math.min(lockCount - 1, LOGIN_LOCK_DURATIONS_MS.length - 1)];
    app.state.security.lockUntil[nameKey] = now + durationMs;
    app.state.security.failed[nameKey] = [];
  }
  saveState();
}

function clearFailedLogin(nameKey) {
  delete app.state.security.failed[nameKey];
  delete app.state.security.lockUntil[nameKey];
  delete app.state.security.lockCount[nameKey];
  saveState();
}

function findUserByNameKey(nameKey, includeDeleted) {
  return app.state.users.find((u) => u.nameKey === nameKey && (includeDeleted || !u.isDeleted)) || null;
}

function getCurrentUser() {
  if (!app.sessionUserId) return null;
  const user = app.state.users.find((u) => u.id === app.sessionUserId) || null;
  if (!user || user.isDeleted) return null;
  return user;
}

function getActiveUsers() {
  return app.state.users.filter((u) => !u.isDeleted);
}

function getDisplayName(user) {
  return user.aliasName || user.name;
}

function countOpenPicks(picks) {
  return (picks || []).filter((p) => p.status !== "CLOSED").length;
}

function safeLoadState(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    if (raw.length > CONFIG.maxLocalStorageJsonChars) {
      console.warn("state JSON too large; refusing parse");
      return fallback;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return fallback;
    return parsed;
  } catch (_) {
    return fallback;
  }
}

function loadState() {
  const fallback = createDefaultState();
  try {
    const parsed = safeLoadState(CONFIG.storageKey, null);
    if (!parsed) return fallback;
    return normalizeState(parsed);
  } catch (error) {
    console.error("state load failed", error);
    return fallback;
  }
}

/**
 * @param {{ skipCloudPush?: boolean }} [opts] クラウド pull 直後など、同じ内容を即 push しないときに skipCloudPush: true
 */
function saveState(opts) {
  if (saveStateDebounceTimer != null) {
    clearTimeout(saveStateDebounceTimer);
    saveStateDebounceTimer = null;
  }
  persistStateToStorage(opts && typeof opts === "object" ? opts : {});
}

function persistStateToStorage(opts) {
  const o = opts && typeof opts === "object" ? opts : {};
  try {
    if (!app?.state) return;
    if (app?.state?.security?.saveStateFailed) return;
    app.state.lastSavedAtMs = Date.now();
    let json = JSON.stringify(app.state);
    const soft = CONFIG.maxSerializedStateSoftChars;
    if (json.length > soft) {
      pruneApiCache(app.state.apiCache);
      json = JSON.stringify(app.state);
    }
    if (json.length > soft) {
      pruneApiCache(app.state.apiCache, { aggressive: true });
      json = JSON.stringify(app.state);
    }
    if (json.length > CONFIG.maxLocalStorageJsonChars) {
      app.state.apiCache = { quote: {}, history: {} };
      json = JSON.stringify(app.state);
      if (!saveStateCacheClearNoticeShown) {
        saveStateCacheClearNoticeShown = true;
        try {
          showGlobalNotice("保存データが大きすぎたため、価格キャッシュを空にして保存しました。", true);
        } catch (_) {}
      }
    }
    if (json.length > CONFIG.maxLocalStorageJsonChars) {
      console.error("saveState: still too large after cache clear");
      try {
        showGlobalNotice("データが大きすぎて保存できません。不要なアカウントの削除やページの再読み込みを検討してください。", true);
      } catch (_) {}
      return;
    }
    localStorage.setItem(CONFIG.storageKey, json);
    if (!o.skipCloudPush) scheduleCloudPush();
  } catch (error) {
    console.error("saveState failed", error);
    try {
      if (!app.state.security) app.state.security = createDefaultSecurityState();
      app.state.security.saveStateFailed = true;
      app.state.security.saveStateFailedAt = Date.now();
    } catch (_) {}
    // これ以上の保存が破綻するため、致命エラーとして表示して操作を止める
    try {
      showGlobalNotice("致命: データ保存に失敗しました。続けると状態が巻き戻る可能性があります。ページを再読み込みしてください。", true);
    } catch (_) {}
  }
}

function hydrateSettingsFromQuery() {
  /* GAS removed: no URL params for API config */
}

function createDefaultState() {
  return {
    schemaVersion: CONFIG.schemaVersion,
    currentSeason: getSeasonKeyJst(new Date()),
    lastDailyRefreshDate: "",
    lastRankUpdateAt: "",
    lastSavedAtMs: 0,
    sessionUserId: null,
    settings: {},
    users: [],
    archivedUsers: {},
    reports: [],
    rankings: [],
    apiCache: {
      quote: {},
      history: {}
    },
    security: createDefaultSecurityState()
  };
}

function createDefaultSecurityState() {
  return {
    failed: {},
    lockUntil: {},
    lockCount: {},
    registrationTimestamps: [],
    deviceSeasonCounts: {},
    deviceSeasonConsumed: {},
    autoFix: {
      lastRunAt: 0,
      lastBySymbol: {},
      lastErrorBySymbol: {}
    }
  };
}

function normalizeState(source) {
  const state = createDefaultState();
  if (!source || typeof source !== "object") return state;

  const maxUsersLoad = CONFIG.maxUsers + 32;
  const maxReportsLoad = 2500;
  const maxRankingsLoad = 96;

  state.schemaVersion = Number(source.schemaVersion) || CONFIG.schemaVersion;
  state.currentSeason = typeof source.currentSeason === "string" ? source.currentSeason : state.currentSeason;
  if (typeof state.currentSeason === "string" && state.currentSeason) {
    if (!/^\d{4}-\d{2}$/.test(state.currentSeason) || !Number.isFinite(seasonToIndex(state.currentSeason))) {
      state.currentSeason = getSeasonKeyJst(new Date());
    }
  }
  state.lastDailyRefreshDate = typeof source.lastDailyRefreshDate === "string" ? source.lastDailyRefreshDate : "";
  state.lastRankUpdateAt = typeof source.lastRankUpdateAt === "string" ? source.lastRankUpdateAt : "";
  const rawLastSaved = Number(source.lastSavedAtMs);
  state.lastSavedAtMs = Number.isFinite(rawLastSaved) && rawLastSaved > 0 ? rawLastSaved : 0;
  state.sessionUserId = typeof source.sessionUserId === "string" ? source.sessionUserId : null;
  state.settings = normalizeSettingsState(source.settings);
  let users = Array.isArray(source.users) ? source.users.filter(isValidUserShape).map(normalizeUser) : [];
  if (users.length > maxUsersLoad) users = users.slice(0, maxUsersLoad);
  state.users = users;
  state.archivedUsers = (source.archivedUsers && typeof source.archivedUsers === "object") ? source.archivedUsers : {};
  // archivedUsers も保存期間相当でトリムして localStorage 破綻を抑える
  try {
    const minIndex = seasonToIndex(getSeasonKeyJst(new Date())) - (CONFIG.rankingKeepMonths - 1);
    for (const seasonKey of Object.keys(state.archivedUsers || {})) {
      if (seasonToIndex(seasonKey) < minIndex) delete state.archivedUsers[seasonKey];
    }
  } catch (_) {}
  let reports = Array.isArray(source.reports) ? source.reports.map(normalizeReport).filter(Boolean) : [];
  try {
    const minRepIdx = seasonToIndex(getSeasonKeyJst(new Date())) - (CONFIG.rankingKeepMonths - 1);
    reports = reports.filter((r) => r && r.season && seasonToIndex(r.season) >= minRepIdx);
  } catch (_) {}
  if (reports.length > maxReportsLoad) reports = reports.slice(-maxReportsLoad);
  state.reports = reports;
  let rankings = Array.isArray(source.rankings) ? source.rankings.filter(isValidRankingShape).map(normalizeRanking) : [];
  if (rankings.length > maxRankingsLoad) rankings = rankings.slice(-maxRankingsLoad);
  state.rankings = rankings;
  state.apiCache = normalizeApiCache(source.apiCache);
  pruneApiCache(state.apiCache);
  state.security = normalizeSecurityState(source.security);

  trimRankingsInState(state);
  seedDeviceSeasonConsumedFromUsers(state);
  return state;
}

function seedDeviceSeasonConsumedFromUsers(state) {
  if (!state?.security) return;
  const consumed = { ...(state.security.deviceSeasonConsumed || {}) };
  for (const u of state.users || []) {
    if (!u || u.isDeleted) continue;
    const did = u.registeredDeviceId;
    const se = u.season;
    if (did && se) consumed[buildDeviceSeasonKey(se, did)] = true;
  }
  let minIdx = -Infinity;
  try {
    minIdx = seasonToIndex(getSeasonKeyJst(new Date())) - (CONFIG.rankingKeepMonths + 24);
  } catch (_) {}
  const trimmed = {};
  for (const [k, v] of Object.entries(consumed)) {
    if (!v) continue;
    const m = String(k).match(/^(\d{4}-\d{2})::/);
    if (m && seasonToIndex(m[1]) < minIdx) continue;
    trimmed[k] = true;
  }
  state.security.deviceSeasonConsumed = trimmed;
}

function isValidUserShape(v) {
  return v && typeof v === "object" && typeof v.id === "string" && typeof v.name === "string";
}

function normalizeUser(v) {
  const normalizedPicks = Array.isArray(v.picks)
    ? v.picks.filter(isValidPickShape).slice(0, CONFIG.maxPicks + 24).map(normalizePick)
    : [];
  const hasExplicitPicksLastConfirmed = Array.isArray(v.picksLastConfirmed);
  const picksLastConfirmedSource = hasExplicitPicksLastConfirmed
    ? v.picksLastConfirmed.filter(isValidPickShape).slice(0, CONFIG.maxPicks + 24).map(normalizePick)
    : clonePicksForDraft(normalizedPicks);
  const hadUncommitted =
    v.needsPickConfirm === true || Boolean(v.pickListModified);
  const picks = hadUncommitted ? clonePicksForDraft(picksLastConfirmedSource) : normalizedPicks;
  return {
    id: v.id,
    name: String(v.name || "").slice(0, 24),
    nameKey: typeof v.nameKey === "string" ? v.nameKey.slice(0, 64) : normalizeNameKey(v.name || ""),
    season: typeof v.season === "string" ? v.season : getSeasonKeyJst(new Date()),
    passwordSalt: String(v.passwordSalt || ""),
    passwordHash: String(v.passwordHash || ""),
    passwordAlgo: String(v.passwordAlgo || "legacy_sha256"),
    recoveryQuestionId: typeof v.recoveryQuestionId === "string" ? v.recoveryQuestionId : "",
    recoverySalt: String(v.recoverySalt || ""),
    recoveryHash: String(v.recoveryHash || ""),
    registeredDeviceId: typeof v.registeredDeviceId === "string" ? v.registeredDeviceId : "",
    aliasName: String(v.aliasName || "").slice(0, 40),
    isDeleted: Boolean(v.isDeleted),
    needsPickConfirm: hadUncommitted ? false : Boolean(v.needsPickConfirm),
    pickListModified: false,
    lastPickConfirmAt: typeof v.lastPickConfirmAt === "string" ? v.lastPickConfirmAt : "",
    createdAt: typeof v.createdAt === "string" ? v.createdAt : new Date().toISOString(),
    updatedAt: typeof v.updatedAt === "string" ? v.updatedAt : new Date().toISOString(),
    picks,
    picksLastConfirmed: clonePicksForDraft(picksLastConfirmedSource)
  };
}

function isValidPickShape(v) {
  return v && typeof v === "object" && typeof v.id === "string" && typeof v.symbol === "string";
}

function normalizePick(v) {
  const symRaw = String(v.symbol || "").slice(0, 48);
  const market = normalizeMarket(v.market, symRaw);
  let orderSlot = v.orderSlot == null || v.orderSlot === "" ? null : String(v.orderSlot);
  if (orderSlot == null && typeof v.orderedAt === "string") {
    try {
      const t = new Date(v.orderedAt);
      if (!Number.isNaN(t.getTime())) orderSlot = getOrderSlotForMarket(market, t);
    } catch (_) {}
  }
  if (orderSlot == null) orderSlot = market === "JP" ? "PM" : market === "US" ? "PM" : "12";
  const sellOrderSlot = v.sellOrderSlot == null || v.sellOrderSlot === "" ? orderSlot : String(v.sellOrderSlot);
  return {
    id: v.id,
    symbol: symRaw,
    market,
    displayName: String(v.displayName || symRaw).slice(0, 96),
    orderDate: (() => {
      if (typeof v.orderDate === "string") return v.orderDate;
      // orderedAt からルール通りに補正して、欠落データを「今日」で埋めない
      if (typeof v.orderedAt === "string") {
        try {
          const t = new Date(v.orderedAt);
          if (!Number.isNaN(t.getTime())) return computeEffectiveOrderDate(market, t);
        } catch (_) {}
      }
      return getDateKeyJst(new Date());
    })(),
    orderSlot,
    orderedAt: typeof v.orderedAt === "string" ? v.orderedAt : new Date().toISOString(),
    status: v.status === "CLOSED" ? "CLOSED" : "OPEN",
    entryPrice: (() => { const n = toFiniteNumber(v.entryPrice); return n != null && n > 0 ? n : null; })(),
    entryDate: typeof v.entryDate === "string" ? v.entryDate : null,
    entrySettledAt: typeof v.entrySettledAt === "string" ? v.entrySettledAt : "",
    entryPending: Boolean(v.entryPending || v.entryPrice == null),
    latestPrice: toFiniteNumber(v.latestPrice),
    latestDate: typeof v.latestDate === "string" ? v.latestDate : null,
    latestResolvedAt: typeof v.latestResolvedAt === "string" ? v.latestResolvedAt : "",
    sellPending: Boolean(v.sellPending),
    sellOrderDate: typeof v.sellOrderDate === "string" ? v.sellOrderDate : null,
    sellOrderSlot: sellOrderSlot,
    exitPrice: (() => { const n = toFiniteNumber(v.exitPrice); return n != null && n > 0 ? n : null; })(),
    exitDate: typeof v.exitDate === "string" ? v.exitDate : null,
    sellSettledAt: typeof v.sellSettledAt === "string" ? v.sellSettledAt : "",
    entryPendingReason:
      typeof v.entryPendingReason === "string"
        ? sanitizeFreeTextForStorage(v.entryPendingReason, CONFIG.maxPickPendingReasonFieldLength)
        : "",
    sellPendingReason:
      typeof v.sellPendingReason === "string"
        ? sanitizeFreeTextForStorage(v.sellPendingReason, CONFIG.maxPickPendingReasonFieldLength)
        : ""
  };
}

function isValidRankingShape(v) {
  return v && typeof v === "object" && typeof v.season === "string" && Array.isArray(v.rows);
}

function normalizeRanking(v) {
  const rowsIn = Array.isArray(v.rows) ? v.rows.filter((r) => r && typeof r === "object") : [];
  const rowsCapped = rowsIn.slice(0, 500);
  return {
    season: v.season,
    settledAt: typeof v.settledAt === "string" ? v.settledAt : new Date().toISOString(),
    rows: rowsCapped.map((r) => ({
      userId: String(r.userId || "").slice(0, 80),
      name: String(r.name || "").slice(0, 64),
      displayName: String(r.displayName || r.name || "").slice(0, 64),
      isAnonymized: Boolean(r.isAnonymized),
      returnPct: toFiniteNumber(r.returnPct) ?? 0,
      validPickCount: Number.isFinite(r.validPickCount) ? Math.max(0, Math.floor(r.validPickCount)) : 0,
      symbols: Array.isArray(r.symbols)
        ? r.symbols.map((x) => String(x || "").slice(0, 48)).filter(Boolean).slice(0, 32)
        : [],
      trades: Array.isArray(r.trades) ? r.trades.map(normalizeTrade).filter(Boolean) : [],
      winTrades: Array.isArray(r.winTrades) ? r.winTrades.map(normalizeTrade).filter(Boolean) : []
    }))
  };
}

function normalizeReport(v) {
  if (!v || typeof v !== "object") return null;
  if (!v.targetUserId || !v.reporterId) return null;
  return {
    id: String(v.id || createId("rep")).slice(0, 80),
    season: String(v.season || getSeasonKeyJst(new Date())).slice(0, 16),
    targetUserId: String(v.targetUserId).slice(0, 80),
    reporterId: String(v.reporterId).slice(0, 80),
    aliasForReporter: String(v.aliasForReporter || "").slice(0, 40),
    reason: sanitizeFreeTextForStorage(v.reason, CONFIG.maxReportReasonLength),
    createdAt: typeof v.createdAt === "string" ? v.createdAt : new Date().toISOString()
  };
}

function normalizeTrade(v) {
  if (!v || typeof v !== "object") return null;
  if (!v.symbol) return null;
  return {
    symbol: String(v.symbol),
    market: normalizeMarket(v.market, v.symbol),
    status: String(v.status || "OPEN"),
    entryDate: String(v.entryDate || "-"),
    entryPrice: toFiniteNumber(v.entryPrice) ?? 0,
    exitDate: String(v.exitDate || "-"),
    exitPrice: toFiniteNumber(v.exitPrice) ?? 0,
    returnPct: toFiniteNumber(v.returnPct) ?? 0
  };
}

function normalizeApiCache(apiCache) {
  if (!apiCache || typeof apiCache !== "object") {
    return { quote: {}, history: {} };
  }

  const quote = {};
  const history = {};

  for (const [symbol, item] of Object.entries(apiCache.quote || {})) {
    if (!item || typeof item !== "object") continue;
    if (!Number.isFinite(item.ts)) continue;
    if (!item.data || typeof item.data !== "object") continue;
    quote[symbol] = {
      ts: item.ts,
      data: {
        symbol,
        name: String(item.data.name || symbol),
        price: toFiniteNumber(item.data.price) ?? null,
        asOfMs: Number.isFinite(item.data.asOfMs) ? item.data.asOfMs : Date.now()
      }
    };
  }

  for (const [symbol, item] of Object.entries(apiCache.history || {})) {
    if (!item || typeof item !== "object") continue;
    if (!Number.isFinite(item.ts)) continue;
    const rows = Array.isArray(item.rows)
      ? item.rows.map((r) => ({
        date: String(r.date || ""),
        close: toFiniteNumber(r.close)
      })).filter((r) => r.date && r.close != null)
      : [];
    if (!rows.length) continue;
    history[symbol] = { ts: item.ts, rows };
  }

  return { quote, history };
}

function pruneApiCache(apiCache, opts) {
  const aggressive = Boolean(opts && opts.aggressive);
  const maxQuoteEntries = aggressive ? 100 : 300;
  const maxHistoryEntries = aggressive ? 72 : 180;

  const quoteEntries = Object.entries(apiCache.quote || {}).sort((a, b) => (b[1]?.ts || 0) - (a[1]?.ts || 0));
  const historyEntries = Object.entries(apiCache.history || {}).sort((a, b) => (b[1]?.ts || 0) - (a[1]?.ts || 0));

  apiCache.quote = Object.fromEntries(quoteEntries.slice(0, maxQuoteEntries));
  apiCache.history = Object.fromEntries(historyEntries.slice(0, maxHistoryEntries));
}

function normalizeSecurityState(security) {
  if (!security || typeof security !== "object") return createDefaultSecurityState();
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const failedRetentionMs = 72 * 60 * 60 * 1000;
  const lockStaleMs = 7 * 24 * 60 * 60 * 1000;
  const maxFailedTimestampsPerKey = 32;

  const failed = {};
  for (const [k, arr] of Object.entries(security.failed || {})) {
    if (!Array.isArray(arr) || !k) continue;
    const recent = arr
      .filter((v) => Number.isFinite(v) && now - v < failedRetentionMs)
      .slice(-maxFailedTimestampsPerKey);
    if (recent.length) failed[k] = recent;
  }

  const lockUntil = {};
  for (const [k, v] of Object.entries(security.lockUntil || {})) {
    if (!Number.isFinite(v)) continue;
    if (v < now - lockStaleMs) continue;
    lockUntil[k] = v;
  }

  const lockCount = {};
  for (const [k, v] of Object.entries(security.lockCount || {})) {
    if (!Number.isInteger(v) || v <= 0) continue;
    if (!failed[k] && !lockUntil[k]) continue;
    lockCount[k] = v;
  }

  const registrationTimestamps = Array.isArray(security.registrationTimestamps)
    ? security.registrationTimestamps.filter((t) => Number.isFinite(t) && now - t < windowMs)
    : [];

  let minDevSeasonIdx = -Infinity;
  try {
    minDevSeasonIdx = seasonToIndex(getSeasonKeyJst(new Date())) - (CONFIG.rankingKeepMonths + 2);
  } catch (_) {}
  const deviceSeasonCounts = {};
  if (security.deviceSeasonCounts && typeof security.deviceSeasonCounts === "object") {
    for (const [k, v] of Object.entries(security.deviceSeasonCounts)) {
      const n = Number(v);
      if (!Number.isInteger(n) || n <= 0) continue;
      const m = String(k).match(/^(\d{4}-\d{2})::/);
      if (m && seasonToIndex(m[1]) < minDevSeasonIdx) continue;
      deviceSeasonCounts[k] = n;
    }
  }

  const deviceSeasonConsumed = {};
  if (security.deviceSeasonConsumed && typeof security.deviceSeasonConsumed === "object") {
    for (const [k, v] of Object.entries(security.deviceSeasonConsumed)) {
      if (!v) continue;
      const m = String(k).match(/^(\d{4}-\d{2})::/);
      if (m && seasonToIndex(m[1]) < minDevSeasonIdx) continue;
      deviceSeasonConsumed[k] = true;
    }
  }

  const autoFix = security.autoFix && typeof security.autoFix === "object"
    ? security.autoFix
    : null;
  const lastBySymbol = {};
  const lastErrorBySymbol = {};
  if (autoFix?.lastBySymbol && typeof autoFix.lastBySymbol === "object") {
    for (const [sym, v] of Object.entries(autoFix.lastBySymbol)) {
      const n = Number(v);
      if (Number.isFinite(n) && n > 0) lastBySymbol[sym] = n;
    }
  }
  if (autoFix?.lastErrorBySymbol && typeof autoFix.lastErrorBySymbol === "object") {
    for (const [sym, v] of Object.entries(autoFix.lastErrorBySymbol)) {
      const n = Number(v);
      if (Number.isFinite(n) && n > 0) lastErrorBySymbol[sym] = n;
    }
  }
  const trimSymbolThrottleMap = (map, maxKeys) => {
    const keys = Object.keys(map);
    if (keys.length <= maxKeys) return;
    keys.sort((a, b) => (map[a] || 0) - (map[b] || 0));
    for (let i = 0; i < keys.length - maxKeys; i += 1) delete map[keys[i]];
  };
  trimSymbolThrottleMap(lastBySymbol, 100);
  trimSymbolThrottleMap(lastErrorBySymbol, 100);

  const lastRunAt = Number.isFinite(Number(autoFix?.lastRunAt)) ? Number(autoFix.lastRunAt) : 0;

  return {
    failed,
    lockUntil,
    lockCount,
    registrationTimestamps,
    deviceSeasonCounts,
    deviceSeasonConsumed,
    autoFix: { lastRunAt, lastBySymbol, lastErrorBySymbol }
  };
}

function normalizeSettingsState(settings) {
  return (settings && typeof settings === "object") ? {} : {};
  /* GAS removed: old state.settings.gasEndpoint/gasApiKey are ignored */
}

function trimRankingsInState(state) {
  const minIndex = seasonToIndex(getSeasonKeyJst(new Date())) - (CONFIG.rankingKeepMonths - 1);
  state.rankings = state.rankings
    .filter((item) => seasonToIndex(item.season) >= minIndex)
    .sort((a, b) => a.season.localeCompare(b.season));
}

function buildAliasMap(presets) {
  const map = new Map();
  for (const preset of presets) {
    map.set(preset.symbol.toLowerCase(), preset);
    for (const alias of preset.aliases || []) {
      map.set(toHalfWidth(alias).trim().toLowerCase(), preset);
    }
  }
  return map;
}

function buildSymbolPresetMap(presets) {
  const map = new Map();
  for (const preset of presets) {
    map.set(preset.symbol, preset);
  }
  return map;
}

function normalizeMarket(value, symbol) {
  if (value === "JP" || value === "US" || value === "CRYPTO") return value;
  if (symbol && /\.T$/i.test(String(symbol))) return "JP";
  if (symbol && /-USD$/i.test(String(symbol))) return "CRYPTO";
  return "US";
}

function marketLabel(market) {
  if (market === "JP") return "日本株";
  if (market === "US") return "米国株";
  if (market === "CRYPTO") return "仮想通貨";
  return "-";
}

function formatPrice(value, market) {
  const n = toFiniteNumber(value);
  if (n == null) return "-";
  const currency = market === "JP" ? "JPY" : "USD";
  const fractionDigits = market === "CRYPTO" ? (n >= 100 ? 2 : 4) : (currency === "JPY" ? 0 : 2);
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  }).format(n);
}

function formatPct(value) {
  const n = toFiniteNumber(value);
  if (n == null) return "-";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

function computePickPct(pick) {
  const entry = toFiniteNumber(pick.entryPrice);
  const ref = pick.status === "CLOSED" ? toFiniteNumber(pick.exitPrice) : toFiniteNumber(pick.latestPrice);
  if (entry == null || ref == null || entry <= 0) return null;
  return ((ref - entry) / entry) * 100;
}

const MESSAGE_AUTO_CLEAR_MS = 10 * 1000;

function scheduleMessageAutoClear(key, clearFn) {
  const existing = app.messageAutoClearTimers.get(key);
  if (existing) clearTimeout(existing);
  app.messageAutoClearTimers.set(key, setTimeout(() => {
    clearFn();
    app.messageAutoClearTimers.delete(key);
  }, MESSAGE_AUTO_CLEAR_MS));
}

function showGlobalNotice(message, isError) {
  const box = app.els.globalNotice;
  if (!message) {
    box.classList.add("hidden");
    box.textContent = "";
    return;
  }
  box.classList.remove("hidden");
  box.style.borderLeftColor = isError ? "#b4223a" : "#f1882f";
  box.textContent = message;
  scheduleMessageAutoClear("global", () => {
    box.classList.add("hidden");
    box.textContent = "";
  });
}

function setAccountChangeDoneMessage(el, text) {
  const key = el.id || "msg-" + (el.className || "");
  const t = String(text || "").trim();
  if (!t) {
    setMessage(el, "", false);
    return;
  }
  el.textContent = t;
  el.classList.remove("error", "success");
  el.classList.add("account-settings-done");
  scheduleMessageAutoClear(key, () => {
    el.textContent = "";
    el.classList.remove("account-settings-done");
  });
}

function setMessage(el, text, isError) {
  const key = el.id || "msg-" + (el.className || "");
  el.textContent = text || "";
  el.classList.remove("error", "success", "account-settings-done");
  if (!text) {
    const pending = app.messageAutoClearTimers.get(key);
    if (pending) clearTimeout(pending);
    app.messageAutoClearTimers.delete(key);
    return;
  }
  el.classList.add(isError ? "error" : "success");
  scheduleMessageAutoClear(key, () => {
    el.textContent = "";
    el.classList.remove("error", "success", "account-settings-done");
  });
}

function clearMessage(el) {
  setMessage(el, "", false);
}

function setBusy(flag) {
  app.busyCounter += flag ? 1 : -1;
  if (app.busyCounter < 0) app.busyCounter = 0;
  const busy = app.busyCounter > 0;
  document.body.style.cursor = busy ? "progress" : "";
}

function recordApiAttempt(attempts, provider, endpoint, error) {
  if (!Array.isArray(attempts)) return;
  attempts.push({
    provider: String(provider || "API"),
    endpoint: simplifyEndpoint(endpoint),
    reason: summarizeApiError(error)
  });
}

function simplifyEndpoint(endpoint) {
  const raw = String(endpoint || "");
  if (!raw) return "";
  try {
    const u = new URL(raw);
    return `${u.host}${u.pathname}`;
  } catch (error) {
    return raw.slice(0, 80);
  }
}

function summarizeApiError(error) {
  const msg = error instanceof Error ? error.message : String(error || "");
  if (!msg) return "unknown_error";
  if (/\b(direct|proxy:)/i.test(msg) && /\|/.test(msg)) {
    return msg.slice(0, 180);
  }
  if (/AbortError|aborted|abort|signal is aborted/i.test(msg) || /timeout/i.test(msg)) return "request_timeout_or_abort";
  if (/HTTP 429/.test(msg)) return "http_429";
  if (/HTTP 4\d\d/.test(msg)) return "HTTP4xx";
  if (/HTTP 5\d\d/.test(msg)) return "HTTP5xx";
  if (/Failed to fetch/i.test(msg) || /NetworkError/i.test(msg) || /CORS/i.test(msg) || /TypeError/i.test(msg)) {
    return "network_or_cors";
  }
  if (/Unexpected token|JSON/i.test(msg)) return "invalid_json";
  return msg.slice(0, 96);
}

function buildApiError(message, type, symbol, attempts, fallbackError) {
  const merged = [];
  if (Array.isArray(attempts)) {
    merged.push(...attempts.map((x) => ({ ...x })));
  }

  const fallbackAttempts = fallbackError?.apiContext?.attempts;
  if (Array.isArray(fallbackAttempts) && fallbackAttempts.length) {
    merged.push(...fallbackAttempts.map((x) => ({ ...x })));
  } else if (fallbackError) {
    recordApiAttempt(merged, "Fallback", "", fallbackError);
  }

  const err = new Error(message);
  err.apiContext = {
    type: type || "quote",
    symbol: symbol || "",
    attempts: merged.slice(-8),
    at: new Date().toISOString()
  };
  return err;
}

function captureApiFailure(error, symbol, type) {
  const context = (error && typeof error === "object" && error.apiContext && typeof error.apiContext === "object")
    ? { ...error.apiContext }
    : {
        type: type || "quote",
        symbol: symbol || "",
        attempts: []
      };
  if (!context.symbol && symbol) context.symbol = symbol;
  if (!context.type && type) context.type = type;
  context.at = context.at || new Date().toISOString();
  if (!Array.isArray(context.attempts)) context.attempts = [];
  app.lastApiFailure = context;
  if (context.attempts.length) {
    console.warn("[StockGame API]", context.type, context.symbol, context.attempts);
  }
}

function formatApiFailureSummary(context) {
  if (!context || !Array.isArray(context.attempts) || !context.attempts.length) {
    return "詳細な原因は記録されていません。";
  }
  return context.attempts
    .slice(0, 3)
    .map((x) => `${x.provider}(${x.reason})`)
    .join(" / ");
}

function formatApiFailureDetails(context) {
  if (!context) return "";
  const typeText = context.type === "history" ? "履歴取得" : "現在値取得";
  const atText = context.at ? formatDateTimeJst(context.at) : "-";
  const symbolText = context.symbol ? ` / 銘柄: ${context.symbol}` : "";
  const lines = [`株価API失敗: ${typeText}${symbolText}`, `最終失敗: ${atText}`];
  const attempts = Array.isArray(context.attempts) ? context.attempts.slice(0, 4) : [];
  for (const item of attempts) {
    const endpoint = item.endpoint ? ` [${item.endpoint}]` : "";
    lines.push(`- ${item.provider}${endpoint}: ${item.reason}`);
  }
  return lines.join("\n");
}

function normalizeErrorMessage(error) {
  const msg = error instanceof Error ? error.message : String(error || "操作に失敗しました。");
  if (/同じ銘柄|重複/i.test(msg)) return "この銘柄はすでに追加済みです。重複しています。";
  if (/最大.*件まで/i.test(msg)) return msg;
  if (/最低.*銘柄|銘柄は.*必要/i.test(msg)) return msg;
  if (/通報|削除済み|ID変更|パスワード|ログイン|アカウント名|キーワード/i.test(msg)) return msg;
  const context = (error && typeof error === "object" && error.apiContext) ? error.apiContext : null;
  if (context) {
    return `一時的に株価を取得できませんでした（${formatApiFailureSummary(context)}）。時間をおいて再試行するか、銘柄コードをご確認ください。`;
  }
  if (/Failed to fetch/i.test(msg) || /NetworkError/i.test(msg) || /CORS/i.test(msg) || /request_timeout_or_abort/i.test(msg)) {
    return "ネットワークエラーです。接続を確認して再試行してください。";
  }
  if (/HTTP 429/i.test(msg)) return "リクエストが多すぎます。しばらく待ってから再試行してください。";
  if (/HTTP 4\d\d/.test(msg) || /HTTP4xx/i.test(msg)) return "APIアクセスが拒否されました。しばらく待って再試行してください。";
  if (/HTTP 5\d\d/.test(msg) || /HTTP5xx/i.test(msg)) return "サーバーエラーです。しばらく後に再試行してください。";
  if (/timeout|abort|AbortError/i.test(msg)) return "通信がタイムアウトしました。再試行してください。";
  if (/not found|見つかりません|取得に失敗/i.test(msg)) return msg;
  return msg;
}

function getSeasonKeyJst(date) {
  const p = getJstParts(date);
  return `${p.year}-${pad2(p.month)}`;
}

function getDateKeyJst(date) {
  const p = getJstParts(date);
  return `${p.year}-${pad2(p.month)}-${pad2(p.day)}`;
}

function getJstParts(date) {
  return getTimePartsByZone(date, CONFIG.jstTimeZone);
}

function isPurchaseWindowOpen(date) {
  const p = getJstParts(date);
  return p.day >= 1 && p.day <= CONFIG.purchaseDays;
}

/** Yahoo Finance の利用可否。市場時間外はキャッシュ優先にして負荷を抑える。 */
function isYahooAccessAllowed(symbol) {
  const s = String(symbol || "").toUpperCase();
  if (s.endsWith(".T")) {
    // .T（日本株）は始値側/終値側の短い窓だけ許可（負荷最小化）
    const p = getTimePartsByZone(new Date(), "Asia/Tokyo");
    const min = p.hour * 60 + p.minute;
    if (min >= 9 * 60 + 45 && min <= 10 * 60 + 15) return true;
    if (min >= 15 * 60 + 48 && min <= 16 * 60 + 5) return true;
    return false;
  }
  if (s.endsWith("-USD")) return false; // 仮想通貨は CryptoCompare 系
  // 米国株: NY市場時間中は許可（それ以外はキャッシュ優先）
  const p = getTimePartsByZone(new Date(), "America/New_York");
  const min = p.hour * 60 + p.minute;
  return min >= 9 * 60 + 30 && min <= 16 * 60 + 30;
}

function getTimePartsByZone(date, timeZone) {
  const dtf = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
  const out = {};
  for (const part of dtf.formatToParts(date)) {
    if (part.type !== "literal") out[part.type] = part.value;
  }
  return {
    year: Number(out.year),
    month: Number(out.month),
    day: Number(out.day),
    hour: Number(out.hour),
    minute: Number(out.minute),
    second: Number(out.second)
  };
}

function computeEffectiveOrderDate(market, now) {
  const date = now instanceof Date ? now : new Date();
  if (market === "JP") {
    const p = getTimePartsByZone(date, "Asia/Tokyo");
    const dateKey = `${p.year}-${pad2(p.month)}-${pad2(p.day)}`;
    // 日本株の PM 約定は 15:33 頃なので、15:30-15:32 は翌日へ送らない
    if (p.hour > 15 || (p.hour === 15 && p.minute >= 33)) {
      return shiftDateKey(dateKey, 1);
    }
    return dateKey;
  }
  if (market === "US") {
    const p = getTimePartsByZone(date, "America/New_York");
    const dateKey = `${p.year}-${pad2(p.month)}-${pad2(p.day)}`;
    if (p.hour >= 16) {
      return shiftDateKey(dateKey, 1);
    }
    return dateKey;
  }
  if (market === "CRYPTO") {
    const p = getTimePartsByZone(date, "Asia/Tokyo");
    // CRYPTO は 00:00 と 12:00 の2回約定。
    // 次の約定スロットへ送るため、12:00 以降は「翌日00」として扱う。
    const dateKey = `${p.year}-${pad2(p.month)}-${pad2(p.day)}`;
    return p.hour < 12 ? dateKey : shiftDateKey(dateKey, 1);
  }

  const p = getTimePartsByZone(date, "UTC");
  return `${p.year}-${pad2(p.month)}-${pad2(p.day)}`;
}

/** 日本株・米国株: 1日2回のみ約定。AM=始値30分後, PM=終値（日本株は15:33頃）。仮想通貨: "00"=00:00, "12"=12:00 (JST) */
function getOrderSlotForMarket(market, now) {
  const date = now instanceof Date ? now : new Date();
  if (market === "JP") {
    const p = getTimePartsByZone(date, "Asia/Tokyo");
    if (p.hour > 15 || (p.hour === 15 && p.minute >= 33)) return "AM";
    return p.hour < 9 || (p.hour === 9 && p.minute < 30) ? "AM" : "PM";
  }
  if (market === "US") {
    const p = getTimePartsByZone(date, "America/New_York");
    if (p.hour >= 16) return "AM";
    return p.hour < 10 || (p.hour === 9 && p.minute < 30) ? "AM" : "PM";
  }
  const p = getTimePartsByZone(date, "Asia/Tokyo");
  // CRYPTO は「次の約定」へ送る。
  // 00:00-11:59 → 当日12（slot="12"）
  // 12:00-23:59 → 翌日00（slot="00"）
  return p.hour < 12 ? "12" : "00";
}

function jpSlotScheduledIso(dateKey, slot) {
  if (!dateKey) return "";
  const s = String(slot || "").toUpperCase();
  const time = s === "AM" ? "09:30:00" : s === "PM" ? "15:33:00" : "";
  if (!time) return "";
  return `${dateKey}T${time}+09:00`;
}

function isoFromZoneLocal(dateKey, timeStr, timeZone) {
  const m = String(dateKey || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return "";
  const [_, yS, monS, dS] = m;
  const [hS, minS, sS] = String(timeStr || "00:00:00").split(":");
  const y = Number(yS);
  const mon = Number(monS);
  const d = Number(dS);
  const h = Number(hS);
  const min = Number(minS);
  const sec = Number(sS);

  // まず「その時刻をUTCとして置く」仮定で開始し、指定TZでのローカル時刻が一致するように微修正します。
  let guess = new Date(Date.UTC(y, mon - 1, d, h, min, Number.isFinite(sec) ? sec : 0));
  for (let i = 0; i < 3; i += 1) {
    const parts = getTimePartsByZone(guess, timeZone);
    const desiredMin = h * 60 + min;
    const actualMin = parts.hour * 60 + parts.minute;
    const deltaMin = desiredMin - actualMin;
    if (Math.abs(deltaMin) <= 0) break;
    guess = new Date(guess.getTime() + deltaMin * 60 * 1000);
  }
  return guess.toISOString();
}

function slotScheduledIso(market, dateKey, slot) {
  if (market === "JP") return jpSlotScheduledIso(dateKey, slot);
  if (market === "US") {
    const s = String(slot || "").toUpperCase();
    const time = s === "AM" ? "10:00:00" : s === "PM" ? "16:00:00" : "";
    if (!time) return "";
    return isoFromZoneLocal(dateKey, time, "America/New_York");
  }
  if (market === "CRYPTO") {
    const s = String(slot || "").toUpperCase();
    const time = s === "00" ? "00:00:00" : s === "12" ? "12:00:00" : "";
    if (!time) return "";
    return isoFromZoneLocal(dateKey, time, "Asia/Tokyo");
  }
  return "";
}

function isMarketClosedNow(market, now = new Date()) {
  const nowObj = now instanceof Date ? now : new Date(now);
  if (market === "JP") {
    const p = getTimePartsByZone(nowObj, "Asia/Tokyo");
    const nowMin = p.hour * 60 + p.minute;
    const openMin = 9 * 60;
    const closeMin = 15 * 60;
    return nowMin < openMin || nowMin > closeMin;
  }
  if (market === "US") {
    const p = getTimePartsByZone(nowObj, "America/New_York");
    const nowMin = p.hour * 60 + p.minute;
    const openMin = 9 * 60 + 30;
    const closeMin = 16 * 60;
    return nowMin < openMin || nowMin > closeMin;
  }
  // CRYPTO は常時扱い
  return false;
}

function closeAsOfMsForMarket(market, dateKey) {
  // 履歴由来の終値を「終値確定の時刻」として表示する（履歴の date は 00:00Z 扱いになりやすいため）
  const iso = slotScheduledIso(market, dateKey, "PM");
  return (iso ? Date.parse(iso) : (Date.parse(`${dateKey}T00:00:00Z`))) || Date.now();
}

/** 注文日の約定スロットがすでに過ぎているか（過ぎていれば約定してよい）。orderSlot がない昔の注文は日付が過去なら約定可。日本株・米国株は市場時間外は今日の注文は約定させない。第4引数で基準時刻を指定可能（テスト・時計ずれ対策用）。 */
function hasOrderSlotPassed(orderDate, orderSlot, market, now = new Date()) {
  if (!orderDate) return false;
  const nowObj = now instanceof Date ? now : new Date();
  let todayKey;
  let zone;
  if (market === "JP") {
    zone = "Asia/Tokyo";
    const p = getTimePartsByZone(nowObj, zone);
    todayKey = `${p.year}-${pad2(p.month)}-${pad2(p.day)}`;
    if (orderDate === todayKey) {
      const nowMin = p.hour * 60 + p.minute;
      if (nowMin < 9 * 60 + 30) return false;
      if (nowMin >= 9 * 60 + 30 && nowMin < 15 * 60 + 33 && orderSlot === "PM") return false;
    }
  } else if (market === "US") {
    zone = "America/New_York";
    const p = getTimePartsByZone(nowObj, zone);
    todayKey = `${p.year}-${pad2(p.month)}-${pad2(p.day)}`;
    if (orderDate === todayKey) {
      const nowMin = p.hour * 60 + p.minute;
      if (nowMin < 10 * 60) return false;
      if (nowMin >= 10 * 60 && nowMin < 16 * 60 && orderSlot === "PM") return false;
    }
  } else {
    const p = getTimePartsByZone(nowObj, "Asia/Tokyo");
    todayKey = `${p.year}-${pad2(p.month)}-${pad2(p.day)}`;
    zone = "Asia/Tokyo";
  }
  if (!orderSlot) return orderDate < todayKey;
  let slotMinutes;
  if (market === "JP") {
    slotMinutes = orderSlot === "AM" ? 9 * 60 + 30 : 15 * 60 + 33;
  } else if (market === "US") {
    slotMinutes = orderSlot === "AM" ? 10 * 60 : 16 * 60;
  } else {
    slotMinutes = orderSlot === "00" ? 0 : 12 * 60;
  }
  if (orderDate > todayKey) return false;
  if (orderDate < todayKey) return true;
  const p = getTimePartsByZone(nowObj, zone);
  const nowMinutes = p.hour * 60 + p.minute;
  return nowMinutes >= slotMinutes;
}

function shiftDateKey(dateKey, days) {
  const m = String(dateKey || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return dateKey;
  const dt = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  dt.setUTCDate(dt.getUTCDate() + Number(days || 0));
  return `${dt.getUTCFullYear()}-${pad2(dt.getUTCMonth() + 1)}-${pad2(dt.getUTCDate())}`;
}

function getSeasonFirstDateKey(seasonKey) {
  const m = String(seasonKey || "").match(/^(\d{4})-(\d{2})$/);
  if (!m) return "";
  return `${m[1]}-${m[2]}-01`;
}

function getSeasonLastDateKey(seasonKey) {
  const m = String(seasonKey || "").match(/^(\d{4})-(\d{2})$/);
  if (!m) return "";
  const y = Number(m[1]);
  const mon = Number(m[2]);
  const last = new Date(Date.UTC(y, mon, 0));
  return `${m[1]}-${m[2]}-${pad2(last.getUTCDate())}`;
}

function formatSeasonLabel(seasonKey) {
  const [y, m] = seasonKey.split("-");
  return `${y}年${Number(m)}月`;
}

function seasonToIndex(seasonKey) {
  const m = String(seasonKey || "").match(/^(\d{4})-(\d{2})$/);
  if (!m) return -Infinity;
  const year = Number(m[1]);
  const month = Number(m[2]);
  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) return -Infinity;
  return year * 12 + (month - 1);
}

function seasonIndexToKey(index) {
  const safe = Number(index);
  if (!Number.isFinite(safe)) return getSeasonKeyJst(new Date());
  const monthIndex = ((safe % 12) + 12) % 12;
  const year = (safe - monthIndex) / 12;
  const month = monthIndex + 1;
  return `${year}-${pad2(month)}`;
}

function buildRollingSeasonKeys(months) {
  const count = Number.isFinite(months) ? Math.max(1, Math.floor(months)) : 36;
  const current = seasonToIndex(getSeasonKeyJst(new Date()));
  const out = [];
  for (let i = 0; i < count; i += 1) {
    out.push(seasonIndexToKey(current - i));
  }
  return out;
}

function formatDateTimeJst(value) {
  const date = typeof value === "string" || typeof value === "number" ? new Date(value) : value;
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "-";
  const p = getTimePartsByZone(date, CONFIG.jstTimeZone);
  const y = p.year;
  const m = p.month;
  const d = p.day;
  const h = String(p.hour).padStart(2, "0");
  const min = String(p.minute).padStart(2, "0");
  const sec = String(p.second).padStart(2, "0");
  return `${y}年${m}月${d}日 ${h}:${min}:${sec}`;
}

function epochSecToDateKey(sec) {
  const date = new Date(Number(sec) * 1000);
  return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`;
}

function toHalfWidth(value) {
  return String(value || "")
    .replace(/[\uFF01-\uFF5E]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0))
    .replace(/\u3000/g, " ")
    .trim();
}

function toFiniteNumber(value) {
  if (value == null || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function roundTo(n, digits) {
  const factor = 10 ** digits;
  return Math.round(n * factor) / factor;
}

function createId(prefix) {
  const rnd = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now().toString(36)}_${rnd}`;
}

function createSalt() {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return [...arr].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function hashPassword(password, salt) {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(String(password || "")),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: enc.encode(String(salt || "")),
      iterations: CONFIG.passwordIterations
    },
    baseKey,
    256
  );
  return [...new Uint8Array(bits)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function hashPasswordLegacy(password, salt) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function verifyPassword(user, password) {
  if (String(user.passwordAlgo || "") === "remote") return false;
  const algo = String(user.passwordAlgo || "legacy_sha256");
  if (algo === "pbkdf2") {
    const hash = await hashPassword(password, user.passwordSalt);
    return hash === user.passwordHash;
  }

  const legacyHash = await hashPasswordLegacy(password, user.passwordSalt);
  if (legacyHash !== user.passwordHash) return false;

  const newSalt = createSalt();
  user.passwordSalt = newSalt;
  user.passwordHash = await hashPassword(password, newSalt);
  user.passwordAlgo = "pbkdf2";
  user.updatedAt = new Date().toISOString();
  saveState();
  return true;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function byId(id) {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element: ${id}`);
  return el;
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
