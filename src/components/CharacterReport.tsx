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

// Anchor points on the character (% of container).
// Character image is 380px tall, centered in a 420px container (image y: 4.8%–95.2%).
// Image-internal landmarks (verified by alpha analysis of 280x420 PNG):
//   face center ~24% of image, neck ~45%, torso/arms ~67%, legs/outfit ~83%
// Mapped to container y: containerY = 4.8% + imgY * 90.4%
const anchors: Record<Callout["zone"], { x: number; y: number }> = {
  head: { x: 50, y: 26 },   // face
  neck: { x: 50, y: 46 },   // neck (narrowest point between head & shoulders)
  skin: { x: 50, y: 65 },   // torso / arms
  outfit: { x: 50, y: 80 }, // legs / outfit
};

// Side + vertical position of each callout box (matches anchor y).
const boxLayout: Record<
  Callout["zone"],
  { side: "left" | "right"; top: string }
> = {
  head: { side: "right", top: "22%" },
  neck: { side: "left", top: "44%" },
  skin: { side: "right", top: "63%" },
  outfit: { side: "left", top: "78%" },
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
          {/* Character centered */}
          <div className="absolute left-1/2 top-1/2 h-[380px] -translate-x-1/2 -translate-y-1/2">
            <Character gender={gender} />
          </div>

          {/* SVG connector lines: from character anchor to the inner edge of each box */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {calloutsData.map((c) => {
              const a = anchors[c.zone];
              const layout = boxLayout[c.zone];
              // Box inner edges (matching the 38% width boxes hugging each side)
              // Boxes occupy 0–38% on left side, 62–100% on right side.
              const ex = layout.side === "right" ? 62 : 38;
              // The box uses -translate-y-1/2, so its visual center sits at `top`.
              const ey = parseFloat(layout.top);
              return (
                <line
                  key={c.id}
                  x1={a.x}
                  y1={a.y}
                  x2={ex}
                  y2={ey}
                  stroke="hsl(var(--border))"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>

          {/* Callouts */}
          {calloutsData.map((c) => {
            const layout = boxLayout[c.zone];
            const sideClass =
              layout.side === "right" ? "right-0" : "left-0";
            return (
              <div
                key={c.id}
                className={`absolute ${sideClass} w-[38%] -translate-y-1/2 animate-fade-in`}
                style={{ top: layout.top }}
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
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CharacterReport;
