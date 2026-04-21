import { useState } from "react";
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

const TOTAL = 7;

const conditions = ["아토피", "비염", "식품 알러지", "환경 알러지", "천식", "해당없음", "기타"];
const timeSlots = ["등원 (07-09시)", "야외활동 (10-12시)", "하원 (14-16시)", "저녁 활동 (17-19시)"];

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);

  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [gender, setGender] = useState<string>("");
  const [conds, setConds] = useState<string[]>([]);
  const [cold, setCold] = useState("");
  const [hot, setHot] = useState("");
  const [sweat, setSweat] = useState("");
  const [activity, setActivity] = useState<string[]>([]);
  const [notif, setNotif] = useState({ night: true, morning: true, summary: false });

  const next = () => {
    if (step === 1 && !name.trim()) return toast.error("아이 이름을 입력해주세요");
    if (step === 2 && (!year || !month || !day)) return toast.error("생년월일을 모두 선택해주세요");
    if (step === 3 && !gender) return toast.error("성별을 선택해주세요");
    if (step < TOTAL) setStep(step + 1);
    else setDone(true);
  };
  const prev = () => (step > 1 ? setStep(step - 1) : navigate(-1));
  const toggleCond = (c: string) =>
    setConds((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));
  const toggleAct = (c: string) =>
    setActivity((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-warm px-5">
        <div className="container-mobile text-center animate-scale-in">
          <div className="text-7xl">🎉</div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight">
            모든 준비가 끝났어요!
          </h1>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            {name || "우리 아이"}를 위한 첫 번째 환경 리포트를<br />
            지금 확인해보세요.
          </p>
          <Button
            onClick={() => navigate("/home")}
            size="lg"
            className="mt-8 h-12 w-full bg-primary text-primary-foreground hover:bg-primary-hover shadow-glow text-base"
          >
            첫 번째 리포트 보러가기 →
          </Button>
        </div>
      </div>
    );
  }

  const questions: Record<number, { q: string; node: React.ReactNode }> = {
    1: {
      q: "안녕하세요! 우리 아이의 이름은 무엇인가요?",
      node: (
        <Input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예) 지유"
          className="h-12 text-center text-lg"
        />
      ),
    },
    2: {
      q: `${name || "아이"}의 생년월일을 알려주세요`,
      node: (
        <div className="grid grid-cols-3 gap-2">
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="h-12"><SelectValue placeholder="년" /></SelectTrigger>
            <SelectContent>
              {Array.from({ length: 10 }).map((_, i) => {
                const y = 2025 - i;
                return <SelectItem key={y} value={String(y)}>{y}년</SelectItem>;
              })}
            </SelectContent>
          </Select>
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="h-12"><SelectValue placeholder="월" /></SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }).map((_, i) => (
                <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}월</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={day} onValueChange={setDay}>
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
      q: `${name || "아이"}의 성별은 어떻게 되나요?`,
      node: (
        <div className="grid grid-cols-3 gap-2">
          {["남아", "여아", "선택안함"].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGender(g)}
              className={`h-14 rounded-xl border-2 text-sm font-medium transition-smooth ${
                gender === g
                  ? "border-primary bg-secondary text-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      ),
    },
    4: {
      q: "혹시 아이가 가진 질환이 있나요? (복수 선택)",
      node: (
        <div className="grid grid-cols-2 gap-2">
          {conditions.map((c) => (
            <label
              key={c}
              className={`flex h-12 cursor-pointer items-center gap-2 rounded-xl border-2 px-3.5 transition-smooth ${
                conds.includes(c)
                  ? "border-primary bg-secondary"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <Checkbox checked={conds.includes(c)} onCheckedChange={() => toggleCond(c)} />
              <span className="text-sm">{c}</span>
            </label>
          ))}
        </div>
      ),
    },
    5: {
      q: "아이의 온도 민감도는 어떤가요?",
      node: (
        <div className="space-y-3">
          {[
            { label: "추위 민감도", v: cold, set: setCold },
            { label: "더위 민감도", v: hot, set: setHot },
            { label: "땀 분비량", v: sweat, set: setSweat },
          ].map(({ label, v, set }) => (
            <div key={label}>
              <p className="mb-1.5 text-sm text-muted-foreground">{label}</p>
              <Select value={v} onValueChange={set}>
                <SelectTrigger className="h-12"><SelectValue placeholder="선택" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">낮음</SelectItem>
                  <SelectItem value="mid">보통</SelectItem>
                  <SelectItem value="high">높음</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      ),
    },
    6: {
      q: "주로 활동하는 시간대를 알려주세요 (선택)",
      node: (
        <div className="space-y-2">
          {timeSlots.map((t) => (
            <label
              key={t}
              className={`flex h-12 cursor-pointer items-center gap-2 rounded-xl border-2 px-3.5 transition-smooth ${
                activity.includes(t)
                  ? "border-primary bg-secondary"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <Checkbox checked={activity.includes(t)} onCheckedChange={() => toggleAct(t)} />
              <span className="text-sm">{t}</span>
            </label>
          ))}
        </div>
      ),
    },
    7: {
      q: "마지막이에요! 알림은 어떻게 받으실까요?",
      node: (
        <div className="space-y-3">
          {[
            { k: "night", label: "전날 밤 알림", desc: "내일 날씨를 미리 알려드려요" },
            { k: "morning", label: "당일 아침 알림", desc: "등원 전 옷차림 가이드" },
            { k: "summary", label: "하루 요약", desc: "저녁에 하루 환경 정리" },
          ].map((n) => (
            <div key={n.k} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
              <div>
                <p className="font-medium">{n.label}</p>
                <p className="text-xs text-muted-foreground">{n.desc}</p>
              </div>
              <Switch
                checked={notif[n.k as keyof typeof notif]}
                onCheckedChange={(v) => setNotif({ ...notif, [n.k]: v })}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => toast.info("카카오톡 연동은 준비 중이에요")}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-kakao text-sm font-semibold text-kakao-foreground"
          >
            💬 카카오톡 알림 연동
          </button>
        </div>
      ),
    },
  };

  const cur = questions[step];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="border-b border-border/60">
        <div className="container-mobile flex h-14 items-center justify-between">
          <button onClick={prev} className="-ml-2 rounded-full p-2 text-foreground hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Link to="/home" className="text-xs text-muted-foreground hover:text-foreground">
            나중에 이어서 하기
          </Link>
        </div>
        {/* Progress */}
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

      <main className="container-mobile flex flex-1 flex-col py-8">
        {/* AI bubble */}
        <div key={step} className="animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-xl">
              🌤️
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-secondary px-4 py-3">
              <p className="leading-relaxed text-foreground">{cur.q}</p>
            </div>
          </div>

          <div className="mt-8">{cur.node}</div>
        </div>

        <div className="mt-auto pt-8">
          <Button
            onClick={next}
            size="lg"
            className="h-12 w-full bg-primary text-primary-foreground hover:bg-primary-hover text-base shadow-soft"
          >
            {step === TOTAL ? "완료" : "다음"}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Onboarding;
