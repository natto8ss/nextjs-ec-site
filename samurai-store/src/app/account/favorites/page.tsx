
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";

// お気に入り商品の型定義
interface FavoriteProduct {
  id: number;
  product_id: number;
  user_id: number;
  created_at: string;
  name: string;
  price: number;
  stock: number;
  image_url: string | null;
}

// お気に入り一覧ページ
export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { addItem, isInCart } = useCart();

  // お気に入り一覧を取得
  useEffect(() => {
    const getFavorites = async () => {
      try {
        const res = await fetch("/api/favorites", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("お気に入りの取得に失敗しました。");
        }

        const data = await res.json();
        setFavorites(data.favoritesData);
      } catch (error) {
        console.error("お気に入り取得エラー:", error);
        setError("お気に入りを取得できませんでした。");
      } finally {
        setIsLoading(false);
      }
    };

    getFavorites();
  }, []);

  // カートに商品を1つ追加
  const handleCart = (product: FavoriteProduct) => {
    addItem(
      {
        id: product.product_id.toString(),
        title: product.name,
        price: product.price,
        imageUrl: product.image_url ?? "",
      },
      1
    );
  };

  // お気に入りを解除
  const handleDelete = async (product: FavoriteProduct) => {
    const confirmed = window.confirm(
      "本当にお気に入りから削除しますか？"
    );

    if (!confirmed) return;

    setDeletingId(product.product_id);

    try {
      const res = await fetch(
        `/api/favorites/${product.product_id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("お気に入りの解除に失敗しました。");
      }

      // 削除した商品を一覧から除外
      setFavorites((prev) =>
        prev.filter((item) => item.id !== product.id)
      );
    } catch (error) {
      console.error("お気に入り削除エラー:", error);
      alert("お気に入りの解除に失敗しました。");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <Link
        href="/account"
        className="text-indigo-600 hover:underline"
      >
        ← マイページへ戻る
      </Link>

      <h1 className="text-2xl font-bold my-8">
        お気に入り一覧
      </h1>

      {isLoading ? (
        <p>読み込み中...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : favorites.length === 0 ? (
        <p>お気に入り商品はありません。</p>
      ) : (
        <div className="space-y-4">
          {favorites.map((product) => {
            const inCart = isInCart(
              product.product_id.toString()
            );

            return (
              <div
                key={product.id}
                className="flex flex-col sm:flex-row gap-6 border rounded-md p-4"
              >
                <Link
                  href={`/products/${product.product_id}`}
                >
                  <Image
                    src={
                      product.image_url
                        ? `/uploads/${product.image_url}`
                        : "/images/no-image.jpg"
                    }
                    alt={product.name}
                    width={120}
                    height={120}
                    className="w-[120px] h-[120px] object-contain"
                  />
                </Link>

                <div className="flex-1">
                  <h2 className="font-bold mb-2">
                    {product.name}
                  </h2>

                  <p className="text-indigo-600 font-bold">
                    ¥{product.price.toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col gap-3 justify-center">
                  <button
                    type="button"
                    onClick={() => handleCart(product)}
                    disabled={inCart || product.stock <= 0}
                    className={`px-4 py-2 rounded-sm text-white ${
                      inCart || product.stock <= 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-500 hover:bg-indigo-600"
                    }`}
                  >
                    {inCart
                      ? "追加済み"
                      : product.stock <= 0
                        ? "売り切れ"
                        : "カートに追加"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(product)}
                    disabled={deletingId !== null}
                    className="border border-red-500 text-red-500 px-4 py-2 rounded-sm hover:bg-red-50 disabled:opacity-50"
                  >
                    お気に入り解除
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
