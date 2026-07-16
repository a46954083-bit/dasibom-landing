"use client";

import { useState } from "react";
import Image from "next/image";

// 자가진단 항목 타입
interface DiagnosisItem {
  id: number;
  text: string;
}

const diagnosisList: DiagnosisItem[] = [
  { id: 1, text: "밤에 땀이 많이 나고 더워서 자꾸 잠에서 깬다." },
  { id: 2, text: "이유 없이 가슴이 두근거리고 쉽게 예민해진다." },
  { id: 3, text: "오후만 되면 체력이 급격히 떨어지고 늘 피곤하다." },
  { id: 4, text: "손발이 쉽게 차가워지거나 저릿한 느낌이 든다." },
  { id: 5, text: "최근 들어 기억력이 부쩍 흐려지고 집중이 잘 안 된다." },
  { id: 6, text: "뼈와 관절 마디마디가 예전 같지 않고 뻣뻣하다." },
];

export default function Home() {
  // 자가 진단 상태 관리
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<number[]>([]);
  // 성분 정보 탭 상태 관리 (여성용 'female' / 남성용 'male')
  const [ingredientTab, setIngredientTab] = useState<"female" | "male">("female");
  
  // 상담 폼 상태 관리
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gender: "female",
    symptoms: [] as string[],
    agreement: false,
  });
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDiagnosisToggle = (id: number) => {
    if (selectedDiagnosis.includes(id)) {
      setSelectedDiagnosis(selectedDiagnosis.filter((item) => item !== id));
      // 폼의 주요 고민 정보도 연동하여 업데이트
      const diagnosisText = diagnosisList.find((d) => d.id === id)?.text || "";
      setFormData((prev) => ({
        ...prev,
        symptoms: prev.symptoms.filter((s) => s !== diagnosisText),
      }));
    } else {
      setSelectedDiagnosis([...selectedDiagnosis, id]);
      const diagnosisText = diagnosisList.find((d) => d.id === id)?.text || "";
      setFormData((prev) => ({
        ...prev,
        symptoms: [...prev.symptoms, diagnosisText],
      }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSymptomCheckboxChange = (symptomText: string, checked: boolean) => {
    setFormData((prev) => {
      if (checked) {
        return { ...prev, symptoms: [...prev.symptoms, symptomText] };
      } else {
        return { ...prev, symptoms: prev.symptoms.filter((s) => s !== symptomText) };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.name.trim()) {
      setErrorMessage("성함을 입력해 주세요.");
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage("연락처를 입력해 주세요.");
      return;
    }
    // 간단한 연락처 형식 확인
    const phoneRegex = /^[0-9-]{9,14}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
      setErrorMessage("올바른 연락처 형식을 입력해 주세요. (예: 01012345678)");
      return;
    }
    if (!formData.agreement) {
      setErrorMessage("개인정보 수집 및 이용에 동의해 주세요.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitted(true);
        // 제출 후 폼 초기화
        setFormData({
          name: "",
          phone: "",
          gender: "female",
          symptoms: [],
          agreement: false,
        });
        setSelectedDiagnosis([]);
      } else {
        setErrorMessage(result.message || "오류가 발생했습니다. 다시 시도해 주세요.");
      }
    } catch (error) {
      setErrorMessage("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#2C2623] selection:bg-brand-green/20">
      {/* GNB (헤더) */}
      <header className="sticky top-0 z-50 w-full border-b border-brand-beige-dark bg-[#F7F4EF]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:py-5">
          <a href="#" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight text-brand-green md:text-3xl">
              다시봄
            </span>
          </a>
          <nav className="hidden space-x-8 md:flex">
            <a
              href="#diagnosis"
              className="text-lg font-medium text-[#2C2623] transition-colors hover:text-brand-green"
            >
              자가진단
            </a>
            <a
              href="#story"
              className="text-lg font-medium text-[#2C2623] transition-colors hover:text-brand-green"
            >
              브랜드 스토리
            </a>
            <a
              href="#ingredients"
              className="text-lg font-medium text-[#2C2623] transition-colors hover:text-brand-green"
            >
              핵심 효능
            </a>
            <a
              href="#testimonials"
              className="text-lg font-medium text-[#2C2623] transition-colors hover:text-brand-green"
            >
              복용 후기
            </a>
          </nav>
          <div>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full bg-brand-green px-5 py-2.5 text-lg font-semibold text-white transition-all hover:bg-brand-green-dark hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
            >
              혜택 상담 신청
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7 space-y-6 md:space-y-8">
              <span className="inline-block rounded-full bg-brand-green/10 px-4 py-1.5 text-base md:text-lg font-semibold text-brand-green">
                50대 건강 밸런스 케어
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight text-brand-green-dark sm:text-5xl md:text-6xl md:leading-[1.25]">
                눈부셨던 그 시절처럼,<br />
                <span className="text-brand-terracotta">당신의 두 번째 봄</span>을<br />
                다시 켭니다.
              </h1>
              <p className="max-w-2xl text-xl leading-relaxed text-[#2C2623]/80 md:text-2xl">
                급격히 찾아오는 신체 변화에 주저앉지 마세요. 자연에서 찾은 엄선된 원료로 50대 남녀의 깨어진 하루 밸런스를 빈틈없이 채웁니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-xl bg-brand-terracotta px-8 py-4 text-xl font-bold text-white transition-all hover:bg-[#b86435] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-brand-terracotta"
                >
                  첫 구매 특별 혜택 상담받기
                </a>
                <a
                  href="#diagnosis"
                  className="inline-flex items-center justify-center rounded-xl border-2 border-brand-green/30 bg-white/50 px-8 py-4 text-xl font-semibold text-brand-green transition-all hover:bg-white hover:border-brand-green"
                >
                  1분 자가진단 시작하기
                </a>
              </div>
            </div>
            <div className="relative lg:col-span-5 flex justify-center">
              <div className="relative h-[350px] w-full max-w-[450px] sm:h-[450px] overflow-hidden rounded-3xl shadow-2xl ring-8 ring-white/50">
                <Image
                  src="/hero_couple.png"
                  alt="두 번째 봄을 즐기는 50대 부부의 행복한 모습"
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PainPoints & Diagnosis Section */}
      <section id="diagnosis" className="bg-[#EADFD0]/40 py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-brand-green-dark md:text-4xl">
              나도 혹시? 갱년기 자가진단
            </h2>
            <p className="text-xl text-[#2C2623]/80 md:text-2xl">
              최근 부쩍 몸과 마음에 아래와 같은 변화들이 느껴지시나요? 해당하는 항목을 체크해 보세요.
            </p>
          </div>

          <div className="mt-12 grid gap-4">
            {diagnosisList.map((item) => {
              const isSelected = selectedDiagnosis.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => handleDiagnosisToggle(item.id)}
                  className={`flex w-full items-start gap-4 rounded-2xl border-2 p-5 text-left transition-all ${
                    isSelected
                      ? "border-brand-terracotta bg-white shadow-md ring-1 ring-brand-terracotta"
                      : "border-brand-beige-dark bg-white/60 hover:bg-white hover:shadow-sm"
                  }`}
                >
                  <div
                    className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${
                      isSelected
                        ? "border-brand-terracotta bg-brand-terracotta text-white"
                        : "border-[#2C2623]/30"
                    }`}
                  >
                    {isSelected && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 fill-none stroke-current stroke-[3]"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-lg font-medium md:text-xl">{item.text}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-10 rounded-2xl bg-white p-6 md:p-8 text-center shadow-md border border-brand-beige-dark">
            {selectedDiagnosis.length > 0 ? (
              <div className="space-y-4">
                <p className="text-xl font-semibold md:text-2xl">
                  선택하신 항목: <span className="text-brand-terracotta font-extrabold">{selectedDiagnosis.length}개</span>
                </p>
                <p className="text-lg text-[#2C2623]/80 md:text-xl">
                  {selectedDiagnosis.length >= 3
                    ? "갱년기 밸런스가 흐트러진 상태일 확률이 높습니다. 자연 유래 핵심 성분을 통한 맞춤형 케어가 시급합니다."
                    : "초기 갱년기 신호일 수 있습니다. 지금부터 예방 및 활력 충전을 시작해 건강한 밸런스를 유지하세요."}
                </p>
                <a
                  href="#contact"
                  className="mt-2 inline-flex items-center justify-center rounded-xl bg-brand-green px-8 py-3.5 text-lg font-bold text-white transition-all hover:bg-brand-green-dark"
                >
                  맞춤 맞춤 관리 상담 예약하기
                </a>
              </div>
            ) : (
              <p className="text-lg md:text-xl text-[#2C2623]/60 italic font-medium">
                체크리스트에서 겪고 계신 증상을 클릭해 보세요. 분석 결과를 확인하실 수 있습니다.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section id="story" className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="relative lg:col-span-5 flex justify-center">
              <div className="relative h-[300px] w-full max-w-[450px] sm:h-[400px] overflow-hidden rounded-3xl shadow-xl ring-8 ring-white/50">
                <Image
                  src="/nature_ingredients.png"
                  alt="다시봄의 엄선된 건강 자연 원료 석류와 인삼"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
            <div className="lg:col-span-7 space-y-6 md:space-y-8">
              <span className="text-lg font-bold text-brand-green">OUR VALUE</span>
              <h2 className="text-3xl font-extrabold tracking-tight text-brand-green-dark md:text-4xl">
                인위적인 효과가 아닌,<br />몸 스스로 깨어나는 활력을 선물합니다.
              </h2>
              <div className="space-y-4 text-lg leading-relaxed text-[#2C2623]/80 md:text-xl">
                <p>
                  인공적인 화학 성분으로 일시적인 흥분이나 억제를 유도하는 것이 진정한 건강은 아닙니다. 50대의 신체는 외부 변화에 완만하고 안전하게 적응하며 자생할 수 있는 든든한 밸런스가 필요합니다.
                </p>
                <p className="font-medium text-brand-green-dark">
                  다시봄은 엄선된 자연 유래 건강 기능 원료를 오랜 연구진의 노하우와 황금비율 배합으로 담아냈습니다.
                </p>
                <p>
                  식약처에서 까다롭게 인증한 성분만 가득 담아 부작용 우려 없이, 안심하고 매일 아침의 가뿐함을 소생시켜 보세요.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 border-t border-brand-beige-dark pt-8 text-center">
                <div>
                  <p className="text-2xl font-extrabold text-brand-green md:text-3xl">100%</p>
                  <p className="mt-1 text-sm font-semibold text-[#2C2623]/70 md:text-base">식약처 기능성 인정</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-brand-green md:text-3xl">GMP</p>
                  <p className="mt-1 text-sm font-semibold text-[#2C2623]/70 md:text-base">우수제조기준 생산</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-brand-green md:text-3xl">무첨가</p>
                  <p className="mt-1 text-sm font-semibold text-[#2C2623]/70 md:text-base">인공 감미료 배제</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ingredients & Benefits Section */}
      <section id="ingredients" className="bg-[#EADFD0]/30 py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-brand-green-dark md:text-4xl">
              검증된 안전 원료와 맞춤 케어
            </h2>
            <p className="text-xl text-[#2C2623]/80 md:text-2xl">
              남녀의 신체적 변화는 다릅니다. 각각의 신체 구조에 꼭 필요한 핵심 영양을 확인하세요.
            </p>
          </div>

          {/* 탭 버튼 */}
          <div className="mt-12 flex justify-center gap-4">
            <button
              onClick={() => setIngredientTab("female")}
              className={`flex-1 max-w-[220px] rounded-xl py-4 text-xl font-bold transition-all shadow-sm ${
                ingredientTab === "female"
                  ? "bg-brand-green text-white"
                  : "bg-white text-brand-green border border-brand-green/20 hover:bg-brand-green/5"
              }`}
            >
              여성 갱년기 솔루션
            </button>
            <button
              onClick={() => setIngredientTab("male")}
              className={`flex-1 max-w-[220px] rounded-xl py-4 text-xl font-bold transition-all shadow-sm ${
                ingredientTab === "male"
                  ? "bg-brand-green text-white"
                  : "bg-white text-brand-green border border-brand-green/20 hover:bg-brand-green/5"
              }`}
            >
              남성 활력 솔루션
            </button>
          </div>

          {/* 탭 콘텐츠 */}
          <div className="mt-8 rounded-3xl bg-white p-6 md:p-10 shadow-lg border border-brand-beige-dark">
            {ingredientTab === "female" ? (
              <div className="space-y-8">
                <div className="border-b border-brand-beige-dark pb-6 text-center lg:text-left">
                  <span className="rounded-full bg-red-50 text-red-700 px-3 py-1.5 text-base font-semibold">여성용 대표 성분</span>
                  <h3 className="mt-3 text-2xl font-bold text-[#2C2623] md:text-3xl">다시봄 퀸 바이탈 밸런스</h3>
                  <p className="mt-2 text-lg text-[#2C2623]/70">급격히 떨어지는 여성호르몬 감소 시기, 지혜로운 활력 충전비법</p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-2xl bg-[#F7F4EF]/50 p-6 border border-brand-beige-dark/50">
                    <h4 className="text-xl font-bold text-brand-green">1. 석류추출물</h4>
                    <p className="mt-2 text-base text-[#2C2623]/80 md:text-lg leading-relaxed">
                      에스트로겐 3종(에스트론, 에스트라디올, 에스트리올)이 함유되어 인체 여성호르몬과 유사하게 작용합니다. 안면홍조, 발한 등 대표적 여성 갱년기 지수 개선이 임상적으로 증명되었습니다.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#F7F4EF]/50 p-6 border border-brand-beige-dark/50">
                    <h4 className="text-xl font-bold text-brand-green">2. 회화나무열매추출물</h4>
                    <p className="mt-2 text-base text-[#2C2623]/80 md:text-lg leading-relaxed">
                      생리활성 물질인 '소포리코사이드(Sophoricoside)'가 풍부하여 갱년기 여성의 뼈와 심신 건강 밸런스를 체계적으로 관리해 주며, 매끈하고 기품 있는 일상을 되찾아 줍니다.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#F7F4EF]/50 p-6 border border-brand-beige-dark/50">
                    <h4 className="text-xl font-bold text-brand-green">3. 대두이소플라본</h4>
                    <p className="mt-2 text-base text-[#2C2623]/80 md:text-lg leading-relaxed">
                      여성 골밀도 저하가 급격해지는 50대에 칼슘의 재흡수를 도와 뼈 건강 유지를 돕고, 골다공증 위험을 예방합니다.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#F7F4EF]/50 p-6 border border-brand-beige-dark/50">
                    <h4 className="text-xl font-bold text-brand-green">4. 비타민D & 비타민E</h4>
                    <p className="mt-2 text-base text-[#2C2623]/80 md:text-lg leading-relaxed">
                      햇빛 노출이 부족한 시니어의 칼슘 흡수를 도우며, 유해산소로부터 세포를 보호하여 항산화 활력을 선사합니다.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="border-b border-brand-beige-dark pb-6 text-center lg:text-left">
                  <span className="rounded-full bg-blue-50 text-blue-700 px-3 py-1.5 text-base font-semibold">남성용 대표 성분</span>
                  <h3 className="mt-3 text-2xl font-bold text-[#2C2623] md:text-3xl">다시봄 맨 바이탈 밸런스</h3>
                  <p className="mt-2 text-lg text-[#2C2623]/70">체력 저하와 전립선 건강, 자존감 회복을 돕는 강력 포뮬러</p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-2xl bg-[#F7F4EF]/50 p-6 border border-brand-beige-dark/50">
                    <h4 className="text-xl font-bold text-brand-green">1. 쏘팔메토열매추출물</h4>
                    <p className="mt-2 text-base text-[#2C2623]/80 md:text-lg leading-relaxed">
                      기능성 성분인 '로르산' 성분이 전립선 건강에 도움을 주며 남성 갱년기 주요 불편인 빈뇨, 잔뇨감 등을 효과적으로 케어해 자존감 있는 편안한 아침을 제공합니다.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#F7F4EF]/50 p-6 border border-brand-beige-dark/50">
                    <h4 className="text-xl font-bold text-brand-green">2. 옥타코사놀</h4>
                    <p className="mt-2 text-base text-[#2C2623]/80 md:text-lg leading-relaxed">
                      수천 킬로미터를 날아가는 철새들의 에너지원. 체내 글리코겐 저장량을 증가시켜 지구력 한계를 올리고 만성 피로와 무기력증을 단단하게 타파합니다.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#F7F4EF]/50 p-6 border border-brand-beige-dark/50">
                    <h4 className="text-xl font-bold text-brand-green">3. 홍삼 & 아연</h4>
                    <p className="mt-2 text-base text-[#2C2623]/80 md:text-lg leading-relaxed">
                      면역 세포를 활성화하고 에너지 생성을 유도하며, 남성 활력과 호르몬 분비에 직접 관여하는 필수 미네랄 아연을 최적의 함량으로 담았습니다.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#F7F4EF]/50 p-6 border border-brand-beige-dark/50">
                    <h4 className="text-xl font-bold text-brand-green">4. 민들레복합추출물</h4>
                    <p className="mt-2 text-base text-[#2C2623]/80 md:text-lg leading-relaxed">
                      간 기능 개선 및 해독에 유용한 천연 원료로써, 음주나 스트레스로 누적된 체내 피로 물질 분해를 촉진합니다.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-brand-green-dark md:text-4xl">
              실구매 고객이 증명하는 변화
            </h2>
            <p className="text-xl text-[#2C2623]/80 md:text-2xl">
              다시봄과 함께 건강한 두 번째 봄을 살아가고 있는 분들의 이야기입니다.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {/* 후기 1 */}
            <div className="rounded-3xl bg-white p-8 shadow-md border border-brand-beige-dark flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-brand-terracotta">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-6 w-6 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <h4 className="mt-4 text-xl font-bold md:text-2xl text-brand-green-dark">
                  "땀나서 젖던 밤이 편해지고, 얼굴 붉어짐이 사라졌어요!"
                </h4>
                <p className="mt-4 text-lg text-[#2C2623]/85 leading-relaxed md:text-xl">
                  50대 되면서 새벽에 자꾸 땀이 나고 한기가 드는 바람에 깊은 잠을 통 못 잤습니다. 지인 권유로 다시봄 퀸을 시작했는데 3주 정도 지나니까 몸 온도가 조절되는 느낌을 받았어요. 잠을 푹 자서 그런지 아이들이 안색이 몰라보게 밝아졌대요. 보약보다 낫습니다.
                </p>
              </div>
              <div className="mt-6 border-t border-brand-beige-dark pt-4 flex items-center justify-between">
                <span className="text-lg font-bold">여성 실구매자 (53세, 서울)</span>
                <span className="text-base text-brand-green font-semibold">복용 2개월 차</span>
              </div>
            </div>

            {/* 후기 2 */}
            <div className="rounded-3xl bg-white p-8 shadow-md border border-brand-beige-dark flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-brand-terracotta">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-6 w-6 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <h4 className="mt-4 text-xl font-bold md:text-2xl text-brand-green-dark">
                  "빈뇨 현상으로 깰 일이 없고, 퇴근 시간 기운이 다릅니다."
                </h4>
                <p className="mt-4 text-lg text-[#2C2623]/85 leading-relaxed md:text-xl">
                  자다가 화장실을 한두 번씩 꼭 가니까 회사 업무할 때도 지장이 많았습니다. 만성 피로가 일상이었죠. 다시봄 맨을 추천받아 매일 챙겨 먹고 있는데, 화장실 가려고 깨던 버릇이 싹 없어졌습니다. 지구력 성분 덕분인지 주말 등산길 체력도 예전 40대 때 수준으로 회복한 기분입니다.
                </p>
              </div>
              <div className="mt-6 border-t border-brand-beige-dark pt-4 flex items-center justify-between">
                <span className="text-lg font-bold">남성 실구매자 (56세, 부산)</span>
                <span className="text-base text-brand-green font-semibold">복용 3개월 차</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Offer and Contact Form Section */}
      <section id="contact" className="bg-[#1E352F] text-white py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center space-y-4">
            <span className="inline-block rounded-full bg-brand-terracotta px-4 py-1.5 text-base md:text-lg font-bold">
              기간 한정 상담 혜택
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl text-[#F7F4EF]">
              첫 구매 1:1 영양 상담 및 특별 혜택 신청
            </h2>
            <p className="text-lg text-white/80 md:text-xl">
              상담을 남겨주시면 전문 영양사의 맞춤 케어 플랜과 함께 본품 첫 구매 시 최대 40% 할인가 적용 혜택을 드립니다.
            </p>
          </div>

          <div className="mt-12 rounded-3xl bg-white p-6 md:p-10 text-[#2C2623] shadow-2xl">
            {submitted ? (
              <div className="py-12 text-center space-y-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 fill-none stroke-current stroke-[3]" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-extrabold text-brand-green-dark md:text-3xl">혜택 상담 신청 완료</h3>
                <p className="text-lg md:text-xl text-[#2C2623]/80">
                  신청해주셔서 감사합니다.<br />
                  선택하신 고민 영역을 바탕으로 빠른 시일 내에 전문 영양사의 개별 연락을 드리겠습니다.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="inline-flex items-center justify-center rounded-xl border border-brand-green/30 px-6 py-2.5 text-lg font-semibold text-brand-green hover:bg-brand-green/5"
                >
                  새로 문의하기
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMessage && (
                  <div className="rounded-xl bg-red-50 p-4 text-base font-semibold text-red-700 border border-red-200">
                    ⚠️ {errorMessage}
                  </div>
                )}
                
                {/* 성함 */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-lg font-bold text-brand-green-dark">
                    성함 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="성함을 입력해 주세요"
                    className="w-full rounded-xl border border-[#2C2623]/20 bg-[#F7F4EF]/30 px-4 py-3 text-lg font-medium outline-none transition-all focus:border-brand-green focus:bg-white focus:ring-2 focus:ring-brand-green/20"
                    required
                  />
                </div>

                {/* 연락처 */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-lg font-bold text-brand-green-dark">
                    연락처 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="연락처를 입력해 주세요 (숫자만 입력)"
                    className="w-full rounded-xl border border-[#2C2623]/20 bg-[#F7F4EF]/30 px-4 py-3 text-lg font-medium outline-none transition-all focus:border-brand-green focus:bg-white focus:ring-2 focus:ring-brand-green/20"
                    required
                  />
                </div>

                {/* 성별 선택 */}
                <div className="space-y-2">
                  <label className="text-lg font-bold text-brand-green-dark">
                    성별 <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 p-3 font-semibold transition-all ${
                      formData.gender === "female"
                        ? "border-brand-green bg-brand-green/5 text-brand-green font-bold"
                        : "border-[#2C2623]/10 bg-white hover:bg-slate-50"
                    }`}>
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === "female"}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <span>여성용 혜택 상담</span>
                    </label>
                    <label className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 p-3 font-semibold transition-all ${
                      formData.gender === "male"
                        ? "border-brand-green bg-brand-green/5 text-brand-green font-bold"
                        : "border-[#2C2623]/10 bg-white hover:bg-slate-50"
                    }`}>
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === "male"}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <span>남성용 혜택 상담</span>
                    </label>
                  </div>
                </div>

                {/* 주요 고민 다중 선택 */}
                <div className="space-y-2">
                  <label className="text-lg font-bold text-brand-green-dark">
                    주요 관심 및 고민 (중복 선택 가능)
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      "체력 및 활력 저하",
                      "안면홍조 및 상열감",
                      "수면 장애 및 밤땀",
                      "무기력 및 갱년기 우울증",
                      "뼈와 연골 강도 약화",
                      "전립선 기능 및 잔뇨",
                    ].map((symptom) => {
                      const isChecked = formData.symptoms.includes(symptom);
                      return (
                        <label
                          key={symptom}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-base font-medium transition-all ${
                            isChecked
                              ? "border-brand-terracotta bg-brand-terracotta/5 font-semibold text-[#2C2623]"
                              : "border-[#2C2623]/10 bg-white hover:bg-slate-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => handleSymptomCheckboxChange(symptom, e.target.checked)}
                            className="h-5 w-5 rounded border-[#2C2623]/30 text-brand-terracotta focus:ring-brand-terracotta"
                          />
                          <span>{symptom}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 개인정보 이용동의 (크게 설정) */}
                <div className="border-t border-[#2C2623]/10 pt-4">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      id="agreement"
                      name="agreement"
                      checked={formData.agreement}
                      onChange={handleCheckboxChange}
                      className="mt-1 h-6 w-6 rounded border-[#2C2623]/30 text-brand-green focus:ring-brand-green"
                      required
                    />
                    <span className="text-base font-semibold leading-relaxed text-[#2C2623]/80">
                      [필수] 개인정보 수집 및 상담 활용을 위한 수신 동의에 동의합니다.
                      <span className="block text-sm font-normal text-[#2C2623]/60 mt-1">
                        (수집 항목: 성함, 연락처, 기입 정보 / 수집 목적: 1:1 무료 상담 및 제품 정보 제공 안내 / 보유 기간: 목적 달성 후 1년 이내 폐기)
                      </span>
                    </span>
                  </label>
                </div>

                {/* 제출 버튼 */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center rounded-2xl bg-brand-terracotta py-4 text-xl font-bold text-white transition-all hover:bg-[#b86435] focus:outline-none focus:ring-4 focus:ring-brand-terracotta/40 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      상담 예약 접수 중...
                    </span>
                  ) : (
                    "맞춤 무료 상담 및 특별 혜택 신청하기"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#152420] text-white/60 py-12 text-base">
        <div className="mx-auto max-w-7xl px-6 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/10 pb-8 gap-4">
            <span className="text-2xl font-bold text-[#F7F4EF]">다시봄</span>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="hover:underline">이용약관</a>
              <a href="#" className="hover:underline">개인정보처리방침</a>
              <a href="#" className="hover:underline">고객센터</a>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <p>주식회사 다시봄헬스케어 | 대표이사: 홍길동 | 서울특별시 강남구 테헤란로 123</p>
              <p>사업자등록번호: 120-00-00000 | 통신판매업신고번호: 제2026-서울강남-0000호</p>
              <p>고객센터: 1544-0000 (평일 09:00 - 18:00, 주말/공휴일 휴무)</p>
            </div>
            <div className="md:text-right space-y-2">
              <p className="text-sm">※ 본 사이트에서 제공되는 제품 설명 및 건강 정보는 질병 예방 및 치료용 의약품이 아닌 건강기능식품에 대한 설명입니다.</p>
              <p className="text-sm">※ 복용 전 성분을 확인하시고, 만성 질환이나 특이 체질이신 분은 전문의와 상상 후 섭취하시기 바랍니다.</p>
              <p className="mt-4">© 2026 Dasibom Healthcare. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
