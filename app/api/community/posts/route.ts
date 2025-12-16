import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const order = searchParams.get("order");

    // 쿼리 파라미터 구성
    const queryParams = new URLSearchParams();
    if (page) queryParams.append("page", page);
    if (limit) queryParams.append("limit", limit);
    if (order) queryParams.append("order", order);

    const apiUrl = queryParams.toString() 
      ? `${getApiUrl("/community/posts")}?${queryParams.toString()}`
      : getApiUrl("/community/posts");
    
    console.log("=== 게시글 리스트 조회 API 라우트 ===");
    console.log("URL:", apiUrl);
    console.log("queryParams:", queryParams.toString());

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    // 에러 응답 로깅
    if (!response.ok) {
      console.error("게시글 리스트 조회 API 에러 응답:", {
        status: response.status,
        data: JSON.stringify(result, null, 2),
      });
      return NextResponse.json(result, {
        status: response.status,
      });
    }

    // API 응답 구조: { message, status_code, data }
    // data 필드를 직접 반환하도록 수정
    if (result.data) {
      return NextResponse.json(result.data, {
        status: 200,
      });
    }

    // data 필드가 없는 경우 원본 응답 반환
    return NextResponse.json(result, {
      status: response.status,
    });
  } catch (error) {
    console.error("게시글 리스트 조회 API 프록시 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(getApiUrl("/community/posts"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // 에러 응답 로깅
    if (!response.ok) {
      console.error("글 작성 API 에러 응답:", {
        status: response.status,
        data: JSON.stringify(data, null, 2),
      });
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("글 작성 API 프록시 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

