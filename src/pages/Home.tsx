import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, Settings, MapPin, ChevronDown, Check } from "lucide-react";
import Logo from "@/components/Logo";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import CharacterReport from "@/components/CharacterReport";
import { withSubjectSuffix } from "@/lib/korean";
import { ChildProfile, loadProfiles } from "@/lib/profile";

const badges = [
  { label: "미세먼지", value: "보통", tone: "ok" as const },
  { label: "꽃가루", value: "높음", tone: "warn" as const },
  { label: "자외선", value: "보통", tone: "ok" as const },
  { label: "습도", value: "낮음", tone: "ok" as const },
  { label: "바람", value: "강함", tone: "warn" as const },
];

const baseChecklist = [
  { icon: "👕", text: "긴팔 + 얇은 가디건", key: "가디건" },
  { icon: "🧣", text: "목수건 (오후 바람 강함)", key: "목수건" },
  { icon: "😷", text: "마스크 (꽃가루 주의)", key: "마스크" },
  { icon: "💧", text: "보습제 (건조 주의)", key: "보습제" },
];

const timeline = [
  { time: "등원시간", hour: "08:00", icon: "⛅", temp: 12, feels: 10, dust: "보통", uv: "낮음", pollen: "높음", humidity: 45, wind: "약함" },
  { time: "야외활동", hour: "11:00", icon: "☀️", temp: 18, feels: 17, dust: "보통", uv: "보통", pollen: "높음", humidity: 38, wind: "보통" },
  { time: "하원시간", hour: "15:00", icon: "🌤️", temp: 21, feels: 20, dust: "나쁨", uv: "강함", pollen: "매우높음", humidity: 35, wind: "강함" },
  { time: "저녁", hour: "18:00", icon: "🌥️", temp: 16, feels: 14, dust: "보통", uv: "낮음", pollen: "보통", humidity: 50, wind: "강함" },
];

const items = [
  { emoji: "🧣", name: "유아 면 목수건", price: "9,900원" },
  { emoji: "😷", name: "키즈 KF94 마스크", price: "12,500원" },
  { emoji: "🧴", name: "민감 피부 보습로션", price: "18,000원" },
  { emoji: "🧥", name: "얇은 가디건", price: "29,900원" },
];

const toneStyle = (t: "ok" | "warn") =>
  t === "warn"
    ? "bg-accent/10 text-accent border-accent/20"
    : "bg-muted text-foreground border-border";

// Render text with:
//   __word__  → environment keyword (red/accent + bold)
//   **word**  → recommended item (black + bold)
const renderRich = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*|__[^_]+__)/g);
  return parts.map((p, i) => {
    if (/^__[^_]+__$/.test(p)) {
      return (
        <b key={i} className="font-bold text-accent">
          {p.slice(2, -2)}
        </b>
      );
    }
    if (/^\*\*[^*]+\*\*$/.test(p)) {
      return (
        <b key={i} className="font-bold text-foreground">
          {p.slice(2, -2)}
        </b>
      );
    }
    return <span key={i}>{p}</span>;
  });
};

const aiMessage = (name: string) =>
  `${name}는 오늘 __꽃가루 많음__이고 오후엔 __바람 강함__이에요. 비염이 있으니 **마스크**와 **목수건**을 꼭 챙겨주세요. __건조함__에 대비해 **보습제**도 발라주세요.`;

const navItems = [
  { icon: "🏠", label: "홈", to: "/home" },
  { icon: "📊", label: "환경정보", to: "/env" },
  { icon: "👕", label: "옷차림", to: "/outfit" },
  { icon: "💊", label: "건강팁", to: "/tips" },
  { icon: "👤", label: "마이", to: "/me" },
];

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profiles, setProfiles] = useState<ChildProfile[]>(() => loadProfiles());
  const [active, setActive] = useState<string>(() => {
    try {
      return localStorage.getItem("aiweather:activeProfileId") || loadProfiles()[0].id;
    } catch {
      return loadProfiles()[0].id;
    }
  });
  const [checked, setChecked] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // Refresh profiles when returning from onboarding
  useEffect(() => {
    const list = loadProfiles();
    setProfiles(list);
    if (!list.find((p) => p.id === active)) {
      setActive(list[0].id);
    }
  }, [location.key]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist active profile
  useEffect(() => {
    try { localStorage.setItem("aiweather:activeProfileId", active); } catch {}
  }, [active]);

  const cur = profiles.find((p) => p.id === active) ?? profiles[0];
  const allDone = checked.length === baseChecklist.length;

  // simulate initial loading
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  // Reset checklist when profile changes
  useEffect(() => setChecked([]), [active]);

  const message = useMemo(() => aiMessage(cur.name), [cur.name]);

  const toggle = (i: number) =>
    setChecked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));

  return (
    <div className="page-shell">
      <div className="page-frame pb-24 animate-fade-in">
        {/* Top nav */}
        <header className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur-md">
          <div className="container-mobile flex h-14 items-center justify-between">
            <Logo />
            <div className="flex items-center gap-1">
              <button
                onClick={() => toast("새 알림이 없어요")}
                className="relative rounded-full p-2 text-foreground hover:bg-muted"
                aria-label="알림"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
              </button>
              <button
                onClick={() => toast("설정 페이지는 준비 중이에요")}
                className="rounded-full p-2 text-foreground hover:bg-muted"
                aria-label="설정"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        <main className="container-mobile pt-5">
          {/* Profile tabs */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {profiles.map((p) => (
              <button
                key={p.id}
                onClick={() => setActive(p.id)}
                className={`flex shrink-0 items-center gap-2 rounded-full border-2 px-3.5 py-1.5 text-sm transition-smooth ${
                  active === p.id
                    ? "border-primary bg-secondary text-foreground"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                <span>{p.emoji}</span>
                <span className="font-medium">{p.name}</span>
                <span className="text-xs text-muted-foreground">{p.age}</span>
              </button>
            ))}
            <button
              onClick={() => navigate("/onboarding")}
              className="shrink-0 rounded-full border-2 border-dashed border-border px-3.5 py-1.5 text-sm text-muted-foreground hover:border-primary hover:text-foreground"
            >
              + 추가
            </button>
          </div>

          {/* Location */}
          <button
            onClick={() => toast("위치 변경은 준비 중이에요")}
            className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <MapPin className="h-4 w-4" />
            <span>서울 강남구</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>

          {/* AI message card */}
          {loading ? (
            <section className="mt-4 rounded-2xl bg-secondary p-5 shadow-soft">
              <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-16 rounded-full" />
                ))}
              </div>
              <Skeleton className="mt-4 h-32 w-full rounded-xl" />
            </section>
          ) : (
            <section className="mt-4 rounded-2xl bg-secondary p-5 shadow-soft animate-fade-up">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background text-xl">
                  🌤️
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-accent">AI 리포트 · 오늘 아침</p>
                  <p className="mt-1 leading-relaxed text-foreground">
                    {renderRich(message)}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {badges.map((b) => (
                  <span
                    key={b.label}
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium ${toneStyle(b.tone)}`}
                  >
                    {b.label} · {b.value}
                  </span>
                ))}
              </div>

              <div className="mt-4 rounded-xl bg-background/70 p-3">
                <div className="flex items-center justify-between px-1">
                  <p className="text-xs font-semibold text-muted-foreground">오늘 챙길 것</p>
                  {allDone && (
                    <p className="text-xs font-semibold text-accent animate-fade-in">준비 끝! ✓</p>
                  )}
                </div>
                <ul className="mt-1 divide-y divide-border/60">
                  {baseChecklist.map((c, i) => {
                    const on = checked.includes(i);
                    return (
                      <li key={i}>
                        <button
                          onClick={() => toggle(i)}
                          className="flex w-full items-center gap-3 px-1 py-2.5 text-left"
                        >
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-smooth ${
                              on
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-background"
                            }`}
                          >
                            {on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                          </span>
                          <span className="text-lg">{c.icon}</span>
                          <span className={`flex-1 text-sm ${on ? "text-muted-foreground line-through" : "text-foreground"}`}>
                            {c.text}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>
          )}

          {/* Timeline */}
          <section className="mt-7">
            <div className="flex items-baseline justify-between">
              <h2 className="text-base font-bold tracking-tight">시간대별 환경</h2>
              <span className="text-xs text-muted-foreground">가로로 스크롤 →</span>
            </div>
            <div className="mt-3 -mx-5 flex flex-nowrap gap-3 overflow-x-auto overflow-y-hidden px-5 pb-2 scrollbar-hide [-webkit-overflow-scrolling:touch]">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-44 w-[150px] shrink-0 rounded-2xl" />
                  ))
                : timeline.map((t) => (
                    <article
                      key={t.time}
                      className="w-[150px] shrink-0 rounded-2xl border border-border bg-card p-4 shadow-soft"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold">{t.time}</p>
                          <p className="text-xs text-muted-foreground">{t.hour}</p>
                        </div>
                        <span className="text-3xl">{t.icon}</span>
                      </div>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-2xl font-bold">{t.temp}°</span>
                        <span className="text-xs text-muted-foreground">체감 {t.feels}°</span>
                      </div>
                      <dl className="mt-3 space-y-1 text-xs">
                        {([
                          ["미세먼지", t.dust, ["나쁨", "매우나쁨"].includes(t.dust)],
                          ["자외선", t.uv, ["강함", "매우강함"].includes(t.uv)],
                          ["꽃가루", t.pollen, ["높음", "매우높음"].includes(t.pollen)],
                          ["습도", `${t.humidity}%`, t.humidity <= 40],
                          ["바람", t.wind, t.wind === "강함"],
                        ] as [string, string, boolean][]).map(([k, v, bad]) => (
                          <div key={k} className="flex items-center justify-between">
                            <dt className="text-muted-foreground">{k}</dt>
                            <dd
                              className={
                                bad
                                  ? "font-bold text-accent"
                                  : "font-medium text-foreground"
                              }
                            >
                              {v}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </article>
                  ))}
            </div>
          </section>

          {/* Character-based personalized report */}
          {!loading && (
            <CharacterReport gender={cur.gender} childName={cur.name} />
          )}

          {/* Recommended items */}
          <section className="mt-7">
            <h2 className="text-base font-bold tracking-tight">
              {withSubjectSuffix(cur.name)} 위한 오늘의 추천 아이템
            </h2>
            <div className="mt-3 -mx-5 flex flex-nowrap gap-3 overflow-x-auto overflow-y-hidden px-5 pb-2 scrollbar-hide [-webkit-overflow-scrolling:touch]">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-44 w-[130px] shrink-0 rounded-2xl" />
                  ))
                : items.map((it) => (
                    <button
                      key={it.name}
                      onClick={() => toast("외부 구매 페이지로 이동합니다")}
                      className="w-[130px] shrink-0 rounded-2xl border border-border bg-card p-3 text-left shadow-soft transition-smooth hover:border-primary"
                    >
                      <div className="flex h-24 items-center justify-center rounded-xl bg-secondary text-5xl">
                        {it.emoji}
                      </div>
                      <p className="mt-2.5 line-clamp-2 text-sm font-medium leading-snug">{it.name}</p>
                      <p className="mt-1 text-xs font-semibold text-accent">{it.price}</p>
                    </button>
                  ))}
            </div>
          </section>
        </main>

        {/* Bottom nav */}
        <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[390px] -translate-x-1/2 border-t border-border bg-background/95 backdrop-blur-md">
          <div className="container-mobile">
            <ul className="grid grid-cols-5">
              {navItems.map((n) => {
                const isActive = location.pathname === n.to;
                const handleClick = (e: React.MouseEvent) => {
                  if (!["/home", "/me", "/env", "/tips", "/outfit"].includes(n.to)) {
                    e.preventDefault();
                    toast(`${n.label} 페이지는 준비 중이에요`);
                  }
                };
                return (
                  <li key={n.label}>
                    <Link
                      to={n.to}
                      onClick={handleClick}
                      className={`flex flex-col items-center gap-0.5 py-2.5 text-xs transition-smooth ${
                        isActive ? "font-semibold text-accent" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span className="text-lg">{n.icon}</span>
                      {n.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Home;
