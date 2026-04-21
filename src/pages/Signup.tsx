import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const Signup = () => {
  const navigate = useNavigate();
  const [agree, setAgree] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) {
      toast.error("이용약관에 동의해주세요.");
      return;
    }
    toast.success("가입이 완료되었어요! 온보딩을 시작합니다.");
    navigate("/onboarding");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60">
        <div className="container-app flex h-16 items-center justify-between">
          <Logo />
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">홈으로</Link>
        </div>
      </header>

      <main className="container-mobile py-10 md:py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">회원가입</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            우리 아이 맞춤 환경 리포트를 시작해보세요
          </p>
        </div>

        {/* Social */}
        <div className="mt-8 space-y-2.5">
          <button
            type="button"
            onClick={() => toast.info("카카오 로그인은 준비 중이에요")}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-kakao text-sm font-semibold text-kakao-foreground transition-smooth hover:opacity-90"
          >
            <span className="text-lg">💬</span> 카카오로 시작하기
          </button>
          <button
            type="button"
            onClick={() => toast.info("네이버 로그인은 준비 중이에요")}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-naver text-sm font-semibold text-naver-foreground transition-smooth hover:opacity-90"
          >
            <span className="font-black">N</span> 네이버로 시작하기
          </button>
          <button
            type="button"
            onClick={() => toast.info("구글 로그인은 준비 중이에요")}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-semibold text-foreground transition-smooth hover:bg-muted"
          >
            <span>G</span> 구글로 시작하기
          </button>
        </div>

        {/* Divider */}
        <div className="my-7 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">또는</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Email form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" type="email" placeholder="parent@example.com" required className="h-12" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pw">비밀번호</Label>
            <Input id="pw" type="password" placeholder="8자 이상" required className="h-12" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pw2">비밀번호 확인</Label>
            <Input id="pw2" type="password" required className="h-12" />
          </div>

          <div className="space-y-2.5 rounded-xl bg-muted/50 p-4">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <Checkbox checked={agree} onCheckedChange={(v) => setAgree(!!v)} className="mt-0.5" />
              <span className="text-sm leading-relaxed">
                <span className="text-accent font-medium">[필수]</span> 이용약관 및 개인정보처리방침에 동의합니다
              </span>
            </label>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <Checkbox className="mt-0.5" />
              <span className="text-sm leading-relaxed text-muted-foreground">
                [선택] 마케팅 정보 수신에 동의합니다
              </span>
            </label>
          </div>

          <Button
            type="submit"
            size="lg"
            className="h-12 w-full bg-primary text-primary-foreground hover:bg-primary-hover shadow-sog text-base"
          >
            가입하기
          </Button>
        </form>

        <div className="mt-5 text-center">
          <Link to="/home" className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            먼저 둘러볼게요 →
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Signup;
