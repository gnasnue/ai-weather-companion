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

// 기존 Character 컴포넌트 (SVG) 전체 삭제하고 아래로 교체

const Character = ({ gender }: { gender: Gender }) => {
  const src = gender === "female"
    ? "/images/character-girl.png"
    : "/images/character-boy.png";

  return (
    <img
      src={src}
      alt={gender === "female" ? "여아 캐릭터" : "남아 캐릭터"}
      className="h-full w-auto object-contain"
    />
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
