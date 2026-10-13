
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// お問い合わせデータの型
type Inquiry = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const res = await fetch("/api/inquiries");

        if (!res.ok) {
          throw new Error("取得に失敗しました");
        }

        const data = await res.json();
        setInquiries(data.inquiries);
      } catch {
        setErrorMessage(
          "お問い合わせ情報の取得に失敗しました。"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <Link
        href="/admin/products"
        className="text-indigo-600 hover:underline"
      >
        ← 商品一覧ページに戻る
      </Link>

      <h1 className="text-center">
        お問い合わせ一覧
      </h1>

      {errorMessage && (
        <p className="text-red-600 mb-4">
          {errorMessage}
        </p>
      )}

      {isLoading ? (
        <p>読み込み中...</p>
      ) : !errorMessage && (
        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="w-full text-left">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">氏名</th>
                <th className="px-6 py-4">メールアドレス</th>
                <th className="px-6 py-4">お問い合わせ内容</th>
                <th className="px-6 py-4">送信日時</th>
              </tr>
            </thead>

            <tbody>
              {inquiries.map((inquiry) => (
                <tr
                  key={inquiry.id}
                  className="bg-white border-t border-gray-200"
                >
                  <td className="px-6 py-4">
                    {inquiry.id}
                  </td>
                  <td className="px-6 py-4">
                    {inquiry.name}
                  </td>
                  <td className="px-6 py-4">
                    {inquiry.email}
                  </td>
                  <td className="px-6 py-4 whitespace-pre-wrap">
                    {inquiry.message}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(
                      inquiry.created_at
                    ).toLocaleString("ja-JP")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {inquiries.length === 0 && (
            <p className="text-center py-6 bg-white">
              お問い合わせはありません。
            </p>
          )}
        </div>
      )}
    </main>
  );
}
