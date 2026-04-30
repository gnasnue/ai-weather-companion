import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";
import { toast } from "sonner";
import { ChildProfile, loadProfiles } from "@/lib/profile";
import { withSubjectSuffix } from "@/lib/korean";

const navItems = [
  { icon: "🏠", label: "홈", to: "/home" },
  { icon: "📊", label: "환경정보", to: "/env" },
  { icon: "👕", label: "옷차림", to: "/outfit" },
  { icon: "💊", label: "건강팁", to: "/tips" },
  { icon: "👤", label: "마이", to: "/me" },
];

const outfit = {
  temp: 18,
  feels: 16,
  desc: "선선해요. 얇은 겉옷이 필요해요.",
  items: [
    { emoji: "👕", name: "긴팔 티셔츠" },
    { emoji: "🧥", name: "얇은 가디건" },
    { emoji: "👖", name: "면바지" },
    { emoji: "🧣", name: "목수건 (오후 바람)" },
    { emoji: "🧦", name: "발목 양말" },
  ],
  avoid: ["반팔만 입기", "두꺼운 패딩"],
};

const Outfit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profiles] = useState<ChildProfile[]>(() => loadProfiles());
  const activeId = (() => {
    try {
      return localStorage.getItem("aiweather:activeProfileId") || profiles[0]?.id;
    } catch {
      return profiles[0]?.id;
    }
  })();
  const cur = profiles.find((p) => p.id === activeId) ?? profiles[0];

  return (
    <div className="page-shell">
      <div className="page-frame pb-24 animate-fade-in">
        <header className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur-md">
          <div className="container-mobile flex h-14 items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(-1)}
                className="rounded-full p-2 text-foreground hover:bg-muted"
                aria-label="뒤로가기"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <Logo />
            </div>
          </div>
        </header>

        <main className="container-mobile pt-5">
          <h1 className="text-xl font-bold tracking-tight">옷차림</h1>
          {cur && (
            <p className="mt-1 text-xs text-muted-foreground">
              {withSubjectSuffix(cur.name)} 위한 오늘의 추천 코디
            </p>
          )}

          {/* Hero */}
          <section className="mt-4 rounded-2xl bg-gradient-warm p-5 shadow-soft">
            <p className="text-xs font-medium text-accent">현재 기온</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-foreground">{outfit.temp}°</span>
              <span className="text-sm text-muted-foreground">체감 {outfit.feels}°</span>
            </div>
            <p className="mt-2 text-sm text-foreground">{outfit.desc}</p>
          </section>

          {/* Recommended items */}
          <section className="mt-6">
            <h2 className="text-base font-bold tracking-tight">추천 아이템</h2>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {outfit.items.map((it) => (
                <div
                  key={it.name}
                  className="flex items-center gap-2.5 rounded-2xl border border-border bg-card p-3 shadow-soft"
                >
                  <span className="text-2xl">{it.emoji}</span>
                  <span className="text-sm font-medium text-foreground">{it.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Avoid */}
          <section className="mt-6">
            <h2 className="text-base font-bold tracking-tight">피해주세요</h2>
            <ul className="mt-3 space-y-2">
              {outfit.avoid.map((a) => (
                <li
                  key={a}
                  className="flex items-center gap-2 rounded-xl border border-accent/20 bg-accent/5 px-3 py-2.5 text-sm text-foreground"
                >
                  <span>⚠️</span>
                  {a}
                </li>
              ))}
            </ul>
          </section>

          {/* Placeholder */}
          <section className="mt-6 rounded-2xl border border-dashed border-border bg-card p-5 text-center">
            <p className="text-2xl">🚧</p>
            <p className="mt-2 text-sm font-semibold text-foreground">
              상세 코디 기능은 준비 중이에요
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              레이어드 추천, 시간대별 코디, 저장 기능이 곧 추가됩니다.
            </p>
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
                        isActive
                          ? "font-semibold text-accent"
                          : "text-muted-foreground hover:text-foreground"
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

export default Outfit;
