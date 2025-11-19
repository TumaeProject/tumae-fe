import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(getApiUrl("/auth/signup"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // 에러 응답 로깅
    if (!response.ok) {
      console.error("회원가입 API 에러 응답:", {
        status: response.status,
        data: JSON.stringify(data, null, 2),
      });
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("회원가입 API 프록시 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
