
import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

// お問い合わせ一覧を取得
export async function GET() {
  try {
    // 管理者以外は取得できないようにする
    if (!(await isAdmin())) {
      return NextResponse.json(
        { message: "アクセス権限がありません。" },
        { status: 403 }
      );
    }

    // お問い合わせを新しい順に取得
    const inquiries = await executeQuery(
      `SELECT *
       FROM inquiries
       ORDER BY created_at DESC, id DESC`
    );

    return NextResponse.json({ inquiries });
  } catch (error) {
    console.error("お問い合わせ取得エラー:", error);

    return NextResponse.json(
      { message: "サーバーエラーが発生しました。" },
      { status: 500 }
    );
  }
}

// お問い合わせを登録
export async function POST(request: NextRequest) {
  try {
    // フォームから送信されたデータを取得
    const { name, email, message } = await request.json();

    // 未入力チェック
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !message.trim()
    ) {
      return NextResponse.json(
        { message: "すべての項目を入力してください。" },
        { status: 400 }
      );
    }

    // データベースに登録
    await executeQuery(
      `INSERT INTO inquiries (name, email, message)
       VALUES (?, ?, ?)`,
      [name.trim(), email.trim(), message.trim()]
    );

    return NextResponse.json(
      { message: "お問い合わせを登録しました。" },
      { status: 201 }
    );
  } catch (error) {
    console.error("お問い合わせ登録エラー:", error);

    return NextResponse.json(
      { message: "サーバーエラーが発生しました。" },
      { status: 500 }
    );
  }
}
