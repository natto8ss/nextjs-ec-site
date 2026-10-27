import { AuthUser, getAuthUser } from "@/lib/auth";
import { executeQuery } from "@/lib/db";
import { NextResponse } from "next/server";

// お気に入り情報の型定義
interface Favorite {
  id: number;
}

// 商品のお気に入り登録状態を取得
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ログインユーザーを取得
    const user: AuthUser | null = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { message: "ログインしてください。" },
        { status: 401 }
      );
    }

    // URLから商品IDを取得
    const { id } = await params;

    // お気に入り情報を取得
    const favorites = await executeQuery<Favorite>(
      `SELECT id
       FROM favorites
       WHERE product_id = ? AND user_id = ?`,
      [id, user.userId]
    );

    // お気に入り登録の有無を返す
    return NextResponse.json(favorites.length > 0);
  } catch (error) {
    console.error("お気に入り取得エラー:", error);

    return NextResponse.json(
      { message: "サーバーエラーが発生しました。" },
      { status: 500 }
    );
  }
}

// お気に入りを解除
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ログインユーザーを取得
    const user: AuthUser | null = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { message: "ログインしてください。" },
        { status: 401 }
      );
    }

    // URLから商品IDを取得
    const { id } = await params;

    // お気に入り情報を削除
    await executeQuery(
      `DELETE FROM favorites
       WHERE product_id = ? AND user_id = ?`,
      [id, user.userId]
    );

    return NextResponse.json({
      message: "お気に入りを解除しました。",
    });
  } catch (error) {
    console.error("お気に入り削除エラー:", error);

    return NextResponse.json(
      { message: "サーバーエラーが発生しました。" },
      { status: 500 }
    );
  }
}