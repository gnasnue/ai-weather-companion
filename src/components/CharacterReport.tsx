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

const Character = ({ gender }: { gender: Gender }) => {
  const isFemale = gender === "female";
  const hairColor = "hsl(25 45% 25%)";
  const skinColor = "hsl(30 60% 88%)";
  const shirtColor = isFemale ? "hsl(340 70% 80%)" : "hsl(200 65% 70%)";
  const pantsColor = isFemale ? "hsl(340 50% 60%)" : "hsl(220 45% 40%)";

  return (
    <svg
      viewBox="0 0 120 200"
      className="h-full w-auto"
      aria-label={isFemale ? "여아 캐릭터" : "남아 캐릭터"}
    >
      {/* Hair back (female longer) */}
      {isFemale && (
        <ellipse cx="60" cy="42" rx="26" ry="30" fill={hairColor} />
      )}
      {/* Head */}
      <circle cx="60" cy="40" r="22" fill={skinColor} />
      {/* Hair top */}
      {isFemale ? (
        <>
          <path
            d="M38 38 Q40 18 60 18 Q80 18 82 38 Q78 28 60 28 Q42 28 38 38 Z"
            fill={hairColor}
          />
          {/* pigtails */}
          <circle cx="34" cy="46" r="6" fill={hairColor} />
          <circle cx="86" cy="46" r="6" fill={hairColor} />
        </>
      ) : (
        <path
          d="M38 36 Q42 20 60 20 Q78 20 82 36 Q74 30 60 30 Q46 30 38 36 Z"
          fill={hairColor}
        />
      )}
      {/* Eyes */}
      <circle cx="52" cy="42" r="2" fill="hsl(0 0% 13%)" />
      <circle cx="68" cy="42" r="2" fill="hsl(0 0% 13%)" />
      {/* Cheeks */}
      <circle cx="48" cy="48" r="2.5" fill="hsl(0 70% 85%)" opacity="0.7" />
      <circle cx="72" cy="48" r="2.5" fill="hsl(0 70% 85%)" opacity="0.7" />
      {/* Smile */}
      <path
        d="M55 50 Q60 54 65 50"
        stroke="hsl(0 0% 13%)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Neck */}
      <rect x="55" y="60" width="10" height="8" fill={skinColor} />
      {/* Body / shirt */}
      <path
        d="M35 70 Q40 68 60 68 Q80 68 85 70 L88 115 Q60 120 32 115 Z"
        fill={shirtColor}
      />
      {/* Arms */}
      <rect x="28" y="72" width="9" height="40" rx="4" fill={shirtColor} />
      <rect x="83" y="72" width="9" height="40" rx="4" fill={shirtColor} />
      {/* Hands */}
      <circle cx="32" cy="115" r="5" fill={skinColor} />
      <circle cx="88" cy="115" r="5" fill={skinColor} />
      {/* Pants/Skirt */}
      {isFemale ? (
        <path d="M35 115 L28 160 L60 162 L92 160 L85 115 Z" fill={pantsColor} />
      ) : (
        <path
          d="M38 115 L34 160 L52 162 L58 120 L62 120 L68 162 L86 160 L82 115 Z"
          fill={pantsColor}
        />
      )}
      {/* Legs */}
      <rect x="44" y="160" width="12" height="22" fill={skinColor} />
      <rect x="64" y="160" width="12" height="22" fill={skinColor} />
      {/* Shoes */}
      <ellipse cx="50" cy="185" rx="9" ry="4" fill="hsl(0 0% 25%)" />
      <ellipse cx="70" cy="185" rx="9" ry="4" fill="hsl(0 0% 25%)" />
    </svg>
  );
};

// Position of each callout's anchor point on the character (in % of container)
const anchors: Record<Callout["zone"], { x: number; y: number }> = {
  head: { x: 50, y: 18 },
  neck: { x: 50, y: 33 },
  skin: { x: 38, y: 50 },
  outfit: { x: 62, y: 55 },
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
          {childName}이를 위한 한눈 리포트
        </h2>
        <span className="text-xs text-muted-foreground">탭하면 자세히 →</span>
      </div>

      <div className="mt-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
        <div className="relative mx-auto h-[320px] w-full max-w-[340px]">
          {/* Character centered */}
          <div className="absolute left-1/2 top-1/2 h-[280px] -translate-x-1/2 -translate-y-1/2">
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
              // line endpoints near the box positions
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
