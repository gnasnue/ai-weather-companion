import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";

const features = [
  { icon: "🌤️", title: "통합 환경 정보", desc: "날씨, 미세먼지, 꽃가루, 자외선을 한눈에" },
  { icon: "👶", title: "아이 맞춤 AI 리포트", desc: "우리 아이 체질에 맞게 매일 아침 분석" },
  { icon: "👕", title: "시간대별 옷차림 가이드", desc: "등원부터 저녁 산책까지 시간대별 안내" },
  { icon: "🔔", title: "스마트 알림", desc: "자기 전, 등원 준비 전 맞춤 정보 알림" },
];

const pains = [
  "날씨 앱, 미세먼지 앱, 꽃가루, 자외선 정보… 따로따로 확인하기 너무 번거로워요",
  "일교차가 심한 날 아이 옷차림을 어떻게 해야 할지 매번 헷갈려요",
  "바쁜 아침에 이것저것 고민하고 챙길 시간이 없어요",
  "비염, 아토피, 감기에 잘 걸리는 아이… 민감한 우리 아이 체질에 맞는 꼼꼼한 케어 가이드가 필요해요",
];

const diffs = [
  { icon: "👶", title: "내 아이만을 위한 맞춤 정보", desc: "아이 체질과 건강 정보를 기반으로 꼭 필요한 정보만 골라드려요" },
  { icon: "⏰", title: "시간대별 날씨 정보", desc: "등원, 야외활동, 하원, 저녁 산책까지 시간대별로 미리 확인하세요" },
  { icon: "🤖", title: "엄마 아빠를 위한 AI 비서", desc: "흩어진 정보를 대신 모아 분석까지, 필요한 건 AI가 알아서 다 알려드려요" },
  { icon: "🔬", title: "전문 학회 데이터 기반", desc: "대한소아과학회 등 전문 기관 자료를 근거로 해요" },
];

const reviews = [
  { text: "매일 아침 날씨 앱 3개를 확인했는데, 이제 아이웨더 하나로 끝나요.", who: "7세 딸 엄마, 워킹맘" },
  { text: "등원 준비할 때 아침 날씨만 보고 입혔는데, 낮에 땀 흘릴 수 있다고 미리 알려줘서 좋았어요.", who: "6세 아들 엄마" },
  { text: "오후에 바람이 많이 분다고 알려줘서 감기 잘 걸리는 아이 목수건을 챙길 수 있었어요.", who: "5세 아들 엄마, 맞벌이" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="container-app flex h-16 items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2">
            <Link to="/signup">
              <Button variant="ghost" size="sm" className="text-foreground">로그인</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary-hover shadow-soft">
                무료로 시작하기
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-secondary">
        <div className="container-app py-16 md:py-24 text-center">
          <div className="mx-auto max-w-3xl animate-fade-up">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-background/70 px-3 py-1 text-xs font-medium text-accent shadow-soft">
              ✨ AI 환경 비서
            </span>
            <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
              오늘 우리 아이에게 뭘 입혀야 할지,<br />
              <span className="text-accent">AI가 알려드려요</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
              날씨, 미세먼지, 꽃가루, 자외선까지.<br />
              아이 체질에 맞게 매일 아침 리포트를 보내드려요.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3">
              <Link to="/signup">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary-hover h-12 px-8 text-base shadow-glow">
                  무료로 시작하기
                </Button>
              </Link>
              <Link to="/home" className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                먼저 둘러볼게요 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pain points */}
      <section className="py-16 md:py-24">
        <div className="container-app">
          <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl">
            매일 아침 이런 고민 하고 계신가요?
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {pains.map((p, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-smooth hover:shadow-card">
                <div className="text-3xl">😩</div>
                <p className="mt-3 leading-relaxed text-foreground">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="bg-soft py-16 md:py-24">
        <div className="container-app">
          <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl">
            아이웨더는 이렇게 다릅니다
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {diffs.map((d) => (
              <div key={d.title} className="rounded-2xl bg-background p-6 shadow-soft">
                <div className="text-3xl">{d.icon}</div>
                <h3 className="mt-3 text-lg font-semibold">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="container-app">
          <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl">
            아이웨더가 대신 챙겨드릴게요
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="group rounded-2xl border border-border bg-card p-6 transition-smooth hover:-translate-y-1 hover:border-primary hover:shadow-card">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-2xl">{f.icon}</div>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container-app">
          <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl">
            아이웨더를 사용하는 부모님들의 이야기
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {reviews.map((r, i) => (
              <div key={i} className="rounded-2xl bg-background p-6 shadow-soft">
                <div className="text-2xl text-primary">"</div>
                <p className="leading-relaxed text-foreground">{r.text}</p>
                <p className="mt-4 text-sm text-muted-foreground">— {r.who}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary">
        <div className="container-app py-16 text-center md:py-20">
          <h2 className="text-2xl font-bold tracking-tight text-primary-foreground md:text-3xl">
            오늘부터 아이웨더가 대신 챙겨드릴게요
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-primary-foreground/90">
            매일 아침 바쁜 엄마 아빠 곁에서,<br />
            우리 아이의 하루를 함께 준비합니다.
          </p>
          <Link to="/signup" className="mt-8 inline-block">
            <Button size="lg" className="h-12 bg-background px-8 text-base font-semibold text-foreground hover:bg-background/90">
              무료로 시작하기
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="container-app py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <Logo />
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground">이용약관</a>
              <a href="#" className="hover:text-foreground">개인정보처리방침</a>
              <a href="mailto:hello@aiweather.app" className="hover:text-foreground">hello@aiweather.app</a>
            </div>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">© 2025 아이웨더. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
