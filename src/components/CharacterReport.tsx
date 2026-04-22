import { withSubjectSuffix } from "@/lib/korean";

type Gender = "male" | "female" | "unknown";

type Callout = {
  id: string;
  zone: "head" | "neck" | "skin" | "outfit";
  title: string;
  desc: string;
  emoji: string;
  tone: "warn" | "ok";
};

const calloutsData: Callout[] = [
  {
    id: "head",
    zone: "head",
    title: "꽃가루 많음",
    desc: "마스크 챙기기",
    emoji: "😷",
    tone: "warn",
  },
  {
    id: "neck",
    zone: "neck",
    title: "오후 바람 강함",
    desc: "목수건 챙기기",
    emoji: "🧣",
    tone: "warn",
  },
  {
    id: "skin",
    zone: "skin",
    title: "건조함 주의",
    desc: "보습제 발라주기",
    emoji: "💧",
    tone: "ok",
  },
  {
    id: "outfit",
    zone: "outfit",
    title: "일교차 큼",
    desc: "얇은 가디건",
    emoji: "🧥",
    tone: "ok",
  },
];

// Cute, minimal, friendly child illustration (chibi-style)
const Character = ({ gender }: { gender: Gender }) => {
  const isFemale = gender === "female";
  const skin = "hsl(28 70% 90%)";
  const skinShade = "hsl(28 60% 82%)";
  const hair = "hsl(25 55% 28%)";
  const cheek = "hsl(0 80% 85%)";
  const ink = "hsl(0 0% 18%)";
  const top = isFemale ? "hsl(345 80% 82%)" : "hsl(200 75% 75%)";
  const topShade = isFemale ? "hsl(345 60% 70%)" : "hsl(200 60% 62%)";
  const bottom = isFemale ? "hsl(260 35% 55%)" : "hsl(220 35% 45%)";

  return (
    <svg
      viewBox="0 0 200 240"
      className="h-full w-auto"
      aria-label={isFemale ? "여아 캐릭터" : "남아 캐릭터"}
    >
      {/* Soft ground shadow */}
      <ellipse cx="100" cy="225" rx="55" ry="6" fill={ink} opacity="0.08" />

      {/* Legs */}
      <rect x="80" y="180" width="14" height="32" rx="6" fill={skin} />
      <rect x="106" y="180" width="14" height="32" rx="6" fill={skin} />
      {/* Shoes */}
      <ellipse cx="87" cy="215" rx="12" ry="5" fill={ink} />
      <ellipse cx="113" cy="215" rx="12" ry="5" fill={ink} />

      {/* Body — rounded onesie/dress shape */}
      {isFemale ? (
        <path
          d="M58 130 Q60 118 75 116 L125 116 Q140 118 142 130 L150 188 Q100 200 50 188 Z"
          fill={top}
        />
      ) : (
        <path
          d="M62 130 Q64 118 78 116 L122 116 Q136 118 138 130 L142 188 Q100 196 58 188 Z"
          fill={top}
        />
      )}
      {/* Body shading */}
      <path
        d={
          isFemale
            ? "M58 175 Q100 188 142 175 L144 188 Q100 200 56 188 Z"
            : "M58 178 Q100 188 142 178 L143 188 Q100 196 57 188 Z"
        }
        fill={topShade}
        opacity="0.55"
      />

      {/* Pants peek for boy */}
      {!isFemale && (
        <path d="M70 180 L72 195 L128 195 L130 180 Z" fill={bottom} />
      )}

      {/* Arms */}
      <ellipse cx="55" cy="148" rx="10" ry="22" fill={top} />
      <ellipse cx="145" cy="148" rx="10" ry="22" fill={top} />
      {/* Hands */}
      <circle cx="55" cy="172" r="8" fill={skin} />
      <circle cx="145" cy="172" r="8" fill={skin} />

      {/* Neck */}
      <rect x="92" y="100" width="16" height="14" rx="4" fill={skinShade} />

      {/* Hair back layer (longer for girl) */}
      {isFemale && (
        <path
          d="M44 70 Q44 110 60 122 L72 118 Q56 100 58 70 Z M156 70 Q156 110 140 122 L128 118 Q144 100 142 70 Z"
          fill={hair}
        />
      )}

      {/* Head — large chibi proportions */}
      <ellipse cx="100" cy="68" rx="42" ry="40" fill={skin} />

      {/* Hair top */}
      {isFemale ? (
        <>
          {/* Bangs */}
          <path
            d="M60 60 Q62 28 100 26 Q138 28 140 60 Q132 48 118 50 Q108 38 100 50 Q92 38 82 50 Q68 48 60 60 Z"
            fill={hair}
          />
          {/* Side puffs */}
          <circle cx="54" cy="74" r="10" fill={hair} />
          <circle cx="146" cy="74" r="10" fill={hair} />
          {/* Tiny bow */}
          <circle cx="78" cy="36" r="4" fill="hsl(345 85% 70%)" />
          <circle cx="84" cy="36" r="4" fill="hsl(345 85% 70%)" />
          <circle cx="81" cy="36" r="2" fill="hsl(345 70% 55%)" />
        </>
      ) : (
        <path
          d="M60 62 Q64 30 100 28 Q136 30 140 62 Q130 52 118 54 Q110 44 100 54 Q90 44 82 54 Q70 52 60 62 Z"
          fill={hair}
        />
      )}

      {/* Eyes — big sparkly chibi */}
      <ellipse cx="82" cy="74" rx="6" ry="8" fill={ink} />
      <ellipse cx="118" cy="74" rx="6" ry="8" fill={ink} />
      {/* Eye sparkles */}
      <circle cx="84" cy="71" r="2" fill="white" />
      <circle cx="120" cy="71" r="2" fill="white" />
      <circle cx="80" cy="77" r="1" fill="white" />
      <circle cx="116" cy="77" r="1" fill="white" />

      {/* Cheeks */}
      <ellipse cx="72" cy="86" rx="6" ry="4" fill={cheek} opacity="0.75" />
      <ellipse cx="128" cy="86" rx="6" ry="4" fill={cheek} opacity="0.75" />

      {/* Smile */}
      <path
        d="M93 90 Q100 96 107 90"
        stroke={ink}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
};

// Position of each callout's anchor point on the character (in % of container)
const anchors: Record<Callout["zone"], { x: number; y: number }> = {
  head: { x: 50, y: 18 },
  neck: { x: 50, y: 36 },
  skin: { x: 38, y: 52 },
  outfit: { x: 62, y: 58 },
};

// Position of the callout box itself
const boxPositions: Record<Callout["zone"], string> = {
  head: "top-0 right-0",
  neck: "top-[28%] left-0",
  skin: "top-[48%] left-0",
  outfit: "top-[52%] right-0",
};

const CharacterReport = ({
  gender,
  childName,
}: {
  gender: Gender;
  childName: string;
}) => {
  return (
    <section className="mt-7">
      <div className="flex items-baseline justify-between">
        <h2 className="text-base font-bold tracking-tight">
          {withSubjectSuffix(childName)} 위한 오늘의 종합 솔루션
        </h2>
        <span className="text-xs text-muted-foreground">탭하면 자세히 →</span>
      </div>

      <div className="mt-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
        <div className="relative mx-auto h-[340px] w-full max-w-[340px]">
          {/* Character centered */}
          <div className="absolute left-1/2 top-1/2 h-[300px] -translate-x-1/2 -translate-y-1/2">
            <Character gender={gender} />
          </div>

          {/* SVG connector lines */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {calloutsData.map((c) => {
              const a = anchors[c.zone];
              const ends: Record<Callout["zone"], { x: number; y: number }> = {
                head: { x: 78, y: 8 },
                neck: { x: 22, y: 32 },
                skin: { x: 22, y: 56 },
                outfit: { x: 78, y: 56 },
              };
              const e = ends[c.zone];
              return (
                <line
                  key={c.id}
                  x1={a.x}
                  y1={a.y}
                  x2={e.x}
                  y2={e.y}
                  stroke="hsl(var(--border))"
                  strokeWidth="0.4"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>

          {/* Callouts */}
          {calloutsData.map((c) => (
            <div
              key={c.id}
              className={`absolute ${boxPositions[c.zone]} max-w-[44%] animate-fade-in`}
            >
              <div
                className={`rounded-xl border px-2.5 py-1.5 shadow-soft ${
                  c.tone === "warn"
                    ? "border-accent/30 bg-accent/5"
                    : "border-border bg-background"
                }`}
              >
                <div className="flex items-center gap-1">
                  <span className="text-sm">{c.emoji}</span>
                  <p
                    className={`text-[11px] font-bold leading-tight ${
                      c.tone === "warn" ? "text-accent" : "text-foreground"
                    }`}
                  >
                    {c.title}
                  </p>
                </div>
                <p className="mt-0.5 text-[11px] font-semibold leading-tight text-foreground">
                  {c.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CharacterReport;
