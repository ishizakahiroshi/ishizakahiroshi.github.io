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
 *
 * @typedef {Object} LatestNote
 * @property {string} title
 * @property {string} url
 * @property {string} publishedAt
 * @property {string} description
 * @property {string} imageUrl
 * @property {string} fetchedAt
 * @property {string} source
 */

/* ===== プロフィール / 作品 / 経歴データ（日英） ===== */

/** @type {{ name: string, nameEn: string, github: string, x: string, note: string, contactEmail: [string, string] | null }} */
const PROFILE = {
  name: "ishizakahiroshi",
  nameEn: "ishizakahiroshi",
  github: "https://github.com/ishizakahiroshi",
  x: "https://x.com/ishizakahiroshi",
  note: "https://note.com/ishizakahiroshi",
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
    "contact.x": "X でDMする", "contact.note": "note を見る", "contact.github": "GitHub を見る", "contact.mail": "メールアドレスを表示",
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
    "detail.notfound": "作品が見つかりませんでした。",
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
    "contact.x": "DM me on X", "contact.note": "Read on note", "contact.github": "View GitHub", "contact.mail": "Show email address",
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
    "detail.notfound": "Work not found.",
  },
};

/* ===== 言語管理 ===== */
/** @returns {Lang} */
function getLang() {
  const saved = localStorage.getItem("lang");
  if (saved === "ja" || saved === "en") return saved;
  return (navigator.language || "").toLowerCase().startsWith("ja") ? "ja" : "ja";
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
/** @param {Work} w */
function badgeHtml(w) {
  return `<div class="badge" style="--c:${w.c}">${w.initials}</div>`;
}

/**
 * dl-stats から取得した合計値のキャッシュ。
 * 同一セッション内で言語切替時に再 fetch しないため。
 * @type {{ cumulativeInstalls: number, totalStars: number } | null}
 */
let dlStatsCache = null;

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
    `<polyline points="${points}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

/**
 * 単純なプレースホルダ置換（`{key}` 形式）。
 * @param {string} template
 * @param {Record<string, string | number>} vars
 */
function fillTemplate(template, vars) {
  return template.replace(/\{(\w+)\}/g, (m, key) => {
    const v = vars[key];
    return v === undefined || v === null ? m : String(v);
  });
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
  if (w.stars > 0) parts.push(`<span class="star">★ ${w.stars}</span>`);
  if (w.dl && typeof w.dl.releases === "number") {
    parts.push(`<span class="dl" aria-label="${t("card.dl.aria", lang)}"><span class="arrow">↓</span> ${w.dl.releases}</span>`);
  }
  if (w.dl && typeof w.dl.npm30d === "number") {
    parts.push(`<span class="dl npm" aria-label="${t("card.npm.aria", lang)}"><span class="arrow">↻</span> ${w.dl.npm30d} 30d</span>`);
  }
  const meta = parts.join(`<span class="sep">·</span>`);
  const metaHtml = `<div class="meta">${meta}</div>`;
  const spark = sparklineSvg(w.dl?.sparkReleases, w.c);
  const sparkHtml = spark ? `<div class="spark">${spark}</div>` : "";
  return { metaHtml, sparkHtml };
}

/** @param {Lang} lang */
function renderWorks(lang) {
  const grid = document.getElementById("works-grid");
  if (!grid) return;
  grid.innerHTML = "";
  WORKS.forEach((w, i) => {
    const a = document.createElement("a");
    a.className = "card reveal";
    a.href = `work.html?id=${encodeURIComponent(w.id)}`;
    a.style.setProperty("--c", w.c);
    a.style.animationDelay = i * 0.06 + "s";
    const { metaHtml, sparkHtml } = renderWorkStats(w, lang);
    a.innerHTML =
      badgeHtml(w) +
      `<div class="cat">${w.cat[lang]}</div>` +
      `<h3>${w.id}</h3>` +
      `<p>${w.short[lang]}</p>` +
      metaHtml +
      sparkHtml +
      `<span class="go">${t("card.go", lang)} <span class="arrow">→</span></span>`;
    grid.appendChild(a);
  });
  // dl-stats ダッシュボードへの直リンク CTA カード（詳細ページではなく稼働中ダッシュボードを新タブで開く）
  const cta = document.createElement("a");
  cta.className = "card card-cta reveal";
  cta.href = "https://dl-stats.ishizakahiroshi.workers.dev";
  cta.target = "_blank";
  cta.rel = "noopener";
  cta.style.setProperty("--c", "#ff7a3d");
  cta.style.animationDelay = WORKS.length * 0.06 + "s";
  cta.setAttribute("aria-label", t("cta.stats.title", lang));
  const ctaDesc = dlStatsCache
    ? fillTemplate(t("cta.stats.descLive", lang), {
        dl: dlStatsCache.cumulativeInstalls.toLocaleString(lang === "ja" ? "ja-JP" : "en-US"),
        stars: dlStatsCache.totalStars,
      })
    : t("cta.stats.desc", lang);
  cta.innerHTML =
    `<div class="badge" style="--c:#ff7a3d">DL</div>` +
    `<div class="cat">${t("cta.stats.cat", lang)}</div>` +
    `<h3>${t("cta.stats.title", lang)}</h3>` +
    `<p>${ctaDesc}</p>` +
    `<div class="meta"></div>` +
    `<span class="go">${t("cta.stats.go", lang)} <span class="arrow">→</span></span>`;
  grid.appendChild(cta);
}

/** @param {Lang} lang */
function renderExperience(lang) {
  const list = document.getElementById("exp-list");
  if (!list) return;
  list.innerHTML = "";
  EXPERIENCE.forEach((e) => {
    const div = document.createElement("div");
    div.className = "exp";
    const tag = e.current ? `<span class="tag-current">${t("exp.current", lang)}</span>` : "";
    div.innerHTML =
      `<div class="role">${e.role[lang]}${tag}</div>` +
      `<div class="org">${e.org[lang]}</div>` +
      `<p>${e.desc[lang]}</p>`;
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
    div.innerHTML = `<h4>${c.title[lang]}</h4><p>${c.desc[lang]}</p>`;
    grid.appendChild(div);
  });
  const chips = document.getElementById("stack-chips");
  if (chips) {
    chips.innerHTML = SKILLS.map((tier) => {
      const cls = tier.highlight ? "skill-tier hot" : "skill-tier";
      const items = tier.items.map((s) => `<span class="chip">${s}</span>`).join("");
      return `<div class="${cls}"><span class="ylabel">${tier.years[lang]}</span><div class="schips">${items}</div></div>`;
    }).join("");
  }
}

/** @param {Lang} lang */
function renderStats(lang) {
  const el = document.getElementById("stats");
  if (!el) return;
  el.innerHTML = STATS.map((s) =>
    `<div class="stat"><div class="snum">${s.num}<span class="sunit">${s.unit[lang]}</span></div><div class="slabel">${s.label[lang]}</div></div>`
  ).join("");
}

/** @type {LatestNote | null} */
let latestNote = null;
/** @type {"loading" | "ready" | "error"} */
let latestNoteState = "loading";

/**
 * @param {string} value
 * @param {"note" | "image"} kind
 * @returns {string | null}
 */
function safeLatestUrl(value, kind) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    if (kind === "note" && url.hostname !== "note.com") return null;
    return url.href;
  } catch {
    return null;
  }
}

/** @param {Lang} lang */
function renderLatestNote(lang) {
  const root = document.getElementById("latest-note-card");
  if (!root) return;
  root.replaceChildren();

  if (latestNoteState === "loading") {
    const loading = document.createElement("p");
    loading.textContent = t("latest.loading", lang);
    root.appendChild(loading);
    return;
  }

  const articleUrl = latestNote ? safeLatestUrl(latestNote.url, "note") : null;
  const published = latestNote ? new Date(latestNote.publishedAt) : null;
  if (!latestNote || !articleUrl || !published || Number.isNaN(published.getTime())) {
    const message = document.createElement("p");
    message.className = "latest-fallback";
    message.textContent = t("latest.noteFallback", lang);
    const link = document.createElement("a");
    link.className = "latest-profile-link";
    link.href = PROFILE.note;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = `${t("latest.noteProfile", lang)} →`;
    root.append(message, link);
    return;
  }

  const imageUrl = safeLatestUrl(latestNote.imageUrl, "image");
  if (imageUrl) {
    const image = document.createElement("img");
    image.className = "latest-note-image";
    image.src = imageUrl;
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    root.appendChild(image);
  }

  const date = document.createElement("time");
  date.className = "latest-date";
  date.dateTime = latestNote.publishedAt;
  date.textContent = new Intl.DateTimeFormat(lang === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(published);

  const title = document.createElement("h3");
  title.textContent = latestNote.title;
  root.append(date, title);

  if (latestNote.description) {
    const description = document.createElement("p");
    description.className = "latest-description";
    description.textContent = latestNote.description;
    root.appendChild(description);
  }

  const link = document.createElement("a");
  link.className = "latest-profile-link";
  link.href = articleUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = `${t("latest.readNote", lang)} →`;
  root.appendChild(link);
}

async function loadLatestNote() {
  try {
    const response = await fetch("assets/latest-note.json", { cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = /** @type {LatestNote} */ (await response.json());
    if (!data || typeof data.title !== "string" || typeof data.url !== "string" ||
        typeof data.publishedAt !== "string" || typeof data.description !== "string" ||
        typeof data.imageUrl !== "string") {
      throw new Error("Invalid latest-note.json");
    }
    latestNote = data;
    latestNoteState = "ready";
  } catch (error) {
    console.warn("Latest note could not be loaded.", error);
    latestNote = null;
    latestNoteState = "error";
  }
  renderLatestNote(getLang());
}

/**
 * @typedef {Object} ArticleLinks
 * @property {string} [zenn]
 * @property {string} [note]
 * @property {string} [qiita]
 * @property {string} [html]
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

/** @param {Lang} lang */
function renderArticles(lang) {
  const root = document.getElementById("articles-list");
  if (!root) return;
  root.replaceChildren();

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

  for (const a of articlesList) {
    const row = document.createElement("article");
    row.className = "article-row";

    const date = document.createElement("time");
    date.className = "article-date";
    date.dateTime = a.date;
    date.textContent = a.date;
    row.appendChild(date);

    const thumb = document.createElement("div");
    thumb.className = "article-thumb" + (a.hero ? "" : " empty");
    if (a.hero) {
      const img = document.createElement("img");
      img.src = a.hero;
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      thumb.appendChild(img);
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
      titleLink.href = primary;
      if (!primary.startsWith("articles/")) {
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
    const order = /** @type {const} */ (["zenn", "note", "qiita", "html"]);
    const labels = { zenn: "Zenn", note: "note", qiita: "Qiita", html: lang === "ja" ? "HTML 版" : "HTML" };
    for (const key of order) {
      const url = a.links[key];
      if (!url) continue;
      const pill = document.createElement("a");
      pill.className = `lpill lpill-${key}`;
      pill.href = url;
      if (!url.startsWith("articles/")) {
        pill.target = "_blank";
        pill.rel = "noopener noreferrer";
      }
      pill.innerHTML = `${labels[key]} <span aria-hidden="true">▶</span>`;
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
}

async function loadArticles() {
  try {
    const response = await fetch("assets/articles.json", { cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!data || !Array.isArray(data.articles)) {
      throw new Error("Invalid articles.json");
    }
    articlesList = data.articles.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
    articlesState = "ready";
  } catch (error) {
    console.warn("Articles could not be loaded.", error);
    articlesList = [];
    articlesState = "error";
  }
  renderArticles(getLang());
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
    // 合計値を CTA カードの動的文言用にキャッシュ
    if (typeof data.cumulativeInstalls === "number" && typeof data.totals?.stars === "number") {
      dlStatsCache = {
        cumulativeInstalls: data.cumulativeInstalls,
        totalStars: data.totals.stars,
      };
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
    renderDetail(lang);
  } catch (e) {
    console.warn("dl-stats fetch failed", e);
  }
}

/** @param {Lang} lang */
function renderContact(lang) {
  const list = document.getElementById("welcome-list");
  if (list) {
    list.innerHTML = CONTACT_WELCOME.map((w) => `<li>${w[lang]}</li>`).join("");
  }
  const x = /** @type {HTMLAnchorElement | null} */ (document.getElementById("c-x"));
  const note = /** @type {HTMLAnchorElement | null} */ (document.getElementById("c-note"));
  const gh = /** @type {HTMLAnchorElement | null} */ (document.getElementById("c-github"));
  if (x) { x.href = PROFILE.x; /** @type {HTMLElement} */ (x.querySelector(".t")).textContent = t("contact.x", lang); }
  if (note) { note.href = PROFILE.note; /** @type {HTMLElement} */ (note.querySelector(".t")).textContent = t("contact.note", lang); }
  if (gh) { gh.href = PROFILE.github; /** @type {HTMLElement} */ (gh.querySelector(".t")).textContent = t("contact.github", lang); }

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
    div.innerHTML = `<span class="fe">${p.emoji}</span><span>${p[lang]}</span>`;
    grid.appendChild(div);
  });
}

/** @param {Lang} lang */
function renderDetail(lang) {
  const root = document.getElementById("detail-root");
  if (!root) return;
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const w = WORKS.find((x) => x.id === id);
  if (!w) {
    root.innerHTML = `<p>${t("detail.notfound", lang)}</p>`;
    document.title = PROFILE.nameEn;
    return;
  }
  document.title = `${w.id} — ${PROFILE.nameEn}`;
  root.style.setProperty("--c", w.c);
  const { metaHtml, sparkHtml } = renderWorkStats(w, lang);
  root.innerHTML =
    `<div class="detail-head" style="--c:${w.c}">` +
    badgeHtml(w) +
    `<div><div class="cat">${w.cat[lang]}</div><h1>${w.id}</h1>${metaHtml}${sparkHtml}</div>` +
    `</div>` +
    `<div class="detail-body" style="--c:${w.c}">` +
    `<h2>${t("detail.overview", lang)}</h2><p>${w.long[lang]}</p>` +
    `<h2>${t("detail.tech", lang)}</h2><div class="tech-tags">${w.tech.map((x) => `<span class="chip">${x}</span>`).join("")}</div>` +
    `<div class="detail-cta"><a class="btn primary" href="${w.repo}" target="_blank" rel="noopener">${t("detail.viewRepo", lang)} <span class="arrow">→</span></a>` +
    (w.store ? `<a class="btn ghost" href="${w.store}" target="_blank" rel="noopener">${t("detail.viewStore", lang)} <span class="arrow">→</span></a>` : "") +
    (w.live ? `<a class="btn ghost" href="${w.live}" target="_blank" rel="noopener">${t("detail.viewLive", lang)} <span class="arrow">→</span></a>` : "") +
    `</div>` +
    `</div>`;
}
