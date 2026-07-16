import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, gender, symptoms, agreement } = body;

    // 간단한 백엔드 검증
    if (!name || !phone || !gender || !agreement) {
      return NextResponse.json(
        { success: false, message: "필수 입력 항목이 누락되었습니다." },
        { status: 400 }
      );
    }

    console.log("=== 신규 상담 신청 접수 ===");
    console.log("성함:", name);
    console.log("연락처:", phone);
    console.log("성별:", gender);
    console.log("주요 고민:", symptoms);
    console.log("개인정보동의:", agreement ? "동의함" : "동의안함");
    console.log("===========================");

    // 비동기 처리 지연 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 800));

    return NextResponse.json({
      success: true,
      message: "상담 신청이 성공적으로 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다. 다시 시도해 주세요." },
      { status: 500 }
    );
  }
}
