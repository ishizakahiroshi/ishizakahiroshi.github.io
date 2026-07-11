// @ts-check
/*
 * このサイトは「ビルドレス（素のJS）」を意図的な技術選定として採用している。
 * その上で型の恩恵だけ得るため、`// @ts-check` + JSDoc で型注釈を付与している。
 * 配信物（この .js）はそのまま。エディタ / `tsc --noEmit --checkJs` で型検証できる。
 */

/**
 * @typedef {"ja" | "en"} Lang  対応言語
 * @typedef {{ ja: string, en: string }} L10n  日英の二言語テキスト
 */

/**
 * @typedef {Object} WorkDl  作品の動的 DL 情報（dl-stats 由来）
 * @property {number} [releases]      Releases の累計 DL 数
 * @property {number} [npm30d]        npm 直近 30 日 DL 数
 * @property {number[]} [sparkReleases]  30 日 sparkline 用の Releases 系列（古い順）
 *
 * @typedef {Object} WorkFeature  詳細ページ「何ができる」1 項目
 * @property {string} icon   記号 1 文字（絵文字ではなく幾何記号）
 * @property {L10n} title
 * @property {L10n} desc
 *
 * @typedef {Object} WorkUsage  詳細ページ「使い方」
 * @property {string} [install]  インストール用コマンド（1 行）
 * @property {string} [run]      起動用コマンド（1 行）
 * @property {L10n[]} [steps]    補足ステップ（順序付き）
 *
 * @typedef {Object} Work  作品（カード／詳細ページ共通）
 * @property {string} id        URLスラッグ兼表示名
 * @property {string} initials  バッジ表示の略号
 * @property {string} c         アクセントカラー（CSS変数 --c）
 * @property {number} stars     GitHub Star 数（0 のとき非表示）
 * @property {L10n} cat
 * @property {L10n} short
 * @property {L10n} long
 * @property {string[]} tech
 * @property {string} repo
 * @property {string} [store]   任意：ストア等の外部リンク（あればボタン追加）
 * @property {string} [live]    任意：ライブデモ等のリンク
 * @property {WorkDl} [dl]      任意：dl-stats から動的に詰める DL 情報
 * @property {L10n} [tagline]      詳細ページ：ヒーローの一言キャッチ
 * @property {string[]} [shots]    詳細ページ：スクショ／GIF の画像パス（works/<id>/ 配下）
 * @property {WorkFeature[]} [features]  詳細ページ：「何ができる」3 項目
 * @property {WorkUsage} [usage]        詳細ページ：使い方（install / run / steps）
 */

/**
 * @typedef {Object} Stat
 * @property {string} num
 * @property {L10n} unit
 * @property {L10n} label
 *
 * @typedef {Object} Exp  職務経歴
 * @property {boolean} current  現職フラグ
 * @property {L10n} role
 * @property {L10n} org
 * @property {L10n} desc
 *
 * @typedef {Object} CanDo
 * @property {L10n} title
 * @property {L10n} desc
 *
 * @typedef {Object} SkillTier  経験年数でまとめたスキル群
 * @property {boolean} highlight
 * @property {L10n} years
 * @property {string[]} items
 *
 * @typedef {{ emoji: string } & L10n} Persona  人となり1項目
 */

/* ===== プロフィール / 作品 / 経歴データ（日英） ===== */

/** @type {{ name: string, nameEn: string, github: string, x: string, note: string, youtube: string, contactEmail: [string, string] | null }} */
const PROFILE = {
  name: "ishizakahiroshi",
  nameEn: "ishizakahiroshi",
  github: "https://github.com/ishizakahiroshi",
  x: "https://x.com/ishizakahiroshi",
  note: "https://note.com/ishizakahiroshi",
  youtube: "https://www.youtube.com/@ishizakahiroshi-dev",
  // 公開ページに生メアドは置かない（スクレイピング対策）。
  // 受信専用の新規アドレスを用意したら ["user","domain.com"] の形で設定すると、
  // ボタンが出てクリック時に JS で組み立てて表示する。null の間は非表示。
  contactEmail: null,
};

/* 実績の数字（信頼バッジ） */
/** @type {Stat[]} */
const STATS = [
  { num: "18", unit: { ja: "年", en: "yrs" }, label: { ja: "実務経験", en: "Experience" } },
  { num: "5", unit: { ja: "年", en: "yrs" }, label: { ja: "講師経験", en: "Teaching" } },
  { num: "6", unit: { ja: "", en: "" }, label: { ja: "公開OSS", en: "OSS projects" } },
  { num: "★7", unit: { ja: "", en: "" }, label: { ja: "GitHub Stars", en: "GitHub stars" } },
  { num: "—", unit: { ja: "DL", en: "DL" }, label: { ja: "配布数（直近）", en: "Installs (recent)" } },
];

/* 「こんな相談、歓迎です」 */
/** @type {L10n[]} */
const CONTACT_WELCOME = [
  { ja: "AI×業務自動化 — MCP・Claude を業務システムに組み込む実装", en: "AI × automation — embedding MCP/Claude into business systems" },
  { ja: "レガシー PHP の Go 移植・モダナイズ", en: "Migrating and modernizing legacy PHP to Go" },
  { ja: "自社インフラ・SaaS代替の構築（Nextcloud など）", en: "Building self-hosted infrastructure / SaaS alternatives (Nextcloud, etc.)" },
  { ja: "SQL・データベース設計まわりの相談", en: "SQL and database design" },
  { ja: "業務理解が必要な社内システムの開発", en: "In-house systems that require understanding the business" },
  { ja: "「これ作れる?」のラフな技術相談から", en: "Even just a casual “can you build this?” chat" },
];

/** @type {Work[]} */
const WORKS = [
  {
    id: "many-ai-cli",
    initials: "ma",
    c: "#e2762f",
    stars: 4,
    cat: { ja: "AIツール / Webダッシュボード", en: "AI Tooling / Web Dashboard" },
    short: {
      ja: "複数のAIコーディングCLIセッションの承認管理・監視を行うローカルWebダッシュボード。",
      en: "A local web dashboard to manage approvals and monitor parallel AI coding CLI sessions.",
    },
    long: {
      ja: "複数のAIコーディングCLI（Claude Code 等）を並列で走らせる際に、承認待ちや各セッションの状態を一画面で管理・監視できるローカルWebダッシュボードです。AIを「使う側」だけでなく「業務に組み込む側」として、決定論的に動かす部分とAIに委ねる部分の境界を設計した実装です。",
      en: "A local web dashboard for managing approvals and monitoring multiple AI coding CLI sessions (e.g. Claude Code) running in parallel. Built not just as a user of AI, but as someone who embeds AI into workflows — designing the boundary between deterministic control and what is delegated to the AI.",
    },
    tech: ["JavaScript", "Node.js", "Web Dashboard"],
    repo: "https://github.com/ishizakahiroshi/many-ai-cli",
    tagline: {
      ja: "複数の AI コーディング CLI を並列で走らせ、承認をブラウザ 1 タブに集約。スマホからでも。",
      en: "Run multiple AI coding CLIs in parallel and approve every session from one browser tab — even on your phone.",
    },
    shots: [],
    features: [
      { icon: "▦", title: { ja: "並列セッション管理", en: "Parallel sessions" }, desc: { ja: "Claude Code・Codex・Copilot・Cursor・Grok を同時に走らせ、状態を 1 画面で監視。", en: "Run Claude Code, Codex, Copilot, Cursor, and Grok at once, monitored in one view." } },
      { icon: "✓", title: { ja: "承認を 1 タブに集約", en: "Approvals in one tab" }, desc: { ja: "各 CLI の承認待ちをまとめて捌ける。ターミナルの往復が消える。", en: "Handle every CLI's approval prompts in one place — no more terminal hopping." } },
      { icon: "▤", title: { ja: "スマホから操作", en: "Approve from your phone" }, desc: { ja: "ローカル Web ダッシュボードなので、離席中もスマホで承認できる。", en: "It's a local web dashboard, so you can approve from your phone while away." } },
    ],
  },
  {
    id: "offline-md-editor-viewer",
    initials: "md",
    c: "#2aa6c4",
    stars: 9,
    cat: { ja: "エディタ / 単一HTMLアプリ", en: "Editor / Single-HTML App" },
    short: {
      ja: "オフラインで動くMarkdownエディタ／ビューア。単一HTMLとWindows用ポータブルexe。",
      en: "An offline Markdown editor/viewer — a single HTML file plus a portable Windows exe.",
    },
    long: {
      ja: "ネット接続不要、単一のHTMLファイルだけで完結するMarkdownエディタ／ビューアです。Windows向けには持ち運べるポータブルexeも提供。依存ゼロでどこでも開ける手軽さと、データを自分の手元に置けるシンプルさを重視しています。",
      en: "A Markdown editor/viewer that runs entirely offline from a single HTML file, with a portable Windows executable. Zero dependencies, open it anywhere, and keep your data local.",
    },
    tech: ["HTML", "JavaScript", "CSS"],
    repo: "https://github.com/ishizakahiroshi/offline-md-editor-viewer",
    tagline: {
      ja: "ネット不要・単一 HTML で完結する Markdown エディタ／ビューア。",
      en: "An offline Markdown editor/viewer that lives in a single HTML file.",
    },
    shots: [],
    features: [
      { icon: "◇", title: { ja: "単一 HTML で完結", en: "One HTML file" }, desc: { ja: "ネット接続不要、1 ファイルだけで動く Markdown エディタ／ビューア。", en: "A Markdown editor/viewer that runs from a single file, fully offline." } },
      { icon: "⬒", title: { ja: "ポータブル exe", en: "Portable exe" }, desc: { ja: "Windows 向けには持ち運べるポータブル exe も提供。", en: "A portable Windows executable is also available." } },
      { icon: "⚑", title: { ja: "データは手元に", en: "Your data stays local" }, desc: { ja: "依存ゼロ・ローカル保存。どこでも開けて安心。", en: "Zero dependencies, local storage — open it anywhere." } },
    ],
  },
  {
    id: "ai-audit-prompts",
    initials: "ap",
    c: "#8b6fd6",
    stars: 2,
    cat: { ja: "プロンプト集 / AI支援開発", en: "Prompt Library / AI-Assisted Dev" },
    short: {
      ja: "AI支援開発の品質を担保するための、監査・レビュー用プロンプト集。",
      en: "A library of audit and review prompts for keeping AI-assisted development trustworthy.",
    },
    long: {
      ja: "AIに書かせたコードや作業を、安全に業務へ取り込むためのレビュー・監査用プロンプト集です。AIの出力にガードレールを掛け、見落としを減らすための実践知をまとめています。",
      en: "A collection of review and audit prompts for safely bringing AI-generated code and work into production. It captures hands-on knowledge for putting guardrails around AI output and reducing oversights.",
    },
    tech: ["Prompt Engineering", "HTML", "AI-Assisted Dev"],
    repo: "https://github.com/ishizakahiroshi/ai-audit-prompts",
  },
  {
    id: "always-pinned",
    initials: "pin",
    c: "#2f9e6e",
    stars: 0,
    cat: { ja: "Chrome拡張", en: "Chrome Extension" },
    short: {
      ja: "指定タブを自動でピン留めし続けるChrome拡張。ウィンドウ単位で制御。",
      en: "A Chrome extension that keeps chosen tabs pinned — controlled per window.",
    },
    long: {
      ja: "指定したタブを自動でピン留め状態に保つChrome拡張です。ウィンドウごとに制御でき、作業中に大事なタブを見失わない・閉じてしまわないようにします。日々の作業で感じた小さな不便を、自分の手で解いた一例です。",
      en: "A Chrome extension that automatically keeps selected tabs pinned, controllable on a per-window basis so you never lose or accidentally close an important tab. A small everyday annoyance, solved by hand.",
    },
    tech: ["JavaScript", "Chrome Extension API"],
    repo: "https://github.com/ishizakahiroshi/always-pinned",
    store: "https://chromewebstore.google.com/detail/always-pinned/cpgbmadjjabkmdapeknmnpfmknbncdie",
    tagline: {
      ja: "大事なタブを、ウィンドウ単位で自動ピン留めし続ける Chrome 拡張。",
      en: "A Chrome extension that keeps your important tabs pinned, per window.",
    },
    shots: [],
    features: [
      { icon: "⚲", title: { ja: "自動ピン留め", en: "Auto-pin" }, desc: { ja: "指定したタブを常にピン留め状態に保つ。", en: "Keeps chosen tabs pinned at all times." } },
      { icon: "◱", title: { ja: "ウィンドウ単位制御", en: "Per-window control" }, desc: { ja: "ウィンドウごとに対象タブを個別に制御できる。", en: "Control which tabs are pinned on a per-window basis." } },
      { icon: "✓", title: { ja: "誤操作を防ぐ", en: "Prevents mishaps" }, desc: { ja: "大事なタブを閉じてしまう・見失う事故を防ぐ。", en: "Stops you from losing or accidentally closing key tabs." } },
    ],
  },
  {
    id: "setpanel",
    initials: "sp",
    c: "#5b6fb0",
    stars: 0,
    cat: { ja: "CLIツール / Windows", en: "CLI Tool / Windows" },
    short: {
      ja: "Windows Terminal を1コマンドで均等グリッド分割するツール。",
      en: "Open Windows Terminal in an even grid of panes with a single command.",
    },
    long: {
      ja: "Windows Terminal のペインを1コマンドで均等なグリッドに分割するPowerShellツールです。複数ペイン構成の立ち上げを毎回手で組む手間を、一発で解消します。",
      en: "A PowerShell tool that splits Windows Terminal into an even grid of panes with one command — no more manually arranging a multi-pane layout every time.",
    },
    tech: ["PowerShell", "Windows Terminal"],
    repo: "https://github.com/ishizakahiroshi/setpanel",
  },
  {
    id: "dl-stats",
    initials: "dl",
    c: "#ff7a3d",
    stars: 0,
    cat: { ja: "Webダッシュボード / Cloudflare Workers", en: "Web Dashboard / Cloudflare Workers" },
    short: {
      ja: "自作OSSの配布数・Star数をリアルタイム可視化するダッシュボード。Cloudflare無料枠で完全運用。",
      en: "Real-time dashboard visualising my OSS download counts and stars — runs entirely on Cloudflare's free tier.",
    },
    long: {
      ja: "npm・GitHub Releases・Starを自動ディスカバリで集めて1画面に表示するダッシュボードです。Cloudflare Workers（HonoベースAPI）+KV（SWRキャッシュ）+D1（日次スナップショット）+Cron Triggers で構成し、完全無料で運用しています。「無料クラウドでここまでできる」を自分で実証した実例です。",
      en: "Auto-discovers my OSS tools and visualises npm downloads, GitHub Releases DL counts, and stars in one view. Built on Cloudflare Workers (Hono API) + KV (SWR cache) + D1 (daily snapshots) + Cron Triggers — zero cost. A living proof of how far free-tier cloud can go.",
    },
    tech: ["React", "TypeScript", "Hono", "Cloudflare Workers", "KV", "D1", "Vite", "Tailwind CSS"],
    repo: "https://github.com/ishizakahiroshi/dl-stats",
    live: "https://dl-stats.ishizakahiroshi.workers.dev",
    tagline: {
      ja: "自作 OSS の DL・Star を、Cloudflare 無料枠だけでリアルタイム可視化。",
      en: "Real-time downloads & stars for my OSS — all on Cloudflare's free tier.",
    },
    shots: [],
    features: [
      { icon: "◷", title: { ja: "リアルタイム集計", en: "Real-time metrics" }, desc: { ja: "npm・GitHub Releases・Star を自動ディスカバリで 1 画面に集計。", en: "Auto-discovers and aggregates npm, GitHub Releases, and stars in one view." } },
      { icon: "☁", title: { ja: "無料枠で完全運用", en: "Runs free" }, desc: { ja: "Cloudflare Workers + KV + D1 + Cron Triggers。完全無料で運用。", en: "Cloudflare Workers + KV + D1 + Cron Triggers — zero cost." } },
      { icon: "▤", title: { ja: "日次スナップショット", en: "Daily snapshots" }, desc: { ja: "Cron Triggers で定期取得し、推移をグラフ化。", en: "Cron Triggers capture daily snapshots to chart the trend." } },
    ],
  },
  {
    id: "ShotTTL",
    initials: "st",
    c: "#d4a728",
    stars: 0,
    cat: { ja: "ユーティリティ / クロスプラットフォーム", en: "Utility / Cross-platform" },
    short: {
      ja: "スクリーンショットフォルダを自動で整理・管理するクロスプラットフォームツール。",
      en: "A cross-platform tool that automatically tidies and manages your screenshot folder.",
    },
    long: {
      ja: "スクリーンショット用フォルダに溜まり続ける画像を、保持期間（TTL）ベースで自動整理するクロスプラットフォームツールです。フォルダが散らからず、手動の掃除から解放されます。",
      en: "A cross-platform tool that automatically tidies the images piling up in your screenshots folder based on a retention period (TTL). Your folder stays clean without manual cleanup.",
    },
    tech: ["Cross-platform", "CLI"],
    repo: "https://github.com/ishizakahiroshi/ShotTTL",
  },
  {
    id: "docsweep",
    initials: "do",
    c: "#7a9e2f",
    stars: 0,
    cat: { ja: "CLI / Python", en: "CLI / Python" },
    short: {
      ja: "AI が量産する plan / bugfix の Markdown を、腐らせず自動で片付けるクロスプラットフォーム CLI。",
      en: "A cross-platform CLI that keeps the plan/bugfix Markdown logs AI agents generate from rotting.",
    },
    long: {
      ja: "Claude Code や Codex などの AI コーディングツールが生成する plan_*.md / bugfix_*.md / pending_*.md は、放っておくと溜まり続けて陳腐化します。docsweep は H1 ステータスラベル（[完了] / [計画] 等）や frontmatter を機械的に読み取り、完了したものを各プロジェクトの archive/ へ自動移送し、古くなったものを「要判断」フラグで可視化。複数プロジェクトを横断 INDEX で一望できます。",
      en: "AI coding tools like Claude Code and Codex generate plan/bugfix/pending Markdown files that pile up and go stale. docsweep reads H1 status labels and frontmatter, auto-archives finished docs, flags stale ones for review, and gives a cross-project index.",
    },
    tech: ["Python", "CLI", "Web UI", "SQLite", "MCP"],
    repo: "https://github.com/ishizakahiroshi/docsweep",
    tagline: {
      ja: "AI が量産する作業ログ Markdown を、腐らせず自動で片付ける。",
      en: "Keep the work-log Markdown your AI agents generate from rotting.",
    },
    shots: [],
    features: [
      { icon: "⌦", title: { ja: "完了を自動アーカイブ", en: "Auto-archive finished docs" }, desc: { ja: "H1 ステータスラベルや frontmatter を読み、完了した md を archive/ へ移送。", en: "Reads status labels/frontmatter and moves finished docs to archive/." } },
      { icon: "⚑", title: { ja: "陳腐化を可視化", en: "Surface stale docs" }, desc: { ja: "古くなったドキュメントを「要判断」フラグで検出して一覧化。", en: "Flags outdated docs as “needs review.”" } },
      { icon: "▤", title: { ja: "横断 INDEX", en: "Cross-project index" }, desc: { ja: "複数プロジェクトの plan / bugfix / pending を 1 画面で一望。", en: "See plan/bugfix/pending across all projects in one view." } },
    ],
    usage: {
      install: "pip install docsweep",
      run: "python -m docsweep triage",
      steps: [
        { ja: "pip でインストール（Web UI 込みは 'docsweep[all]'）。", en: "Install via pip (use 'docsweep[all]' for the web UI)." },
        { ja: "plan / bugfix の md がある開発ルートで triage を実行。", en: "Run triage in the dev root that holds your plan/bugfix docs." },
        { ja: "完了は archive へ自動移送、陳腐化は要判断フラグで確認。", en: "Finished docs auto-archive; stale ones show up as review flags." },
      ],
    },
  },
  {
    id: "PlainSheet",
    initials: "pl",
    c: "#c85b8e",
    stars: 0,
    cat: { ja: "アプリ / TypeScript", en: "App / TypeScript" },
    short: {
      ja: "人と AI のためのローカルファーストなプレーンテキスト表計算エディタ。",
      en: "A local-first plain text spreadsheet editor for humans and AI.",
    },
    long: {
      ja: "CSV・TSV・Markdown テーブル・JSON 配列・YAML リストを、きれいな編集可能シートとして開き、バイナリの表計算形式に変換せずプレーンテキストのまま保存するエディタです。データは常に手元（ローカル）に置き、サーバー送信も AI API 呼び出しもしません。Tauri によるデスクトップアプリと Web デモの両方を提供しています。",
      en: "Opens CSV, TSV, Markdown tables, JSON arrays, and YAML lists as a clean editable sheet and saves back to plain text instead of a binary format. Local-first: no server upload, no AI API calls. Ships as a Tauri desktop app and a web demo.",
    },
    tech: ["TypeScript", "Tauri", "Bun", "Web"],
    repo: "https://github.com/ishizakahiroshi/PlainSheet",
    tagline: {
      ja: "人と AI のための、ローカルファーストなプレーンテキスト表計算。",
      en: "A local-first plain text spreadsheet, for humans and AI.",
    },
    shots: [],
    features: [
      { icon: "▤", title: { ja: "プレーンテキストのまま", en: "Stays plain text" }, desc: { ja: "CSV / TSV / Markdown / JSON / YAML を表として開き、そのまま保存。", en: "Open CSV/TSV/Markdown/JSON/YAML as a table and save back as-is." } },
      { icon: "⚑", title: { ja: "ローカルファースト", en: "Local-first" }, desc: { ja: "サーバー送信なし・AI API 呼び出しなし。データは手元だけ。", en: "No server upload, no AI API calls — your data stays local." } },
      { icon: "⬒", title: { ja: "デスクトップ & Web", en: "Desktop & Web" }, desc: { ja: "Tauri アプリと Web デモの両方。ドラッグ&ドロップ対応。", en: "Both a Tauri app and a web demo, with drag-and-drop." } },
    ],
  },
  {
    id: "worklog-bridge",
    initials: "wb",
    c: "#3a8fd6",
    stars: 0,
    cat: { ja: "CLI / 業務自動化", en: "CLI / Automation" },
    short: {
      ja: "PC・git・SSH・AI ログなどローカルの痕跡から実働時間を復元し、Google Sheets に書き出すローカル CLI。",
      en: "A local CLI that reconstructs real working hours from local signals (PC/git/SSH/AI logs) and writes to Google Sheets.",
    },
    long: {
      ja: "打刻と実際の稼働時間のズレを、ローカルのシグナル（PC 稼働・git・SSH・Claude・サーバー）から実働時間を再構成して埋めるローカル専用 CLI です。集計結果は Google Sheets に書き出します。",
      en: "Bridges the gap between time-clock entries and actual work by reconstructing real working time from local signals (PC, git, SSH, Claude, servers) and writing it to Google Sheets. Local-only.",
    },
    tech: ["JavaScript", "Node.js", "Google Sheets API"],
    repo: "https://github.com/ishizakahiroshi/worklog-bridge",
  },
  {
    id: "syncway",
    initials: "sy",
    c: "#3fa8a0",
    stars: 0,
    cat: { ja: "CLI / Windows", en: "CLI / Windows" },
    short: {
      ja: "ローカル Windows と開発サーバー間を ssh 越しに双方向同期する PowerShell ツール。",
      en: "Bidirectional rsync over ssh between local Windows and a dev server.",
    },
    long: {
      ja: "ローカルの Windows と開発サーバーの間を、ssh 越しの rsync で双方向に同期する PowerShell ツールです。編集した側を安全に相手へ反映します。",
      en: "A PowerShell tool that syncs a local Windows machine and a dev server bidirectionally via rsync over ssh.",
    },
    tech: ["PowerShell", "rsync", "ssh"],
    repo: "https://github.com/ishizakahiroshi/syncway",
  },
  {
    id: "many-tab",
    initials: "mt",
    c: "#e0664a",
    stars: 0,
    cat: { ja: "Chrome拡張", en: "Chrome Extension" },
    short: {
      ja: "同一 Chrome プロファイルのまま、同じサイトの複数アカウントを別タブで同時ログイン状態に保つ拡張 (MV3)。",
      en: "Keep multiple accounts of the same site logged in across tabs, in one Chrome profile (MV3).",
    },
    long: {
      ja: "同じ Chrome プロファイルのまま、同一サイトの複数アカウントを別タブで同時にログイン状態に保つ Chrome 拡張 (Manifest V3) です。100% ローカルで動作し、テレメトリはありません。",
      en: "A Chrome extension (MV3) that keeps multiple accounts of the same site logged in simultaneously across separate tabs, without switching profiles. 100% local, no telemetry.",
    },
    tech: ["JavaScript", "Chrome Extension API", "MV3"],
    repo: "https://github.com/ishizakahiroshi/many-tab",
  },
  {
    id: "tab-title-prefix",
    initials: "tt",
    c: "#8a63c9",
    stars: 0,
    cat: { ja: "ブラウザ拡張", en: "Browser Extension" },
    short: {
      ja: "コンテナ（Firefox）や URL ルール（Chrome）でタブのタイトルに接頭辞を付ける拡張。",
      en: "Prefix tab titles by container (Firefox) or URL rules (Chrome).",
    },
    long: {
      ja: "タブのタイトルに、コンテナ（Firefox）や URL ルール（Chrome）ベースで接頭辞を付けるブラウザ拡張です。似たタブが並んでも一目で見分けられます。",
      en: "A browser extension that prefixes tab titles based on containers (Firefox) or URL rules (Chrome), so similar tabs stay easy to tell apart.",
    },
    tech: ["JavaScript", "WebExtension"],
    repo: "https://github.com/ishizakahiroshi/tab-title-prefix",
  },
  {
    id: "nextcloud-safe-html-viewer",
    initials: "ns",
    c: "#c99a3a",
    stars: 0,
    cat: { ja: "Nextcloud アプリ / PHP", en: "Nextcloud App / PHP" },
    short: {
      ja: "厳格な CSP サンドボックス下で HTML を安全にプレビューする Nextcloud アプリ。秘匿値のマスク付き。",
      en: "A Nextcloud app to safely preview HTML under a strict CSP sandbox, with best-effort secret redaction.",
    },
    long: {
      ja: "Nextcloud 上の HTML ファイルを、厳格な CSP サンドボックスの中で安全にプレビューするアプリです。ベストエフォートで秘匿値をマスクし、うっかり漏洩を防ぎます。",
      en: "A Nextcloud app that previews HTML files inside a strict CSP sandbox, with best-effort redaction of secrets to avoid accidental leaks.",
    },
    tech: ["PHP", "Nextcloud", "CSP"],
    repo: "https://github.com/ishizakahiroshi/nextcloud-safe-html-viewer",
  },
  {
    id: "manabi-map",
    initials: "mm",
    c: "#4aa3a0",
    stars: 0,
    cat: { ja: "Web サービス / TypeScript", en: "Web Service / TypeScript" },
    short: {
      ja: "住所を起点に通える高校を地図で見て、親子で比較・記録・検討できる進路管理サービス（群馬版 MVP・OSS）。",
      en: "Map nearby high schools from your address and compare, record, and plan together — a career-planning service (Gunma MVP, OSS).",
    },
    long: {
      ja: "自宅の住所を起点に、通える範囲の高校を地図で見ながら、親子で比較・記録・検討できる進路管理サービスです。群馬版の MVP として OSS で公開しています。",
      en: "A career-planning service that maps commutable high schools from your home address and lets parent and child compare, record, and think it through together. Open-sourced as a Gunma-area MVP.",
    },
    tech: ["TypeScript", "Map", "Web"],
    repo: "https://github.com/ishizakahiroshi/manabi-map",
  },
  {
    id: "ai-log-clean",
    initials: "al",
    c: "#6f8a9e",
    stars: 0,
    cat: { ja: "CLI / クロスプラットフォーム", en: "CLI / Cross-platform" },
    short: {
      ja: "Claude Code・Codex・Copilot・Cursor・opencode・Grok の古いセッションログを自動で掃除する CLI。",
      en: "Trim old session logs from Claude Code, Codex, Copilot, Cursor, opencode, and Grok — daily auto-clean.",
    },
    long: {
      ja: "各種 AI コーディング CLI（Claude Code / Codex / Copilot / Cursor / opencode / Grok）が溜め込む古いセッションログを、保持期間を設定して毎日自動で掃除するクロスプラットフォーム CLI です。",
      en: "A cross-platform CLI that trims the old session logs accumulated by AI coding CLIs (Claude Code, Codex, Copilot, Cursor, opencode, Grok), with configurable retention and daily auto-clean.",
    },
    tech: ["JavaScript", "Node.js", "CLI"],
    repo: "https://github.com/ishizakahiroshi/ai-log-clean",
  },
  {
    id: "claude-code-context-diet",
    initials: "cc",
    c: "#b0785a",
    stars: 0,
    cat: { ja: "ノウハウ / Claude Code", en: "Know-how / Claude Code" },
    short: {
      ja: "Claude Code の常駐 context をスリム化する手順集と簡易スキル。効くキーを見極めた実践知。",
      en: "A guide and small skill for slimming down Claude Code's resident context — the keys that actually work.",
    },
    long: {
      ja: "Claude Code の常駐 context を実際に減らすための手順集と簡易スキルです。permissions.deny では context は減らない、といった見落としがちな要点を、効くキーに絞って整理しています。",
      en: "A guide and small skill for actually reducing Claude Code's resident context. It focuses on the keys that genuinely work — e.g. permissions.deny does not cut context — instead of folklore.",
    },
    tech: ["Claude Code", "Documentation"],
    repo: "https://github.com/ishizakahiroshi/claude-code-context-diet",
  },
];

/** @type {Exp[]} */
const EXPERIENCE = [
  {
    current: true,
    role: { ja: "社内システム開発 / チームリーダー", en: "In-house System Development / Team Lead" },
    org: { ja: "人材派遣業（在宅・3〜4名チーム）", en: "Staffing industry (remote, team of 3–4)" },
    desc: {
      ja: "PHP/Laravel 系の業務システム、Go 言語によるサーバー監視・管理基盤、Nextcloud ベースのストレージ、Claude/ChatGPT からファイル操作できる MCP サーバーまで、フロントエンドからインフラ・AI連携までを一貫して設計・実装。取引先折衝とスケジュール管理も担当。",
      en: "End-to-end design and implementation across the stack: PHP/Laravel business systems, a Go-based server monitoring & management platform, Nextcloud-based storage, and an MCP server that lets Claude/ChatGPT operate on files. Also handle client coordination and scheduling.",
    },
  },
  {
    current: false,
    role: { ja: "製造業向け 業務システム設計", en: "Business System Design for Manufacturing" },
    org: { ja: "製造業", en: "Manufacturing industry" },
    desc: {
      ja: "業界ルールや現場の業務フローを踏まえた業務システムの要件定義・設計。技術だけで解けない問題を、業務側との対話を通じて要件に落とし込む工程を多く経験。",
      en: "Requirements definition and design of business systems grounded in industry rules and on-the-ground workflows. Extensive experience turning problems that technology alone can't solve into requirements through dialogue with the business side.",
    },
  },
  {
    current: false,
    role: { ja: "専門学校 講師（5年）", en: "Vocational School Instructor (5 years)" },
    org: { ja: "IT系専門学校", en: "IT vocational school" },
    desc: {
      ja: "非エンジニア・初学者への指導を5年間担当。技術を持たない方への説明力と、伝わるドキュメントを書く力の土台になっている。",
      en: "Five years teaching non-engineers and beginners. The foundation of my ability to explain to non-technical people and write documentation that actually lands.",
    },
  },
];

/** @type {CanDo[]} */
const CANDO = [
  {
    title: { ja: "AI × 業務自動化", en: "AI × Workflow Automation" },
    desc: { ja: "MCP サーバー開発、Claude/ChatGPT の業務システムへの組込、業務効率化エージェントの設計。AIの出力を安全に取り込むガードレール設計が得意。", en: "MCP server development, embedding Claude/ChatGPT into business systems, and designing automation agents — with a focus on guardrails for safely integrating AI output." },
  },
  {
    title: { ja: "バックエンド開発", en: "Backend Development" },
    desc: { ja: "PHP/Laravel、Go、C#、VB.NET。レガシー PHP から Go への段階的な移植・モダナイゼーションも対応。", en: "PHP/Laravel, Go, C#, VB.NET — including incremental migration and modernization from legacy PHP to Go." },
  },
  {
    title: { ja: "インフラ内製", en: "In-house Infrastructure" },
    desc: { ja: "Linux（Ubuntu/CentOS）、nginx、Docker、Nextcloud。「買うべきものと作るべきもの」を見極めた自社運用基盤の構築。", en: "Linux (Ubuntu/CentOS), nginx, Docker, Nextcloud — building self-hosted platforms with a clear sense of what to buy vs. what to build." },
  },
  {
    title: { ja: "SQL・データベース設計", en: "SQL & Database Design" },
    desc: { ja: "最も得意とする軸（5年以上）。データ層の設計からアプリ実装まで一貫して対応できる。", en: "My strongest area (5+ years). I can own everything from the data layer up to the application." },
  },
  {
    title: { ja: "要件定義〜運用の一貫対応", en: "Requirements to Operation, End-to-End" },
    desc: { ja: "要件定義・業務分析・基本設計から開発・運用まで通して担当できる。チームリーダーとして折衝・進行管理の経験も。", en: "I can carry a project from requirements, analysis and design through development and operation — with team-lead experience in coordination and project management." },
  },
  {
    title: { ja: "説明・ドキュメント", en: "Explanation & Documentation" },
    desc: { ja: "専門学校講師5年の経験から、非エンジニアにも伝わる説明とドキュメント整備が得意。", en: "Five years as an instructor make me good at explaining things to non-engineers and writing documentation that lands." },
  },
];

/* 経験年数つきスキル（スキル一覧より） */
/** @type {SkillTier[]} */
const SKILLS = [
  {
    highlight: true,
    years: { ja: "5年以上", en: "5+ yrs" },
    items: ["PHP", "SQL", "HTML", "Linux", "Ubuntu", "MySQL", "Access", "Apache / Tomcat", "Windows", "macOS", "Ajax", "Git / GitHub", "Docker"],
  },
  {
    highlight: false,
    years: { ja: "3〜5年", en: "3–5 yrs" },
    items: ["VB", "VBA", "Nginx", "HTML5", "CSS3", "ASP.NET", "Subversion", "エンジニア育成"],
  },
  {
    highlight: false,
    years: { ja: "1〜3年", en: "1–3 yrs" },
    items: ["VB.NET", "Laravel", "Vue.js", "jQuery", "Windows Server", "CentOS", "IIS", "JP1"],
  },
  {
    highlight: false,
    years: { ja: "1年未満", en: "<1 yr" },
    items: ["Go", "TypeScript", "Java", "C++", "SQLite", "Oracle", "DB2", "MongoDB", "Zabbix", "mackerel", "Eclipse"],
  },
];

/** @type {Persona[]} */
const PERSONA = [
  { emoji: "🔍", ja: "知的好奇心の塊。気になったらとことん掘る", en: "Endlessly curious — once something grabs me, I dig all the way" },
  { emoji: "🤓", ja: "ちょっとオタク気質。突き詰めるのが好き", en: "A bit of a geek — I love going deep" },
  { emoji: "💻", ja: "パソコン・ガジェットに目がない", en: "Can't resist PCs and gadgets" },
  { emoji: "🐱", ja: "猫2匹と暮らしてます", en: "Living with two cats" },
  { emoji: "🧩", ja: "パペットスンスンが好き", en: "A fan of Puppet Sunsun" },
  { emoji: "🏔️", ja: "群馬県北部のかなり田舎暮らし（だからフルリモート）", en: "Living deep in rural northern Gunma (hence: full remote)" },
  { emoji: "🏠", ja: "外出は正直苦手。だから在宅でこそ本領を発揮します", en: "Honestly not a fan of going out — which is exactly why I thrive working from home" },
  { emoji: "🐛", ja: "虫は苦手。コードのバグは大歓迎なんですけどね", en: "Not great with bugs — the insect kind. Bugs in code, bring them on" },
  { emoji: "👨‍👩‍👧‍👧", ja: "妻と娘2人、両親と", en: "With my wife, two daughters, and my parents" },
];

/* ===== UI 文字列（日英） ===== */
/** @type {Record<Lang, Record<string, string>>} */
const I18N = {
  ja: {
    "nav.works": "作品", "nav.experience": "経歴", "nav.cando": "できること", "nav.about": "About", "nav.person": "人となり", "nav.articles": "記事", "nav.contact": "Contact", "nav.stats": "アプリDL数",
    "label.person": "人となり", "label.latest": "Latest", "label.articles": "Articles", "label.contact": "Contact",
    "articles.loading": "記事を読み込んでいます。",
    "articles.empty": "現在表示できる記事がありません。",
    "latest.noteHeading": "note の最新記事", "latest.xHeading": "X の最新投稿",
    "latest.loading": "最新記事を読み込んでいます。",
    "latest.noteFallback": "最新記事を取得できませんでした。note のプロフィールからご覧ください。",
    "latest.noteProfile": "note のプロフィールを開く",
    "latest.readNote": "記事を読む",
    "latest.xProfile": "X のプロフィールを開く",
    "latest.privacy": "X の埋め込み表示では、閲覧情報が X に送信される場合があります。パーソナライズを抑制する設定を有効にしています。",
    "about.philosophy": "日々の小さな“不便”を、自分の手で解く。",
    "about.philosophy.sub": "公開しているツールは、ほとんどが自分や現場の困りごとから生まれたものです。「買うより作った方が早い」を素早く形にできるのが強みです。",
    "about.coreLabel": "強み（コア・コンピタンス）",
    "about.core": "業務を理解し、上流から運用まで一人で通せる“何でも屋”の幅。そして、それを人に教えられること。",
    "contact.lead": "業務委託・受注のご相談、歓迎します。かしこまらず、まずは X か note から気軽にどうぞ。",
    "contact.welcomeTitle": "こんな相談、歓迎です",
    "contact.x": "X でDMする", "contact.note": "note を見る", "contact.github": "GitHub を見る", "contact.youtube": "YouTube を見る", "contact.mail": "メールアドレスを表示",
    "articles.channel": "記事の音声版を YouTube で配信中", "articles.channelBtn": "チャンネルを見る →",
    "articles.channelSub": "AI がラジオ風に対談解説する音声版です。ながら聴きにどうぞ。最新回はこちら:",
    "hero.eyebrow": "システムエンジニア｜実務18年",
    "hero.role": "バックエンド・インフラ・AI連携",
    "hero.tagline": "現場の業務課題を、最小限の実装で、確実に動くものにする。",
    "hero.sub": "AIを「使う側」を超えて、「業務に組み込む側」へ。要件定義から運用まで一貫して対応します。",
    "hero.badge.open": "業務委託・受注 受付中",
    "hero.badge.remote": "フルリモート",
    "hero.cta.works": "作品を見る", "hero.cta.contact": "お問い合わせ",
    "label.works": "Works", "label.experience": "Experience", "label.cando": "Can Do", "label.about": "About",
    "label.stack": "主な技術スタック",
    "exp.current": "現職",
    "card.go": "詳細を見る",
    "card.dl.aria": "Releases ダウンロード数",
    "card.npm.aria": "npm 直近 30 日 ダウンロード数",
    "cta.stats.cat": "LIVE DASHBOARD", "cta.stats.title": "アプリDL数", "cta.stats.desc": "公開中の OSS のダウンロード数・Star 数をリアルタイム集計。", "cta.stats.descLive": "のべ {dl} DL / ★ {stars}", "cta.stats.go": "アプリDL数はコチラ",
    "about.p1": "新しい技術を追うこと自体が目的ではありません。目の前の課題を解くための手段として、AI・モダンスタック・自社運用インフラまで幅広く使い分けています。製造業の業務システム設計から、人材派遣業の社内システム開発まで、立ち上げから運用まで一貫して関わってきました。",
    "about.p2": "X では、取り繕わずに思っていることをそのまま書いています。整えた発信より、実際に何を考えている人間かを見てもらった方が早い。尖って見える部分も含めて自分なので、合う方と気持ちよく組めればと思っています。",
    "footer.copy": "© 2026 ishizakahiroshi — 業務委託・受注のご相談はお気軽に。",
    "detail.back": "一覧へ戻る", "detail.overview": "Overview", "detail.tech": "Tech Stack", "detail.viewRepo": "GitHubで見る", "detail.viewStore": "Chrome ウェブストアで見る", "detail.viewLive": "ダッシュボードを開く",
    "detail.screenshots": "スクリーンショット", "detail.features": "何ができる？", "detail.usage": "使い方", "detail.articles": "この作品について書いた記事",
    "detail.notfound": "作品が見つかりませんでした。",
    "works.title": "すべての作品", "works.lead": "公開しているものを一覧にしています。トップには主要なものだけ出しています。", "works.back": "トップへ戻る", "works.count": "{n} 作品",
  },
  en: {
    "nav.works": "Works", "nav.experience": "Experience", "nav.cando": "Can Do", "nav.about": "About", "nav.person": "Life", "nav.articles": "Articles", "nav.contact": "Contact", "nav.stats": "Downloads",
    "label.person": "Off the Clock", "label.latest": "Latest", "label.articles": "Articles", "label.contact": "Contact",
    "articles.loading": "Loading articles.",
    "articles.empty": "No articles to show right now.",
    "latest.noteHeading": "Latest on note", "latest.xHeading": "Latest on X",
    "latest.loading": "Loading the latest article.",
    "latest.noteFallback": "The latest article is unavailable. Visit the note profile instead.",
    "latest.noteProfile": "Open note profile",
    "latest.readNote": "Read article",
    "latest.xProfile": "Open X profile",
    "latest.privacy": "The embedded X timeline may send browsing information to X. Personalization-limiting settings are enabled.",
    "about.philosophy": "I solve the small daily frictions myself, by hand.",
    "about.philosophy.sub": "Almost everything I open-source grew out of a problem I (or my team) actually had. My strength is quickly turning “faster to build than to buy” into something real.",
    "about.coreLabel": "Core Competence",
    "about.core": "The range of a generalist who understands the business and can carry a project end-to-end — from upstream design to operation — on their own, and the ability to teach it to others.",
    "contact.lead": "I'm open to contract and project work. No need to be formal — feel free to reach out via X or note first.",
    "contact.welcomeTitle": "Happy to talk about",
    "contact.x": "DM me on X", "contact.note": "Read on note", "contact.github": "View GitHub", "contact.youtube": "Watch on YouTube", "contact.mail": "Show email address",
    "articles.channel": "Audio versions of these articles are on YouTube", "articles.channelBtn": "Visit the channel →",
    "articles.channelSub": "Radio-style AI audio companions to the articles — great for listening while you work. Here's the latest:",
    "hero.eyebrow": "Software Engineer · 18 years",
    "hero.role": "Backend · Infrastructure · AI Integration",
    "hero.tagline": "Solving real operational problems with minimal, reliable implementations.",
    "hero.sub": "Beyond using AI — building it into systems. End-to-end, from requirements to operation.",
    "hero.badge.open": "Open to contract work",
    "hero.badge.remote": "Full remote",
    "hero.cta.works": "View Works", "hero.cta.contact": "Get in touch",
    "label.works": "Works", "label.experience": "Experience", "label.cando": "Can Do", "label.about": "About",
    "label.stack": "Tech Stack",
    "exp.current": "Current",
    "card.go": "View details",
    "card.dl.aria": "Releases downloads",
    "card.npm.aria": "npm downloads, last 30 days",
    "cta.stats.cat": "LIVE DASHBOARD", "cta.stats.title": "App Downloads", "cta.stats.desc": "Real-time download & star counts for my OSS.", "cta.stats.descLive": "{dl} downloads · ★ {stars}", "cta.stats.go": "Open the dashboard",
    "about.p1": "Chasing new technology is not the goal. I reach for AI, modern stacks, and self-hosted infrastructure as means to solve the problem in front of me. From designing business systems in manufacturing to building in-house systems for the staffing industry, I've been involved end-to-end, from launch to operation.",
    "about.p2": "On X, I write what I actually think, unpolished. Rather than a curated feed, it's faster to just show you what kind of person I really am. The edges are part of me too — I'd rather work with people who genuinely fit.",
    "footer.copy": "© 2026 ishizakahiroshi — Open to contract work. Feel free to reach out.",
    "detail.back": "Back to list", "detail.overview": "Overview", "detail.tech": "Tech Stack", "detail.viewRepo": "View on GitHub", "detail.viewStore": "View on Chrome Web Store", "detail.viewLive": "Open dashboard",
    "detail.screenshots": "Screenshots", "detail.features": "What it does", "detail.usage": "How to use", "detail.articles": "Articles about this",
    "detail.notfound": "Work not found.",
    "works.title": "All works", "works.lead": "Everything I've published. The homepage shows only the highlights.", "works.back": "Back to home", "works.count": "{n} works",
  },
};

/* ===== 言語管理 ===== */
/** @returns {Lang} */
function getLang() {
  const saved = localStorage.getItem("lang");
  if (saved === "ja" || saved === "en") return saved;
  // 未保存時: ブラウザ言語が日本語なら ja、それ以外は en
  return (navigator.language || "").toLowerCase().startsWith("ja") ? "ja" : "en";
}
/** @param {Lang} lang */
function setLang(lang) {
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;
  applyI18n(lang);
  // __rerender は各ページの inline script が登録する再描画フック（任意）。
  const win = /** @type {Window & { __rerender?: (l: Lang) => void }} */ (window);
  if (typeof win.__rerender === "function") win.__rerender(lang);
  document.querySelectorAll(".lang-toggle button").forEach((b) => {
    b.classList.toggle("active", /** @type {HTMLElement} */ (b).dataset.lang === lang);
  });
}
/**
 * @param {string} key
 * @param {Lang} lang
 * @returns {string}
 */
function t(key, lang) { return (I18N[lang] && I18N[lang][key]) || (I18N.ja[key] || key); }
/** @param {Lang} lang */
function applyI18n(lang) {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.getAttribute("data-i18n") || "", lang);
  });
}
function initLangToggle() {
  const lang = getLang();
  document.querySelectorAll(".lang-toggle button").forEach((b) => {
    const el = /** @type {HTMLElement} */ (b);
    el.addEventListener("click", () => setLang(/** @type {Lang} */ (el.dataset.lang)));
  });
  setLang(lang);
}

/* ===== 描画ヘルパー ===== */

/**
 * HTML テキストノード向けエスケープ（innerHTML 挿入口の防御）。
 * データは原則作者管理だが、`<` や `&` を含む文言（例: "&lt;1 yr"）が
 * タグとして解釈されて UI が壊れる事故を防ぐ。
 * @param {unknown} value
 * @returns {string}
 */
function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * 属性値向けエスケープ（href / src / style 等）。
 * @param {unknown} value
 * @returns {string}
 */
function escapeAttr(value) {
  return escapeHtml(value);
}

/**
 * 安全なリンク先だけ通す（javascript: / data: 等を拒否）。
 * 許可: http(s) 絶対 URL、サイト内相対 path、#fragment。
 * @param {unknown} url
 * @returns {string} 不正時は "#"
 */
function safeUrl(url) {
  if (typeof url !== "string") return "#";
  const u = url.trim();
  if (!u) return "#";
  // パストラバーサル・制御文字を簡易拒否
  if (u.includes("..") || /[\u0000-\u001F\u007F]/.test(u)) return "#";
  if (u.startsWith("#")) return u;
  if (/^https?:\/\//i.test(u)) return u;
  // scheme 付きは http(s) 以外すべて拒否（javascript: / data: / vbscript: 等）
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(u)) return "#";
  // サイト内相対 path（articles/…, works/…, assets/…, ./…, /…）
  return u;
}

/**
 * CSS 色として安全な値だけ通す（主に WORKS[].c の hex）。
 * @param {unknown} color
 * @returns {string}
 */
function safeCssColor(color) {
  if (typeof color === "string" && /^#[0-9a-fA-F]{3,8}$/.test(color.trim())) {
    return color.trim();
  }
  return "#888888";
}

/** @param {Work} w */
function badgeHtml(w) {
  return `<div class="badge" style="--c:${escapeAttr(safeCssColor(w.c))}">${escapeHtml(w.initials)}</div>`;
}

/**
 * 30 日 sparkline 用の軽量 SVG を生成する。
 * @param {number[] | undefined} values  古い順の数値列
 * @param {string} color                hex / CSS color
 * @returns {string}                    HTML 文字列。描画不可なら ""
 */
function sparklineSvg(values, color) {
  if (!Array.isArray(values) || values.length === 0) return "";
  for (const v of values) {
    if (typeof v !== "number" || !Number.isFinite(v)) return "";
  }
  const safeColor = safeCssColor(color);
  const W = 80, H = 20, pad = 2;
  const n = values.length;
  let min = values[0], max = values[0];
  for (const v of values) { if (v < min) min = v; if (v > max) max = v; }
  const range = max - min;
  const xStep = n > 1 ? (W - pad * 2) / (n - 1) : 0;
  const points = values.map((v, i) => {
    const x = pad + xStep * i;
    const y = range === 0 ? H / 2 : pad + (H - pad * 2) * (1 - (v - min) / range);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return `<svg class="spark-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">` +
    `<polyline points="${points}" fill="none" stroke="${escapeAttr(safeColor)}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

/**
 * カード / 詳細ページ 共通の作品メタ情報レンダリング。
 * ★ / ↓ Releases DL / ↻ npm 30d DL（dl-stats から取得済みなら表示）と
 * 30 日 sparkline をまとめて HTML 化する。同じクラス名（`.meta` / `.dl` /
 * `.spark`）を返すので、両ページで同じ CSS が適用される。
 * @param {Work} w
 * @param {Lang} lang
 * @returns {{ metaHtml: string, sparkHtml: string }}
 */
function renderWorkStats(w, lang) {
  /** @type {string[]} */
  const parts = [];
  if (w.stars > 0) parts.push(`<span class="star">★ ${escapeHtml(w.stars)}</span>`);
  if (w.dl && typeof w.dl.releases === "number") {
    parts.push(`<span class="dl" aria-label="${escapeAttr(t("card.dl.aria", lang))}"><span class="arrow">↓</span> ${escapeHtml(w.dl.releases)}</span>`);
  }
  if (w.dl && typeof w.dl.npm30d === "number") {
    parts.push(`<span class="dl npm" aria-label="${escapeAttr(t("card.npm.aria", lang))}"><span class="arrow">↻</span> ${escapeHtml(w.dl.npm30d)} 30d</span>`);
  }
  const meta = parts.join(`<span class="sep">·</span>`);
  const metaHtml = `<div class="meta">${meta}</div>`;
  const spark = sparklineSvg(w.dl?.sparkReleases, w.c);
  const sparkHtml = spark ? `<div class="spark">${spark}</div>` : "";
  return { metaHtml, sparkHtml };
}

/* index（トップ）のカードに出す主要作品。この順で 9 枚並べ、10 枚目は「もっと見る」
 * カード（works.html へ）にする。ここに無い作品は works.html（全作品）にのみ出る。 */
const FEATURED_IDS = [
  "many-ai-cli", "offline-md-editor-viewer", "dl-stats", "docsweep",
  "ai-audit-prompts", "always-pinned", "PlainSheet", "setpanel", "ShotTTL",
];

/**
 * 作品カード 1 枚（index / works.html 共通）。
 * @param {Work} w
 * @param {Lang} lang
 * @param {number} i  アニメーション遅延用インデックス
 * @returns {HTMLAnchorElement}
 */
function workCardEl(w, lang, i) {
  const a = document.createElement("a");
  a.className = "card reveal";
  a.href = `work.html?id=${encodeURIComponent(w.id)}`;
  a.style.setProperty("--c", safeCssColor(w.c));
  a.style.animationDelay = i * 0.06 + "s";
  const { metaHtml, sparkHtml } = renderWorkStats(w, lang);
  a.innerHTML =
    badgeHtml(w) +
    `<div class="cat">${escapeHtml(w.cat[lang])}</div>` +
    `<h3>${escapeHtml(w.id)}</h3>` +
    `<p>${escapeHtml(w.short[lang])}</p>` +
    metaHtml +
    sparkHtml +
    `<span class="go">${escapeHtml(t("card.go", lang))} <span class="arrow">→</span></span>`;
  return a;
}

/**
 * 10 枚目「もっと見る」カード。残りの作品を色バッジで予告し works.html へ誘導する。
 * @param {Work[]} rest  featured に含まれない残りの作品
 * @param {Lang} lang
 * @param {number} i
 * @returns {HTMLAnchorElement}
 */
function moreCardEl(rest, lang, i) {
  const a = document.createElement("a");
  a.className = "card card-more reveal";
  a.href = "works.html";
  a.style.animationDelay = i * 0.06 + "s";
  const chips = rest
    .map((w) => `<span class="mchip" style="background:${escapeAttr(safeCssColor(w.c))}">${escapeHtml(w.initials)}</span>`)
    .join("");
  const unit = lang === "ja" ? "作品" : rest.length === 1 ? "work" : "works";
  const desc = lang === "ja"
    ? "拡張機能・CLI・自社インフラ系のツールたち。まだまだ作ってます。"
    : "Extensions, CLIs, and self-hosted tooling — and more on the way.";
  const cta = lang === "ja" ? "すべての作品を見る" : "See all works";
  a.innerHTML =
    `<div class="mcluster">${chips}</div>` +
    `<div class="mcount">+${rest.length}<small>${escapeHtml(unit)}</small></div>` +
    `<p>${escapeHtml(desc)}</p>` +
    `<span class="go">${escapeHtml(cta)} <span class="arrow">→</span></span>`;
  return a;
}

/** index（トップ）の WORKS：主要 9 枚 ＋ もっと見るカード
 *  @param {Lang} lang */
function renderWorks(lang) {
  const grid = document.getElementById("works-grid");
  if (!grid) return;
  grid.innerHTML = "";
  const featured = /** @type {Work[]} */ (
    FEATURED_IDS.map((id) => WORKS.find((w) => w.id === id)).filter(Boolean)
  );
  featured.forEach((w, i) => grid.appendChild(workCardEl(w, lang, i)));
  const rest = WORKS.filter((w) => !FEATURED_IDS.includes(w.id));
  if (rest.length > 0) grid.appendChild(moreCardEl(rest, lang, featured.length));
}

/** works.html（全作品）の WORKS：全件を配列順に描画
 *  @param {Lang} lang */
function renderWorksAll(lang) {
  const grid = document.getElementById("works-grid-all");
  if (!grid) return;
  grid.innerHTML = "";
  WORKS.forEach((w, i) => grid.appendChild(workCardEl(w, lang, i)));
}

/** @param {Lang} lang */
function renderExperience(lang) {
  const list = document.getElementById("exp-list");
  if (!list) return;
  list.innerHTML = "";
  EXPERIENCE.forEach((e) => {
    const div = document.createElement("div");
    div.className = "exp";
    const tag = e.current ? `<span class="tag-current">${escapeHtml(t("exp.current", lang))}</span>` : "";
    div.innerHTML =
      `<div class="role">${escapeHtml(e.role[lang])}${tag}</div>` +
      `<div class="org">${escapeHtml(e.org[lang])}</div>` +
      `<p>${escapeHtml(e.desc[lang])}</p>`;
    list.appendChild(div);
  });
}

/** @param {Lang} lang */
function renderCanDo(lang) {
  const grid = document.getElementById("cando-grid");
  if (!grid) return;
  grid.innerHTML = "";
  CANDO.forEach((c) => {
    const div = document.createElement("div");
    div.className = "cando";
    div.innerHTML = `<h4>${escapeHtml(c.title[lang])}</h4><p>${escapeHtml(c.desc[lang])}</p>`;
    grid.appendChild(div);
  });
  const chips = document.getElementById("stack-chips");
  if (chips) {
    chips.innerHTML = SKILLS.map((tier) => {
      const cls = tier.highlight ? "skill-tier hot" : "skill-tier";
      const items = tier.items.map((s) => `<span class="chip">${escapeHtml(s)}</span>`).join("");
      return `<div class="${cls}"><span class="ylabel">${escapeHtml(tier.years[lang])}</span><div class="schips">${items}</div></div>`;
    }).join("");
  }
}

/** @param {Lang} lang */
function renderStats(lang) {
  const el = document.getElementById("stats");
  if (!el) return;
  el.innerHTML = STATS.map((s) =>
    `<div class="stat"><div class="snum">${escapeHtml(s.num)}<span class="sunit">${escapeHtml(s.unit[lang])}</span></div><div class="slabel">${escapeHtml(s.label[lang])}</div></div>`
  ).join("");
}

/**
 * @typedef {Object} ArticleLinks
 * @property {string} [zenn]
 * @property {string} [note]
 * @property {string} [qiita]
 * @property {string} [html]
 * @property {string} [youtube]
 *
 * @typedef {Object} Article
 * @property {string} date         YYYY-MM-DD
 * @property {L10n} title
 * @property {L10n} short
 * @property {L10n} [tag]          記事タイプ（失敗談 / 設計判断 / ツール紹介 / エッセイ / 振り返り 等）
 * @property {string} [hero]       相対パス（articles/<date>-<slug>/hero.png）
 * @property {ArticleLinks} links  プラットフォーム別 URL（少なくとも 1 つ）
 */

/** @type {Article[]} */
let articlesList = [];
/** @type {"loading" | "ready" | "error"} */
let articlesState = "loading";

/* ---------- 記事一覧のフィルタ状態 ----------
 * 媒体タブ + タグフィルタは記事 5 件未満では非表示にし、純粋なリスト表示にする
 * （UX 簡素化）。5 件以上のときだけフィルタ UI を articles-list の直前に挿入する。
 * 状態は module-level 変数に保持し、再描画時に維持する。
 */
/** @type {"all" | "zenn" | "note" | "qiita" | "html"} */
let activePlatform = "all";
/** @type {Set<string>} */
const activeTags = new Set();
/** 記事数がこの本数未満ならフィルタ UI を出さない */
const FILTER_MIN_ARTICLES = 5;

/* ---------- 「もっと見る」ページング状態 ----------
 * 初期 PAGE_SIZE 件だけ描画し、「もっと見る」ボタンで +PAGE_SIZE ずつ追加表示する。
 * 100 件あっても 1 クリックで全展開せず、段階的に増える。
 * タブ・タグフィルタの変更時は visibleCount を PAGE_SIZE にリセット（絞り込み結果を上から見せる）。
 * 言語切替時はリセットしない（同じ位置を維持）。
 */
const PAGE_SIZE = 5;
let visibleCount = PAGE_SIZE;
function resetArticleVisibleCount() {
  visibleCount = PAGE_SIZE;
}

/* ---------- 検索フィルタ ----------
 * タイトル / 概要 / タグ（ja + en 両方）に対する部分一致（大文字小文字無視）。
 * タブ・タグフィルタと AND で重ねがける（全条件パスした記事のみ表示）。
 * 入力ごとに visibleCount をリセット（絞り込み結果を上から見せる）。
 * 再描画でフォーカスが外れないよう、renderArticles で input フォーカスと caret を退避・復元する。
 */
let searchQuery = "";

/**
 * 記事の最終リンク先（HTML 版があればそれを、無ければ Zenn / note / Qiita のいずれか）
 * @param {ArticleLinks} links
 * @returns {string | null}
 */
function primaryArticleLink(links) {
  if (links.html) return links.html;
  if (links.zenn) return links.zenn;
  if (links.note) return links.note;
  if (links.qiita) return links.qiita;
  return null;
}

/**
 * 記事が持つプラットフォーム集合（バッジ / タブ判定用）。
 * @param {ArticleLinks} links
 * @returns {Array<"zenn" | "note" | "qiita" | "html">}
 */
function articlePlatforms(links) {
  /** @type {Array<"zenn" | "note" | "qiita" | "html">} */
  const out = [];
  if (links.zenn) out.push("zenn");
  if (links.note) out.push("note");
  if (links.qiita) out.push("qiita");
  if (links.html) out.push("html");
  return out;
}

/**
 * フィルタ UI を articles-list の直前に差し込む。記事数が FILTER_MIN_ARTICLES 未満なら何もしない。
 * 既存の filter bar があれば削除してから作り直す（言語切替・状態変更時に再生成）。
 * @param {Lang} lang
 */
function renderArticleFilters(lang) {
  const listEl = document.getElementById("articles-list");
  if (!listEl || !listEl.parentNode) return;

  // 既存 bar を撤去。ただし検索 input 要素は再利用する（毎キーで作り直すと
  // IME 合成状態と focus が飛び、日本語入力で「1文字だけ入って以降は反映されない・
  // 削除も効かない」現象になるため）。
  const existing = document.getElementById("articles-filters");
  const preservedSearchInput = /** @type {HTMLInputElement | null} */ (
    existing ? existing.querySelector("#articles-search-input") : null
  );
  if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

  if (articlesState !== "ready") return;
  if (articlesList.length < FILTER_MIN_ARTICLES) return;

  // プラットフォーム件数を集計
  /** @type {Record<string, number>} */
  const platformCounts = { all: articlesList.length, zenn: 0, note: 0, qiita: 0, html: 0 };
  for (const a of articlesList) {
    for (const p of articlePlatforms(a.links)) platformCounts[p] = (platformCounts[p] || 0) + 1;
  }

  // タグ一覧（出現順 = articlesList の順）
  /** @type {Map<string, string>} */
  const tagMap = new Map(); // ja key → display label（現言語）
  for (const a of articlesList) {
    if (!a.tag) continue;
    const keyJa = a.tag.ja;
    const display = a.tag[lang] || a.tag.ja;
    if (!tagMap.has(keyJa)) tagMap.set(keyJa, display);
  }

  const bar = document.createElement("div");
  bar.id = "articles-filters";
  bar.className = "articles-filters";

  // 検索 input（タブ・タグと AND で重ねがけ）
  const searchRow = document.createElement("div");
  searchRow.className = "articles-search";
  const searchInput = preservedSearchInput || document.createElement("input");
  if (!preservedSearchInput) {
    searchInput.type = "search";
    searchInput.id = "articles-search-input";
    searchInput.value = searchQuery;
    // 合成中（IME 変換中）は再描画しない。commit（compositionend）時に一度だけ再描画。
    let composing = false;
    searchInput.addEventListener("compositionstart", () => { composing = true; });
    searchInput.addEventListener("compositionend", () => {
      composing = false;
      searchQuery = searchInput.value;
      resetArticleVisibleCount();
      renderArticles(getLang());
    });
    searchInput.addEventListener("input", () => {
      if (composing) return;
      searchQuery = searchInput.value;
      resetArticleVisibleCount();
      renderArticles(getLang());
    });
  }
  searchInput.placeholder = lang === "ja"
    ? "記事を検索 (タイトル / 概要 / タグ)"
    : "Search articles (title / summary / tag)";
  searchRow.appendChild(searchInput);
  bar.appendChild(searchRow);

  // 媒体タブ
  const tabsRow = document.createElement("div");
  tabsRow.className = "articles-tabs";
  const tabLabels = lang === "ja"
    ? { all: "全件", zenn: "Zenn", note: "note", qiita: "Qiita", html: "HTML 版" }
    : { all: "All", zenn: "Zenn", note: "note", qiita: "Qiita", html: "HTML" };
  /** @type {Array<"all" | "zenn" | "note" | "qiita" | "html">} */
  const tabOrder = ["all", "zenn", "note", "qiita", "html"];
  for (const key of tabOrder) {
    if (key !== "all" && !platformCounts[key]) continue; // 該当 0 件のタブは出さない
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "atab" + (activePlatform === key ? " active" : "");
    btn.dataset.platform = key;
    btn.textContent = `${tabLabels[key]} (${platformCounts[key] || 0})`;
    btn.addEventListener("click", () => {
      activePlatform = key;
      resetArticleVisibleCount();
      renderArticles(getLang());
    });
    tabsRow.appendChild(btn);
  }
  bar.appendChild(tabsRow);

  // タグ chip（複数選択 = OR フィルタ）
  if (tagMap.size > 0) {
    const tagsRow = document.createElement("div");
    tagsRow.className = "articles-tagchips";
    for (const [keyJa, display] of tagMap) {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "atagchip" + (activeTags.has(keyJa) ? " active" : "");
      chip.dataset.tag = keyJa;
      chip.textContent = display;
      chip.addEventListener("click", () => {
        if (activeTags.has(keyJa)) activeTags.delete(keyJa);
        else activeTags.add(keyJa);
        resetArticleVisibleCount();
        renderArticles(getLang());
      });
      tagsRow.appendChild(chip);
    }
    // クリアボタン（任意 1 個でも選択中なら表示）
    if (activeTags.size > 0) {
      const clear = document.createElement("button");
      clear.type = "button";
      clear.className = "atagchip atagchip-clear";
      clear.textContent = lang === "ja" ? "解除" : "Clear";
      clear.addEventListener("click", () => {
        activeTags.clear();
        resetArticleVisibleCount();
        renderArticles(getLang());
      });
      tagsRow.appendChild(clear);
    }
    bar.appendChild(tagsRow);
  }

  listEl.parentNode.insertBefore(bar, listEl);
}

/** @param {Lang} lang */
function renderArticles(lang) {
  const root = document.getElementById("articles-list");
  if (!root) return;

  // 再描画で検索 input のフォーカスと caret が消えるのを防ぐため退避
  const focused = /** @type {HTMLInputElement | null} */ (
    /** @type {unknown} */ (document.activeElement)
  );
  const wasSearchInput = focused !== null && focused.id === "articles-search-input";
  const selStart = wasSearchInput ? focused.selectionStart : null;
  const selEnd = wasSearchInput ? focused.selectionEnd : null;

  root.replaceChildren();

  // フィルタ UI を更新（再描画ごとに作り直す。lang 切替・カウント表示・active 状態に追従）
  renderArticleFilters(lang);

  if (articlesState === "loading") {
    const p = document.createElement("p");
    p.className = "articles-loading";
    p.textContent = t("articles.loading", lang);
    root.appendChild(p);
    return;
  }

  if (articlesState === "error" || articlesList.length === 0) {
    const p = document.createElement("p");
    p.className = "articles-loading";
    p.textContent = t("articles.empty", lang);
    root.appendChild(p);
    return;
  }

  // 5 件以上のときだけフィルタが効く。少ない時は active 状態を無視してそのまま出す
  const filtersActive = articlesList.length >= FILTER_MIN_ARTICLES;
  const filtered = filtersActive
    ? articlesList.filter((a) => {
        const plats = articlePlatforms(a.links);
        if (activePlatform !== "all" && !plats.includes(activePlatform)) return false;
        if (activeTags.size > 0) {
          const tagJa = a.tag ? a.tag.ja : "";
          if (!activeTags.has(tagJa)) return false;
        }
        const q = searchQuery.trim().toLowerCase();
        if (q) {
          const haystack = [
            a.title.ja || "", a.title.en || "",
            a.short.ja || "", a.short.en || "",
            a.tag ? a.tag.ja : "", a.tag ? a.tag.en : "",
          ].join(" ").toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      })
    : articlesList;

  // ページング: 初期 PAGE_SIZE 件 + 「もっと見る」で +PAGE_SIZE ずつ追加
  // （filtered = 絞り込み後の全件 / visible = 今回描画する分。残数判定は filtered.length で行う）
  const visible = filtered.slice(0, visibleCount);

  if (filtered.length === 0) {
    const p = document.createElement("p");
    p.className = "articles-loading";
    p.textContent = lang === "ja"
      ? "条件に合う記事がありません。フィルタを解除してください。"
      : "No articles match the current filters.";
    root.appendChild(p);
    return;
  }

  for (const a of visible) {
    const row = document.createElement("article");
    row.className = "article-row";
    // 媒体タブの絞り込みを CSS 側でも利用できるよう dataset に書き出す
    // （現状は JS 側で filter しているので必須ではないが、後段で「タブ切替を CSS だけで処理」
    // にしたくなった時のフック）。
    row.dataset.platforms = articlePlatforms(a.links).join(" ");

    const date = document.createElement("time");
    date.className = "article-date";
    date.dateTime = a.date;
    date.textContent = a.date;
    row.appendChild(date);

    const thumb = document.createElement("div");
    thumb.className = "article-thumb" + (a.hero ? "" : " empty");
    if (a.hero) {
      const safeHero = safeUrl(a.hero);
      if (safeHero !== "#") {
        const img = document.createElement("img");
        img.src = safeHero;
        img.alt = "";
        img.loading = "lazy";
        img.decoding = "async";
        thumb.appendChild(img);
      } else {
        thumb.classList.add("empty");
        thumb.textContent = lang === "ja" ? "hero なし" : "no hero";
      }
    } else {
      thumb.textContent = lang === "ja" ? "hero なし" : "no hero";
    }
    row.appendChild(thumb);

    const col = document.createElement("div");
    col.className = "article-col";

    const title = document.createElement("h3");
    title.className = "article-title";
    const titleText = a.title[lang] || a.title.ja;
    const primary = primaryArticleLink(a.links);
    if (primary) {
      const titleLink = document.createElement("a");
      const safePrimary = safeUrl(primary);
      titleLink.href = safePrimary;
      if (safePrimary !== "#" && !safePrimary.startsWith("articles/") && !safePrimary.startsWith("/")) {
        titleLink.target = "_blank";
        titleLink.rel = "noopener noreferrer";
      }
      titleLink.textContent = titleText;
      title.appendChild(titleLink);
    } else {
      title.textContent = titleText;
    }
    col.appendChild(title);

    const desc = document.createElement("p");
    desc.className = "article-desc";
    desc.textContent = a.short[lang] || a.short.ja;
    col.appendChild(desc);

    const links = document.createElement("div");
    links.className = "article-links";
    const order = /** @type {const} */ (["zenn", "note", "qiita", "html", "youtube"]);
    const labels = { zenn: "Zenn", note: "note", qiita: "Qiita", html: lang === "ja" ? "HTML 版" : "HTML", youtube: lang === "ja" ? "YouTube 音声" : "YouTube" };
    for (const key of order) {
      const url = a.links[key];
      if (!url) continue;
      const pill = document.createElement("a");
      pill.className = `lpill lpill-${key}`;
      const safe = safeUrl(url);
      pill.href = safe;
      if (safe !== "#" && !safe.startsWith("articles/") && !safe.startsWith("/")) {
        pill.target = "_blank";
        pill.rel = "noopener noreferrer";
      }
      pill.innerHTML = `${escapeHtml(labels[key])} <span aria-hidden="true">▶</span>`;
      links.appendChild(pill);
    }
    col.appendChild(links);
    row.appendChild(col);

    if (a.tag) {
      const tagBox = document.createElement("div");
      tagBox.className = "article-right";
      const tag = document.createElement("span");
      tag.className = "article-tag";
      tag.textContent = a.tag[lang] || a.tag.ja;
      tagBox.appendChild(tag);
      row.appendChild(tagBox);
    }

    root.appendChild(row);
  }

  // 「もっと見る」ボタン: 残り件数があれば描画（無ければ非表示）
  if (filtered.length > visibleCount) {
    const remaining = filtered.length - visibleCount;
    const nextChunk = Math.min(PAGE_SIZE, remaining);
    const wrap = document.createElement("div");
    wrap.className = "articles-loadmore";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "loadmore-btn";
    btn.textContent = lang === "ja"
      ? `もっと見る (+${nextChunk} / 残り ${remaining} 件)`
      : `Show more (+${nextChunk} / ${remaining} remaining)`;
    btn.addEventListener("click", () => {
      visibleCount += PAGE_SIZE;
      renderArticles(getLang());
    });
    wrap.appendChild(btn);
    root.appendChild(wrap);
  }

  // 検索 input のフォーカス + caret 復元（再生成で消えるのを防ぐ）
  if (wasSearchInput) {
    const newInput = /** @type {HTMLInputElement | null} */ (
      /** @type {unknown} */ (document.getElementById("articles-search-input"))
    );
    if (newInput) {
      newInput.focus();
      if (selStart !== null && selEnd !== null) newInput.setSelectionRange(selStart, selEnd);
    }
  }
}

async function loadArticles() {
  try {
    const response = await fetch("assets/articles.json", { cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!data || !Array.isArray(data.articles)) {
      throw new Error("Invalid articles.json");
    }
    const arr = /** @type {Article[]} */ (data.articles);
    articlesList = arr.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
    articlesState = "ready";
  } catch (error) {
    console.warn("Articles could not be loaded.", error);
    articlesList = [];
    articlesState = "error";
  }
  renderArticles(getLang());
  renderLatestVideoEmbed();
}

/**
 * 最新の音声版動画（youtube リンクを持つ最新記事）を Articles セクション先頭に埋め込む。
 * articles.json が正典なので、音声版つきの記事を追記するだけで自動的に最新回へ切り替わる。
 * 言語切替の再描画で iframe をリロードしないよう、一度だけ生成する。
 */
function renderLatestVideoEmbed() {
  const box = document.getElementById("articles-latest-video");
  if (!box || box.dataset.loaded === "1") return;
  const latest = articlesList.find((a) => a.links && a.links.youtube);
  if (!latest || !latest.links.youtube) return;
  const m = latest.links.youtube.match(/(?:youtu\.be\/|[?&]v=|\/embed\/)([A-Za-z0-9_-]{6,})/);
  if (!m) return;
  const iframe = document.createElement("iframe");
  iframe.src = "https://www.youtube-nocookie.com/embed/" + m[1];
  iframe.title = "AI 音声解説: " + latest.title.ja;
  iframe.setAttribute("loading", "lazy");
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.setAttribute("allowfullscreen", "");
  box.appendChild(iframe);
  box.hidden = false;
  box.dataset.loaded = "1";
}

async function fetchDlStats() {
  try {
    const res = await fetch("https://dl-stats.ishizakahiroshi.workers.dev/api/stats.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    /** @type {any} */
    const data = await res.json();
    // Update totals in STATS array
    const starsEntry = STATS.find((s) => s.label.ja === "GitHub Stars");
    if (starsEntry && typeof data.totals?.stars === "number") {
      starsEntry.num = `★${data.totals.stars}`;
    }
    const dlEntry = STATS.find((s) => s.label.ja === "配布数（直近）");
    if (dlEntry && typeof data.cumulativeInstalls === "number") {
      dlEntry.num = data.cumulativeInstalls.toLocaleString();
    }
    // Update individual work star counts / DL counts / sparkline
    // dl-stats API の tool.repo は owner プレフィックス無しの末尾セグメントだけ
    // （例: "many-ai-cli"）。WORKS[].repo は完全な GitHub URL なので、末尾
    // セグメントどうしで突き合わせる。
    if (Array.isArray(data.tools)) {
      for (const tool of data.tools) {
        if (typeof tool.repo !== "string") continue;
        const toolSlug = tool.repo.split("/").pop();
        const w = WORKS.find((x) => x.repo.split("/").pop() === toolSlug);
        if (!w) continue;
        if (typeof tool.metrics?.stars === "number") {
          w.stars = tool.metrics.stars;
        }
        if (!w.dl) w.dl = {};
        if (typeof tool.metrics?.releasesTotal === "number") {
          w.dl.releases = tool.metrics.releasesTotal;
        }
        if (typeof tool.metrics?.npm30d === "number") {
          w.dl.npm30d = tool.metrics.npm30d;
        }
        if (Array.isArray(tool.spark?.releases)) {
          w.dl.sparkReleases = tool.spark.releases;
        }
      }
    }
    const lang = getLang();
    renderStats(lang);
    renderWorks(lang);
    renderWorksAll(lang);
    renderDetail(lang);
  } catch (e) {
    console.warn("dl-stats fetch failed", e);
  }
}

/** @param {Lang} lang */
function renderContact(lang) {
  const list = document.getElementById("welcome-list");
  if (list) {
    list.innerHTML = CONTACT_WELCOME.map((w) => `<li>${escapeHtml(w[lang])}</li>`).join("");
  }
  const x = /** @type {HTMLAnchorElement | null} */ (document.getElementById("c-x"));
  const note = /** @type {HTMLAnchorElement | null} */ (document.getElementById("c-note"));
  const gh = /** @type {HTMLAnchorElement | null} */ (document.getElementById("c-github"));
  if (x) { x.href = PROFILE.x; /** @type {HTMLElement} */ (x.querySelector(".t")).textContent = t("contact.x", lang); }
  if (note) { note.href = PROFILE.note; /** @type {HTMLElement} */ (note.querySelector(".t")).textContent = t("contact.note", lang); }
  if (gh) { gh.href = PROFILE.github; /** @type {HTMLElement} */ (gh.querySelector(".t")).textContent = t("contact.github", lang); }
  const yt = /** @type {HTMLAnchorElement | null} */ (document.getElementById("c-youtube"));
  if (yt) { yt.href = PROFILE.youtube; /** @type {HTMLElement} */ (yt.querySelector(".t")).textContent = t("contact.youtube", lang); }

  // メール：生のアドレスは HTML に置かず、クリック時に JS で組み立てて表示
  const mailBtn = /** @type {HTMLAnchorElement | null} */ (document.getElementById("c-mail"));
  if (mailBtn) {
    if (PROFILE.contactEmail && PROFILE.contactEmail.length === 2) {
      const email = PROFILE.contactEmail;
      mailBtn.style.display = "";
      /** @type {HTMLElement} */ (mailBtn.querySelector(".t")).textContent = t("contact.mail", lang);
      mailBtn.onclick = function (e) {
        e.preventDefault();
        const addr = email[0] + "@" + email[1];
        mailBtn.href = "mailto:" + addr;
        /** @type {HTMLElement} */ (mailBtn.querySelector(".t")).textContent = addr;
        mailBtn.onclick = null;
      };
    } else {
      mailBtn.style.display = "none";
    }
  }
}

/** @param {Lang} lang */
function renderPersona(lang) {
  const grid = document.getElementById("persona-grid");
  if (!grid) return;
  grid.innerHTML = "";
  PERSONA.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "fact reveal";
    div.style.animationDelay = i * 0.05 + "s";
    div.innerHTML = `<span class="fe">${escapeHtml(p.emoji)}</span><span>${escapeHtml(p[lang])}</span>`;
    grid.appendChild(div);
  });
}

/**
 * 記事が作品に関連するかを、記事の文言（タイトル / 概要 / タグ ja+en）に
 * 作品名が含まれるかで判定する。判定キーは 3 種:
 *   - 作品 id そのまま（例 "many-ai-cli"・大文字小文字無視）
 *   - ハイフン/アンダースコアを空白にした形（"many ai cli"）
 *   - 記号を除去した圧縮形（"manyaicli"／5 文字以上のときだけ・短い id の誤爆防止）
 * @param {Article} a
 * @param {Work} w
 * @returns {boolean}
 */
function articleMatchesWork(a, w) {
  const id = w.id.toLowerCase();
  const spaced = id.replace(/[-_]/g, " ");
  const compact = id.replace(/[-_\s]/g, "");
  const hay = [a.title?.ja, a.title?.en, a.short?.ja, a.short?.en, a.tag?.ja, a.tag?.en]
    .filter(Boolean).join(" ").toLowerCase();
  if (hay.includes(id) || hay.includes(spaced)) return true;
  if (compact.length >= 5 && hay.replace(/[-_\s]/g, "").includes(compact)) return true;
  return false;
}

/** @param {Lang} lang */
function renderDetail(lang) {
  const root = document.getElementById("detail-root");
  if (!root) return;
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const w = WORKS.find((x) => x.id === id);
  if (!w) {
    root.innerHTML = `<p>${escapeHtml(t("detail.notfound", lang))}</p>`;
    document.title = PROFILE.nameEn;
    return;
  }
  document.title = `${w.id} — ${PROFILE.nameEn}`;
  const color = safeCssColor(w.c);
  root.style.setProperty("--c", color);
  const { metaHtml, sparkHtml } = renderWorkStats(w, lang);

  // ヒーロー（tagline は任意）
  const taglineHtml = w.tagline ? `<p class="detail-tagline">${escapeHtml(w.tagline[lang])}</p>` : "";
  const head =
    `<div class="detail-head" style="--c:${escapeAttr(color)}">` +
    badgeHtml(w) +
    `<div><div class="cat">${escapeHtml(w.cat[lang])}</div><h1>${escapeHtml(w.id)}</h1>${taglineHtml}${metaHtml}${sparkHtml}</div>` +
    `</div>`;

  // スクリーンショット（任意・shots が 1 枚以上あるときだけ）
  let shotsHtml = "";
  if (Array.isArray(w.shots) && w.shots.length > 0) {
    const imgs = w.shots
      .map((src) => {
        const safeSrc = safeUrl(src);
        if (safeSrc === "#") return "";
        return `<figure class="dshot"><img src="${escapeAttr(safeSrc)}" alt="" loading="lazy" decoding="async"></figure>`;
      })
      .join("");
    if (imgs) shotsHtml = `<h2>${escapeHtml(t("detail.screenshots", lang))}</h2><div class="dshots">${imgs}</div>`;
  }

  // 何ができる（任意）
  let featsHtml = "";
  if (Array.isArray(w.features) && w.features.length > 0) {
    const cards = w.features
      .map((f) => `<div class="dfeat"><div class="dfeat-ic">${escapeHtml(f.icon)}</div><h4>${escapeHtml(f.title[lang])}</h4><p>${escapeHtml(f.desc[lang])}</p></div>`)
      .join("");
    featsHtml = `<h2>${escapeHtml(t("detail.features", lang))}</h2><div class="dfeats">${cards}</div>`;
  }

  // 使い方（任意）
  let usageHtml = "";
  if (w.usage) {
    const u = w.usage;
    const lines = [];
    if (u.install) lines.push(`<code class="cline">${escapeHtml(u.install)}</code>`);
    if (u.run) lines.push(`<code class="cline">${escapeHtml(u.run)}</code>`);
    const codeBlock = lines.length ? `<div class="dcode">${lines.join("")}</div>` : "";
    const steps = Array.isArray(u.steps) && u.steps.length > 0
      ? `<ol class="dsteps">${u.steps.map((s) => `<li>${escapeHtml(s[lang])}</li>`).join("")}</ol>`
      : "";
    usageHtml = `<h2>${escapeHtml(t("detail.usage", lang))}</h2>${codeBlock}${steps}`;
  }

  // 関連記事（自動）：articles.json（articlesList）から作品名の文言マッチで抽出する。
  // 作品側・記事側に手作業は不要。記事を articles.json に足すだけで自動で紐づく。
  let artsHtml = "";
  const matched = Array.isArray(articlesList) ? articlesList.filter((a) => articleMatchesWork(a, w)) : [];
  if (matched.length > 0) {
    const platLabels = { zenn: "Zenn", note: "note", qiita: "Qiita", html: lang === "ja" ? "HTML版" : "HTML" };
    const rows = matched
      .map((a) => {
        const url = primaryArticleLink(a.links);
        if (!url) return "";
        const safe = safeUrl(url);
        if (safe === "#") return "";
        const badges = articlePlatforms(a.links)
          .map((p) => `<span class="dpf dpf-${p}">${escapeHtml(platLabels[p])}</span>`)
          .join("");
        const ext = safe.startsWith("articles/") || safe.startsWith("/") ? "" : ` target="_blank" rel="noopener noreferrer"`;
        return `<a class="dart" href="${escapeAttr(safe)}"${ext}><span class="dpfs">${badges}</span>` +
          `<span class="dart-t">${escapeHtml(a.title[lang] || a.title.ja)}</span><span class="dart-ar" aria-hidden="true">▶</span></a>`;
      })
      .join("");
    if (rows) artsHtml = `<h2>${escapeHtml(t("detail.articles", lang))}</h2><div class="darts">${rows}</div>`;
  }

  const body =
    `<div class="detail-body" style="--c:${escapeAttr(color)}">` +
    shotsHtml +
    `<h2>${escapeHtml(t("detail.overview", lang))}</h2><p>${escapeHtml(w.long[lang])}</p>` +
    featsHtml +
    usageHtml +
    `<h2>${escapeHtml(t("detail.tech", lang))}</h2><div class="tech-tags">${w.tech.map((x) => `<span class="chip">${escapeHtml(x)}</span>`).join("")}</div>` +
    artsHtml +
    `<div class="detail-cta"><a class="btn primary" href="${escapeAttr(safeUrl(w.repo))}" target="_blank" rel="noopener noreferrer">${escapeHtml(t("detail.viewRepo", lang))} <span class="arrow">→</span></a>` +
    (w.store ? `<a class="btn ghost" href="${escapeAttr(safeUrl(w.store))}" target="_blank" rel="noopener noreferrer">${escapeHtml(t("detail.viewStore", lang))} <span class="arrow">→</span></a>` : "") +
    (w.live ? `<a class="btn ghost" href="${escapeAttr(safeUrl(w.live))}" target="_blank" rel="noopener noreferrer">${escapeHtml(t("detail.viewLive", lang))} <span class="arrow">→</span></a>` : "") +
    `</div>` +
    `</div>`;

  root.innerHTML = head + body;
}
