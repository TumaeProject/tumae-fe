import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const user_id = searchParams.get("user_id");
    const min_score = searchParams.get("min_score") || "50";
    const max_distance_km = searchParams.get("max_distance_km");
    const limit = searchParams.get("limit") || "20";
    const offset = searchParams.get("offset") || "0";

    // user_id는 필수 파라미터
    if (!user_id) {
      return NextResponse.json(
        { message: "user_id는 필수 파라미터입니다." },
        { status: 400 }
      );
    }

    // 쿼리 파라미터 구성
    const queryParams = new URLSearchParams({
      user_id,
      min_score,
      limit,
      offset,
    });

    if (max_distance_km) {
      queryParams.append("max_distance_km", max_distance_km);
    }

    const apiUrl = `${getApiUrl("/api/students")}?${queryParams.toString()}`;
    
    console.log("=== 백엔드 API 호출 ===");
    console.log("URL:", apiUrl);
    console.log("queryParams:", queryParams.toString());

    let response;
    let data;
    
    try {
      response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("=== fetch 완료 ===");
      console.log("response.status:", response.status);
      console.log("response.ok:", response.ok);
      console.log("response.headers:", Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log("=== 응답 텍스트 ===");
      console.log("responseText 길이:", responseText.length);
      console.log("responseText:", responseText.substring(0, 500)); // 처음 500자만

      try {
        data = JSON.parse(responseText);
        console.log("=== JSON 파싱 성공 ===");
        console.log("data 타입:", typeof data);
        console.log("data:", JSON.stringify(data, null, 2));
      } catch (parseError) {
        console.error("=== JSON 파싱 실패 ===");
        console.error("parseError:", parseError);
        console.error("responseText:", responseText);
        throw new Error(`응답을 JSON으로 파싱할 수 없습니다: ${parseError}`);
      }
    } catch (fetchError) {
      console.error("=== fetch 에러 ===");
      console.error("fetchError:", fetchError);
      throw fetchError;
    }

    // 에러 응답 로깅
    if (!response.ok) {
      console.error("학생 목록 조회 API 에러 응답:", {
        status: response.status,
        data: JSON.stringify(data, null, 2),
      });
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("학생 목록 조회 API 프록시 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

