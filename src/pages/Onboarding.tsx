import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  ChildProfile,
  calcAge,
  genderToEmoji,
  koreanGenderToCode,
  saveProfile,
} from "@/lib/profile";

const TOTAL = 7;
const STORAGE_KEY = "aiweather:onboarding";

const conditions = [
  "호흡기 민감 (비염, 천식·기관지)",
  "알레르기 체질 (꽃가루·먼지)",
  "민감 피부 (아토피·건조·자외선)",
  "체온조절 취약 (더위·추위)",
  "해당없음",
  "기타",
];

const sensitivity = [
  { v: "very-much", l: "매우 많이 탐" },
  { v: "much", l: "조금 많이 탐" },
  { v: "normal", l: "보통" },
  { v: "less", l: "조금 덜 탐" },
  { v: "very-less", l: "매우 덜 탐" },
];
const sweatLevels = [
  { v: "very-much", l: "매우 많음" },
  { v: "much", l: "조금 많음" },
  { v: "normal", l: "보통" },
  { v: "less", l: "적은 편" },
];

// time options every 30 min
const halfHour = (from: number, to: number) => {
  const out: string[] = [];
  for (let h = from; h <= to; h++) {
    out.push(`${String(h).padStart(2, "0")}:00`);
    if (h < to) out.push(`${String(h).padStart(2, "0")}:30`);
  }
  return out;
};

type State = {
  name: string;
  year: string;
  month: string;
  day: string;
  gender: string;
  conds: string[];
  condEtc: string;
  cold: string;
  hot: string;
  sweat: string;
  goSchool: string;
  outdoorStart: string;
  outdoorEnd: string;
  leaveSchool: string;
  eveningStart: string;
  eveningEnd: string;
  notif: { night: boolean; morning: boolean; summary: boolean };
  nightTime: string;
  morningBefore: string;
  summaryTime: string;
};

const defaultState: State = {
  name: "",
  year: "",
  month: "",
  day: "",
  gender: "",
  conds: [],
  condEtc: "",
  cold: "",
  hot: "",
  sweat: "",
  goSchool: "",
  outdoorStart: "",
  outdoorEnd: "",
  leaveSchool: "",
  eveningStart: "",
  eveningEnd: "",
  notif: { night: true, morning: true, summary: false },
  nightTime: "21:00",
  morningBefore: "30",
  summaryTime: "20:00",
};

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [s, setS] = useState<State>(defaultState);

  // Resume previous progress
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.s) setS({ ...defaultState, ...parsed.s });
        if (parsed.step) setStep(parsed.step);
      }
    } catch {}
  }, []);

  // Auto save
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ s, step }));
    } catch {}
  }, [s, step]);

  const update = (patch: Partial<State>) => setS((prev) => ({ ...prev, ...patch }));
  const toggleCond = (c: string) =>
    update({ conds: s.conds.includes(c) ? s.conds.filter((x) => x !== c) : [...s.conds, c] });

  const next = () => {
    if (step === 1 && !s.name.trim()) return toast.error("아이 이름을 입력해주세요");
    if (step === 2 && (!s.year || !s.month || !s.day)) return toast.error("생년월일을 모두 선택해주세요");
    if (step === 3 && !s.gender) return toast.error("성별을 선택해주세요");
    if (step === 4 && s.conds.length === 0) return toast.error("하나 이상 선택해주세요 (없으면 '해당없음')");
    if (step === 5 && (!s.cold || !s.hot || !s.sweat)) return toast.error("세 항목 모두 선택해주세요");
    if (step < TOTAL) setStep(step + 1);
    else {
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
      setDone(true);
    }
  };
  const prev = () => (step > 1 ? setStep(step - 1) : navigate(-1));
  const saveLater = () => {
    toast.success("진행 상태가 저장됐어요. 나중에 이어서 할 수 있어요.");
    navigate("/home");
  };

  if (done) {
    return (
      <div className="page-shell">
        <div className="page-frame flex items-center justify-center bg-gradient-warm px-5">
          <div className="w-full text-center animate-scale-in">
            <div className="text-7xl">🎉</div>
            <h1 className="mt-6 text-2xl font-bold tracking-tight">
              {s.name}의 첫 번째<br />날씨 리포트가 준비됐어요!
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              지금 바로 오늘의 리포트를<br />확인해보세요.
            </p>
            <Button
              onClick={() => navigate("/home")}
              size="lg"
              className="mt-8 h-12 w-full bg-primary text-base text-primary-foreground hover:bg-primary-hover shadow-glow"
            >
              오늘 리포트 보러가기 →
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const nm = s.name || "아이";

  const stepNode: Record<number, { q: string; hint?: string; node: React.ReactNode }> = {
    1: {
      q: "안녕하세요! 😊 먼저 아이의 이름을 알려주세요.",
      hint: "별명도 괜찮아요 (예: 지우, 첫째, 우리 아기)",
      node: (
        <Input
          autoFocus
          value={s.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="예) 지우"
          className="h-12 text-center text-lg"
        />
      ),
    },
    2: {
      q: `${nm}는 언제 태어났나요? 🎂`,
      hint: "월령에 따라 적절한 건강 정보가 달라져요",
      node: (
        <div className="grid grid-cols-3 gap-2">
          <Select value={s.year} onValueChange={(v) => update({ year: v })}>
            <SelectTrigger className="h-12"><SelectValue placeholder="년" /></SelectTrigger>
            <SelectContent>
              {Array.from({ length: 10 }).map((_, i) => {
                const y = 2025 - i;
                return <SelectItem key={y} value={String(y)}>{y}년</SelectItem>;
              })}
            </SelectContent>
          </Select>
          <Select value={s.month} onValueChange={(v) => update({ month: v })}>
            <SelectTrigger className="h-12"><SelectValue placeholder="월" /></SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }).map((_, i) => (
                <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}월</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={s.day} onValueChange={(v) => update({ day: v })}>
            <SelectTrigger className="h-12"><SelectValue placeholder="일" /></SelectTrigger>
            <SelectContent>
              {Array.from({ length: 31 }).map((_, i) => (
                <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}일</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ),
    },
    3: {
      q: `${nm}의 성별을 알려주세요 👶`,
      node: (
        <div className="grid grid-cols-3 gap-2">
          {[
            { l: "남아", e: "👦" },
            { l: "여아", e: "👧" },
            { l: "선택 안 함", e: "🙂" },
          ].map((g) => {
            const on = s.gender === g.l;
            return (
              <button
                key={g.l}
                type="button"
                onClick={() => update({ gender: g.l })}
                className={`flex h-20 flex-col items-center justify-center gap-1 rounded-xl border-2 text-xs font-medium transition-smooth ${
                  on
                    ? "border-primary bg-secondary text-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40"
                }`}
              >
                <span className="text-2xl">{g.e}</span>
                {g.l}
              </button>
            );
          })}
        </div>
      ),
    },
    4: {
      q: `${nm}에게 해당되는 것을 모두 선택해주세요 🏥`,
      hint: "해당 항목이 있으면 관련 환경 지표를 더 꼼꼼히 알려드려요",
      node: (
        <div className="space-y-2">
          <div className="space-y-2">
            {conditions.map((c) => {
              const on = s.conds.includes(c);
              return (
                <label
                  key={c}
                  className={`flex min-h-12 cursor-pointer items-center gap-2.5 rounded-xl border-2 px-3.5 py-2.5 transition-smooth ${
                    on ? "border-primary bg-secondary" : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  <Checkbox checked={on} onCheckedChange={() => toggleCond(c)} />
                  <span className="text-sm leading-snug">{c}</span>
                </label>
              );
            })}
          </div>
          {s.conds.includes("기타") && (
            <Input
              value={s.condEtc}
              onChange={(e) => update({ condEtc: e.target.value })}
              placeholder="기타 항목을 입력해주세요"
              className="h-12"
            />
          )}
        </div>
      ),
    },
    5: {
      q: `${nm}는 또래와 비교했을 때 어떤가요? 🌡️`,
      hint: "체온 민감도에 따라 옷차림 추천이 달라져요",
      node: (
        <div className="space-y-3">
          {[
            { label: "추위 민감도", v: s.cold, k: "cold" as const, opts: sensitivity },
            { label: "더위 민감도", v: s.hot, k: "hot" as const, opts: sensitivity },
            { label: "땀 분비", v: s.sweat, k: "sweat" as const, opts: sweatLevels },
          ].map(({ label, v, k, opts }) => (
            <div key={label}>
              <p className="mb-1.5 text-sm text-muted-foreground">{label}</p>
              <Select value={v} onValueChange={(val) => update({ [k]: val } as Partial<State>)}>
                <SelectTrigger className="h-12"><SelectValue placeholder="선택" /></SelectTrigger>
                <SelectContent>
                  {opts.map((o) => (
                    <SelectItem key={o.v} value={o.v}>{o.l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      ),
    },
    6: {
      q: `${nm}의 하루 일과를 알려주시면 더 정확한 리포트를 드려요 ⏰`,
      hint: "선택 항목이에요. 나중에 설정에서도 입력할 수 있어요",
      node: (
        <div className="space-y-3">
          <div>
            <p className="mb-1.5 text-sm text-muted-foreground">🌅 등원 시간</p>
            <Select value={s.goSchool} onValueChange={(v) => update({ goSchool: v })}>
              <SelectTrigger className="h-12"><SelectValue placeholder="시간 선택" /></SelectTrigger>
              <SelectContent>
                {halfHour(7, 10).map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="mb-1.5 text-sm text-muted-foreground">☀️ 야외활동 시간대</p>
            <div className="grid grid-cols-2 gap-2">
              <Select value={s.outdoorStart} onValueChange={(v) => update({ outdoorStart: v })}>
                <SelectTrigger className="h-12"><SelectValue placeholder="시작" /></SelectTrigger>
                <SelectContent>
                  {halfHour(9, 16).map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                </SelectContent>
              </Select>
              <Select value={s.outdoorEnd} onValueChange={(v) => update({ outdoorEnd: v })}>
                <SelectTrigger className="h-12"><SelectValue placeholder="종료" /></SelectTrigger>
                <SelectContent>
                  {halfHour(9, 17).map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-sm text-muted-foreground">🏫 하원 시간</p>
            <Select value={s.leaveSchool} onValueChange={(v) => update({ leaveSchool: v })}>
              <SelectTrigger className="h-12"><SelectValue placeholder="시간 선택" /></SelectTrigger>
              <SelectContent>
                {halfHour(13, 19).map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="mb-1.5 text-sm text-muted-foreground">🌇 저녁 야외활동 시간대</p>
            <div className="grid grid-cols-2 gap-2">
              <Select value={s.eveningStart} onValueChange={(v) => update({ eveningStart: v })}>
                <SelectTrigger className="h-12"><SelectValue placeholder="시작" /></SelectTrigger>
                <SelectContent>
                  {halfHour(16, 20).map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                </SelectContent>
              </Select>
              <Select value={s.eveningEnd} onValueChange={(v) => update({ eveningEnd: v })}>
                <SelectTrigger className="h-12"><SelectValue placeholder="종료" /></SelectTrigger>
                <SelectContent>
                  {halfHour(16, 21).map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setStep(7)}
            className="block w-full pt-1 text-center text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            건너뛰고 나중에 입력할게요
          </button>
        </div>
      ),
    },
    7: {
      q: "언제 알려드릴까요? 🔔",
      hint: "나중에 설정에서 언제든 변경할 수 있어요",
      node: (
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => toast.info("카카오톡 연동은 준비 중이에요")}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-kakao text-sm font-semibold text-kakao-foreground"
          >
            💬 카카오톡 알림 연동
          </button>

          {/* Night */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">🌙 전날 밤 알림</p>
                <p className="text-xs text-muted-foreground">내일 날씨를 미리 알려드려요</p>
              </div>
              <Switch
                checked={s.notif.night}
                onCheckedChange={(v) => update({ notif: { ...s.notif, night: v } })}
              />
            </div>
            {s.notif.night && (
              <div className="mt-3">
                <Select value={s.nightTime} onValueChange={(v) => update({ nightTime: v })}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="시간" /></SelectTrigger>
                  <SelectContent>
                    {halfHour(21, 23).map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Morning */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">🌅 당일 아침 알림</p>
                <p className="text-xs text-muted-foreground">등원 전 옷차림 가이드</p>
              </div>
              <Switch
                checked={s.notif.morning}
                onCheckedChange={(v) => update({ notif: { ...s.notif, morning: v } })}
              />
            </div>
            {s.notif.morning && (
              <div className="mt-3">
                <Select value={s.morningBefore} onValueChange={(v) => update({ morningBefore: v })}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="등원 몇 분 전" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">등원 10분 전</SelectItem>
                    <SelectItem value="20">등원 20분 전</SelectItem>
                    <SelectItem value="30">등원 30분 전</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">📋 하루 요약 알림</p>
                <p className="text-xs text-muted-foreground">저녁에 하루 환경을 정리</p>
              </div>
              <Switch
                checked={s.notif.summary}
                onCheckedChange={(v) => update({ notif: { ...s.notif, summary: v } })}
              />
            </div>
            {s.notif.summary && (
              <div className="mt-3">
                <Select value={s.summaryTime} onValueChange={(v) => update({ summaryTime: v })}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="시간" /></SelectTrigger>
                  <SelectContent>
                    {halfHour(19, 22).map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      ),
    },
  };

  const cur = stepNode[step];

  return (
    <div className="page-shell">
      <div className="page-frame flex flex-col">
        {/* Top bar */}
        <header className="border-b border-border/60">
          <div className="container-mobile flex h-14 items-center justify-between">
            <button onClick={prev} className="-ml-2 rounded-full p-2 text-foreground hover:bg-muted" aria-label="뒤로가기">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button onClick={saveLater} className="text-xs text-muted-foreground hover:text-foreground">
              나중에 이어서 하기
            </button>
          </div>
          <div className="container-mobile pb-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{step} / {TOTAL}</span>
              <span>{Math.round((step / TOTAL) * 100)}%</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${(step / TOTAL) * 100}%` }}
              />
            </div>
          </div>
        </header>

        <main className="container-mobile flex flex-1 flex-col py-6">
          <div key={step} className="animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-xl">
                🌤️
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-secondary px-4 py-3">
                <p className="leading-relaxed text-foreground">{cur.q}</p>
                {cur.hint && <p className="mt-1.5 text-xs text-muted-foreground">{cur.hint}</p>}
              </div>
            </div>
            <div className="mt-7">{cur.node}</div>
          </div>

          <div className="mt-auto pt-8">
            <Button
              onClick={next}
              size="lg"
              className="h-12 w-full bg-primary text-base text-primary-foreground hover:bg-primary-hover shadow-soft"
            >
              {step === TOTAL ? "완료" : "다음"}
            </Button>
            <Link to="/home" className="mt-3 block text-center text-xs text-muted-foreground hover:text-foreground">
              먼저 둘러볼게요
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Onboarding;
