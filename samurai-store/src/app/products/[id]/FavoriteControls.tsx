"use client";

import { useState } from "react";

interface FavoriteControlsProps {
  productId: number;
  initialIsFavorite: boolean;
}

export default function FavoriteControls({
  productId,
  initialIsFavorite,
}: FavoriteControlsProps) {
  // お気に入りの状態を管理
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);

  // お気に入りの追加・解除
  const handleFavorite = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        isFavorite ? `/api/favorites/${productId}` : "/api/favorites",
        {
          method: isFavorite ? "DELETE" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          ...(!isFavorite && {
            body: JSON.stringify({ product_id: productId }),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("お気に入りの更新に失敗しました。");
      }

      // お気に入りの状態を切り替える
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("お気に入り更新エラー:", error);
      alert("お気に入りの更新に失敗しました。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleFavorite}
      disabled={isLoading}
      style={{ fontFamily: "sans-serif" }}
      className="cursor-pointer transition-opacity hover:opacity-70 disabled:cursor-wait disabled:opacity-50"
    >
      {isFavorite ? "♥ お気に入り解除" : "♡ お気に入り追加"}
    </button>
  );
}