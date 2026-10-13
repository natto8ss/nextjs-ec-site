
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ContactPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputStyle = "w-full border border-gray-300 px-3 py-2 rounded-sm focus:ring-2 focus:ring-indigo-500";
  const labelStyle = "block font-bold mb-1";
  const badgeStyle = "ml-2 px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded-md";

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);

    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const message = String(formData.get("message") || "");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage("すべての項目を入力してください。");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) {
        throw new Error("送信に失敗しました");
      }

      router.push("/?submitted=1");
    } catch {
      setErrorMessage(
        "お問い合わせの送信に失敗しました。"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full border border-slate-300 rounded-md px-4 py-3";


    return (
    <main className="max-w-md mx-auto pt-16 pb-10">
        <Link
        href="/"
        className="text-indigo-600 hover:underline"
        >
        ← トップページに戻る
        </Link>

        <h1 className="text-center mt-6 mb-6">
        お問い合わせ
        </h1>

        {errorMessage && (
        <p className="text-red-600 text-center mb-4">
            {errorMessage}
        </p>
        )}

        <form
        onSubmit={handleSubmit}
        className="w-full space-y-6 p-8 bg-white shadow-lg rounded-xl"
        >
        <div>
            <label htmlFor="name" className={labelStyle}>
            氏名
            <span className={badgeStyle}>必須</span>
            </label>
            <input
            id="name"
            name="name"
            type="text"
            required
            className={inputStyle}
            />
        </div>

        <div>
            <label htmlFor="email" className={labelStyle}>
            メールアドレス
            <span className={badgeStyle}>必須</span>
            </label>
            <input
            id="email"
            name="email"
            type="email"
            required
            className={inputStyle}
            />
        </div>

        <div>
            <label htmlFor="message" className={labelStyle}>
            お問い合わせ内容
            <span className={badgeStyle}>必須</span>
            </label>
            <textarea
            id="message"
            name="message"
            rows={5}
            required
            className={inputStyle}
            />
        </div>

        <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-sm font-semibold disabled:opacity-50"
        >
            {isSubmitting ? "送信中..." : "送信"}
        </button>
        </form>
    </main>
    );

}
