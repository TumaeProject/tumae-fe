import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tutor_id: string }> | { tutor_id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const tutorId = resolvedParams.tutor_id;

    if (!tutorId) {
      return NextResponse.json(
        { message: "tutor_id는 필수 파라미터입니다." },
        { status: 400 }
      );
    }

    const apiUrl = getApiUrl(`/resume/${tutorId}`);

    console.log("=== 이력서 조회 API 라우트 ===");
    console.log("tutor_id:", tutorId);
    console.log("API URL:", apiUrl);

    // Authorization 헤더 추가 (클라이언트에서 전달받은 토큰)
    const authHeader = request.headers.get("authorization");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const response = await fetch(apiUrl, {
      method: "GET",
      headers,
    });

    // Content-Type 확인
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("이력서 조회 API 비-JSON 응답:", {
        status: response.status,
        contentType,
        text: text.substring(0, 200),
      });
      return NextResponse.json(
        { message: "서버에서 올바르지 않은 응답을 받았습니다." },
        { status: 500 }
      );
    }

    const data = await response.json();

    // 에러 응답 로깅
    if (!response.ok) {
      console.error("이력서 조회 API 에러 응답:", {
        status: response.status,
        data: JSON.stringify(data, null, 2),
      });
      return NextResponse.json(data, {
        status: response.status,
      });
    }

    // 성공 응답
    console.log("이력서 조회 API 성공:", {
      status: response.status,
      blockCount: Array.isArray(data.data) ? data.data.length : 0,
    });

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("이력서 조회 API 프록시 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tutor_id: string }> | { tutor_id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const tutorId = resolvedParams.tutor_id;

    if (!tutorId) {
      return NextResponse.json(
        { message: "tutor_id는 필수 파라미터입니다." },
        { status: 400 }
      );
    }

    const apiUrl = getApiUrl(`/resume/${tutorId}`);

    console.log("=== 이력서 블록 추가 API 라우트 ===");
    console.log("tutor_id:", tutorId);
    console.log("API URL:", apiUrl);

    // 요청 본문 가져오기
    const body = await request.json();
    console.log("Request Body:", JSON.stringify(body, null, 2));

    // 모든 필드를 query parameter로 변환
    const queryParams = new URLSearchParams();
    
    if (body.block_type) queryParams.append("block_type", body.block_type);
    if (body.title) queryParams.append("title", body.title);
    if (body.period) queryParams.append("period", body.period);
    if (body.role) queryParams.append("role", body.role);
    if (body.description) queryParams.append("description", body.description);
    if (body.tech_stack) queryParams.append("tech_stack", body.tech_stack);
    if (body.issuer) queryParams.append("issuer", body.issuer);
    if (body.acquired_at) queryParams.append("acquired_at", body.acquired_at);
    if (body.file_url) queryParams.append("file_url", body.file_url);
    if (body.link_url) queryParams.append("link_url", body.link_url);

    const queryString = queryParams.toString();
    const apiUrlWithQuery = queryString ? `${apiUrl}?${queryString}` : apiUrl;

    console.log("API URL with query:", apiUrlWithQuery);

    // Authorization 헤더 추가
    const authHeader = request.headers.get("authorization");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const response = await fetch(apiUrlWithQuery, {
      method: "POST",
      headers,
    });

    // Content-Type 확인
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("이력서 블록 추가 API 비-JSON 응답:", {
        status: response.status,
        contentType,
        text: text.substring(0, 200),
      });
      return NextResponse.json(
        { message: "서버에서 올바르지 않은 응답을 받았습니다." },
        { status: 500 }
      );
    }

    const data = await response.json();

    // 에러 응답 로깅
    if (!response.ok) {
      console.error("이력서 블록 추가 API 에러 응답:", {
        status: response.status,
        data: JSON.stringify(data, null, 2),
      });
      return NextResponse.json(data, {
        status: response.status,
      });
    }

    // 성공 응답
    console.log("이력서 블록 추가 API 성공:", {
      status: response.status,
      block_id: data.block_id,
    });

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("이력서 블록 추가 API 프록시 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

