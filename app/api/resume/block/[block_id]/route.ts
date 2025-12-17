import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ block_id: string }> | { block_id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const blockId = resolvedParams.block_id;

    if (!blockId) {
      return NextResponse.json(
        { message: "block_id는 필수 파라미터입니다." },
        { status: 400 }
      );
    }

    // current_user_id를 query parameter에서 가져오기
    const { searchParams } = new URL(request.url);
    const currentUserId = searchParams.get("current_user_id");

    if (!currentUserId) {
      return NextResponse.json(
        { message: "current_user_id는 필수 파라미터입니다." },
        { status: 400 }
      );
    }

    const apiUrl = getApiUrl(`/resume/block/${blockId}?current_user_id=${currentUserId}`);

    console.log("=== 이력서 블록 삭제 API 라우트 ===");
    console.log("block_id:", blockId);
    console.log("current_user_id:", currentUserId);
    console.log("API URL:", apiUrl);

    // Authorization 헤더 추가
    const authHeader = request.headers.get("authorization");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers,
    });

    const data = await response.json();

    // 에러 응답 로깅
    if (!response.ok) {
      console.error("이력서 블록 삭제 API 에러 응답:", {
        status: response.status,
        data: JSON.stringify(data, null, 2),
      });
      return NextResponse.json(data, {
        status: response.status,
      });
    }

    // 성공 응답
    console.log("이력서 블록 삭제 API 성공:", {
      status: response.status,
      message: data.message,
    });

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("이력서 블록 삭제 API 프록시 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ block_id: string }> | { block_id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const blockId = resolvedParams.block_id;

    if (!blockId) {
      return NextResponse.json(
        { message: "block_id는 필수 파라미터입니다." },
        { status: 400 }
      );
    }

    const apiUrl = getApiUrl(`/resume/block/${blockId}`);

    console.log("=== 이력서 블록 수정 API 라우트 ===");
    console.log("block_id:", blockId);
    console.log("API URL:", apiUrl);

    // 요청 본문 가져오기
    const body = await request.json();
    console.log("Request Body:", JSON.stringify(body, null, 2));

    // Authorization 헤더 추가
    const authHeader = request.headers.get("authorization");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const response = await fetch(apiUrl, {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // 에러 응답 로깅
    if (!response.ok) {
      console.error("이력서 블록 수정 API 에러 응답:", {
        status: response.status,
        data: JSON.stringify(data, null, 2),
      });
      return NextResponse.json(data, {
        status: response.status,
      });
    }

    // 성공 응답
    console.log("이력서 블록 수정 API 성공:", {
      status: response.status,
      message: data.message,
    });

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("이력서 블록 수정 API 프록시 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

