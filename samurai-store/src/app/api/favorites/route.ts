import { AuthUser, getAuthUser } from "@/lib/auth";
import { executeQuery } from "@/lib/db";
import { NextResponse } from "next/server";

// お気に入り情報の型定義
interface FavoriteProduct {
  id: number;
  product_id: number;
  user_id: number;
  created_at: Date;
  name: string;
  price: number;
  stock: number;
  image_url: string | null;
}

// お気に入り一覧を取得する
export async function GET() {
  try {
    // ログインユーザーを取得
    const user: AuthUser | null = await getAuthUser();

    // 未ログインの場合はエラー
    if (!user) {
      return NextResponse.json(
        { message: "ログインしてください。" },
        { status: 401 }
      );
    }

    // ユーザーIDに紐づくお気に入り情報を取得
    const favoritesData = await executeQuery<FavoriteProduct>(
      `SELECT
        favorites.id,
        favorites.product_id,
        favorites.user_id,
        favorites.created_at,
        products.name,
        products.price,
        products.stock,
        products.image_url
      FROM favorites
      JOIN products ON favorites.product_id = products.id
      WHERE favorites.user_id = ?
      ORDER BY favorites.created_at DESC`,
      [user.userId]
    );

    return NextResponse.json({ favoritesData });
  } catch (error) {
    console.error("お気に入り一覧取得エラー:", error);

    return NextResponse.json(
      { message: "サーバーエラーが発生しました。" },
      { status: 500 }
    );
  }
}

// お気に入り商品を登録する
export async function POST(request: Request) {
  try {
    // ログインユーザーを取得
    const user: AuthUser | null = await getAuthUser();

    // 未ログインの場合はエラー
    if (!user) {
      return NextResponse.json(
        { message: "ログインしてください。" },
        { status: 401 }
      );
    }

    // リクエストから商品IDを取得
    const { product_id } = await request.json();

    // 商品IDの入力チェック
    if (!Number.isInteger(product_id) || product_id <= 0) {
      return NextResponse.json(
        { message: "正しい商品IDを指定してください。" },
        { status: 400 }
      );
    }

    // お気に入り情報をデータベースに登録
    await executeQuery(
      `INSERT IGNORE INTO favorites (product_id, user_id)
       VALUES (?, ?)`,
      [product_id, user.userId]
    );

    // 登録成功
    return NextResponse.json(
      { message: "お気に入りに登録しました。" },
      { status: 201 }
    );
  } catch (error) {
    console.error("お気に入り登録エラー:", error);

    return NextResponse.json(
      { message: "サーバーエラーが発生しました。" },
      { status: 500 }
    );
  }
}