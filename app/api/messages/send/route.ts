import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const senderId = searchParams.get("sender_id");

    if (!senderId) {
      return NextResponse.json(
        { message: "sender_id는 필수 쿼리 파라미터입니다." },
        { status: 400 }
      );
    }

    const body = await request.json();
    console.log("=== 쪽지 전송 API 라우트 ===");
    console.log("sender_id (query):", senderId);
    console.log("요청 본문:", body);

    if (!body.receiver_id || !body.subject || !body.body) {
      return NextResponse.json(
        { message: "receiver_id, subject, body는 필수 필드입니다." },
        { status: 400 }
      );
    }

    // Query parameter로 sender_id 전달
    const queryParams = new URLSearchParams({
      sender_id: String(senderId),
    });

    const apiUrl = `${getApiUrl("/messages/send")}?${queryParams.toString()}`;
    console.log("백엔드 API 호출 URL:", apiUrl);

    // 요청 본문 구성 (reply_to는 선택적)
    const requestBody: {
      receiver_id: number;
      subject: string;
      body: string;
      reply_to?: number;
    } = {
      receiver_id: body.receiver_id,
      subject: body.subject,
      body: body.body,
    };

    if (body.reply_to) {
      requestBody.reply_to = body.reply_to;
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();

    // 에러 응답 로깅
    if (!response.ok) {
      console.error("쪽지 전송 API 에러 응답:", {
        status: response.status,
        data: JSON.stringify(result, null, 2),
      });
      return NextResponse.json(result, {
        status: response.status,
      });
    }

    // 성공 응답 (201 Created)
    return NextResponse.json(result, {
      status: 201,
    });
  } catch (error) {
    console.error("쪽지 전송 API 프록시 오류:", error);
    return NextResponse.json(
      {
        message: "서버 오류가 발생했습니다.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

