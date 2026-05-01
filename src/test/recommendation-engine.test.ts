import { describe, it, expect } from "vitest";
import { buildRecommendation } from "@/lib/recommendation-engine";
import type { ChildProfile } from "@/lib/profile";
import type { WeatherData } from "@/lib/weather-api";

const baseProfile: ChildProfile = {
  id: "test-1",
  name: "지우",
  emoji: "👧",
  age: "6세",
  gender: "female",
  createdAt: 0,
};

const baseWeather: WeatherData = {
  temp: 15,
  dustLevel: "보통",
  pollenLevel: "보통",
  uvIndex: 3,
  humidity: 50,
  windSpeed: "보통",
  timeline: [
    { time: "등원시간", hour: "08:00", icon: "⛅", temp: 15, feels: 13, dust: "보통", uv: "낮음", pollen: "보통", humidity: 50, wind: "보통" },
  ],
};

describe("buildRecommendation", () => {
  it("비염 있는 아이 + 꽃가루 높음 → 마스크 필수 표시", () => {
    const profile = { ...baseProfile, conditions: ["비염"] };
    const weather: WeatherData = {
      ...baseWeather,
      pollenLevel: "높음",
      timeline: [{ ...baseWeather.timeline[0], pollen: "높음" }],
    };
    const { checklist, message } = buildRecommendation(profile, weather);
    const mask = checklist.find((c) => c.key === "마스크");
    expect(mask).toBeDefined();
    expect(mask!.text).toContain("필수");
    expect(message).toContain("비염");
  });

  it("비염 없는 아이 + 꽃가루 높음 → 마스크 주의 표시", () => {
    const weather: WeatherData = {
      ...baseWeather,
      pollenLevel: "높음",
      timeline: [{ ...baseWeather.timeline[0], pollen: "높음" }],
    };
    const { checklist } = buildRecommendation(baseProfile, weather);
    const mask = checklist.find((c) => c.key === "마스크");
    expect(mask).toBeDefined();
    expect(mask!.text).not.toContain("필수");
  });

  it("기온 10도 미만 → 두꺼운 외투 추가", () => {
    const weather: WeatherData = {
      ...baseWeather,
      temp: 8,
      timeline: [{ ...baseWeather.timeline[0], temp: 8, feels: 6 }],
    };
    const { checklist } = buildRecommendation(baseProfile, weather);
    expect(checklist.find((c) => c.key === "외투")).toBeDefined();
  });

  it("기온 10~17도 → 가디건 추가", () => {
    const { checklist } = buildRecommendation(baseProfile, baseWeather);
    expect(checklist.find((c) => c.key === "가디건")).toBeDefined();
  });

  it("바람 강함 → 목수건 추가", () => {
    const weather: WeatherData = {
      ...baseWeather,
      windSpeed: "강함",
      timeline: [{ ...baseWeather.timeline[0], wind: "강함" }],
    };
    const { checklist } = buildRecommendation(baseProfile, weather);
    expect(checklist.find((c) => c.key === "목수건")).toBeDefined();
  });

  it("습도 낮음 → 보습제 추가", () => {
    const weather: WeatherData = {
      ...baseWeather,
      humidity: 35,
      timeline: [{ ...baseWeather.timeline[0], humidity: 35 }],
    };
    const { checklist } = buildRecommendation(baseProfile, weather);
    expect(checklist.find((c) => c.key === "보습제")).toBeDefined();
  });

  it("배지 개수는 항상 5개", () => {
    const { badges } = buildRecommendation(baseProfile, baseWeather);
    expect(badges).toHaveLength(5);
  });

  it("미세먼지 나쁨 → 미세먼지 배지 warn", () => {
    const weather: WeatherData = { ...baseWeather, dustLevel: "나쁨" };
    const { badges } = buildRecommendation(baseProfile, weather);
    expect(badges.find((b) => b.label === "미세먼지")?.tone).toBe("warn");
  });
});
