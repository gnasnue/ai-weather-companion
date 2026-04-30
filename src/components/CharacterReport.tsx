import { withSubjectSuffix } from "@/lib/korean";

type Gender = "male" | "female" | "unknown";

type Callout = {
  id: string;
  zone: "face" | "neck" | "skin" | "outfit";
  title: string;
  desc: string;
  emoji: string;
  tone: "warn" | "ok";
};

const calloutsData: Callout[] = [
  {
    id: "face",
    zone: "face",
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

// 신체 부위 앵커 좌표 (SVG viewBox 340x420 기준, px)
const anchors: Record<Callout["zone"], { x: number; y: number }> = {
  face:   { x: 185, y: 108 }, // 얼굴 입 주변
  neck:   { x: 155, y: 168 }, // 목 부위
  skin:   { x: 118, y: 255 }, // 왼팔/손목
  outfit: { x: 218, y: 230 }, // 상의 오른쪽
};

// 콜아웃 박스 끝점 좌표 (SVG viewBox 340x420 기준, px)
const lineEnds: Record<Callout["zone"], { x: number; y: number }> = {
  face:   { x: 272, y: 88 },
  neck:   { x: 72,  y: 185 },
  skin:   { x: 68,  y: 290 },
  outfit: { x: 272, y: 258 },
};

// 콜아웃 박스 CSS 위치
const boxPositions: Record<Callout["zone"], string> = {
  face:   "top-[12%] right-0",
  neck:   "top-[36%] left-0",
  skin:   "top-[60%] left-0",
  outfit: "top-[54%] right-0",
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
        <div className="relative mx-auto h-[420px] w-full max-w-[340px]">

          {/* 캐릭터 이미지 */}
          <div className="absolute left-1/2 top-1/2 h-[380px] -translate-x-1/2 -translate-y-1/2">
            <Character gender={gender} />
          </div>

          {/* SVG 커넥터 라인 */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 340 420"
            preserveAspectRatio="none"
          >
            {calloutsData.map((c) => {
              const a = anchors[c.zone];
              const e = lineEnds[c.zone];
              return (
                <g key={c.id}>
                  <line
                    x1={a.x} y1={a.y}
                    x2={e.x} y2={e.y}
                    stroke="#D3D1C7"
                    strokeWidth="0.8"
                    strokeDasharray="3,2"
                    vectorEffect="non-scaling-stroke"
                  />
                  <circle
                    cx={a.x} cy={a.y} r="3"
                    fill="white"
                    stroke="#B4B2A9"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              );
            })}
          </svg>

          {/* 콜아웃 박스 */}
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
