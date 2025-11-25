export const metadata = {
  title: 'プライバシーポリシー | UNIVERSIS',
  description:
    'UNIVERSIS（ユニヴェルシス）のプライバシーポリシー。個人情報の取扱い方針について記載しています。',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* ===== Header ===== */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-neutral-900">
            プライバシーポリシー
          </h1>
          <p className="mt-3 text-neutral-600">
            UNIVERSIS（ユニヴェルシス）は、ユーザーの個人情報を適切に保護することを重要な責務と考え、
            以下の方針に基づき個人情報を取り扱います。
          </p>
        </header>

        {/* ===== Sections ===== */}
        <div className="prose prose-neutral max-w-none text-sm sm:text-base leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mt-8 mb-2">
              1. 事業者情報
            </h2>
            <p>
              運営者：UNIVERSIS
              <br />
              連絡先：t.imamoto.universis@gmail.com
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mt-8 mb-2">
              2. 個人情報の取得方法
            </h2>
            <p>
              当サイトでは、お問い合わせフォーム送信時に、氏名・メールアドレス等の個人情報を取得する場合があります。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mt-8 mb-2">
              3. 個人情報の利用目的
            </h2>
            <p>
              取得した個人情報は、以下の目的のために利用します。
              <br />・お問い合わせへの回答および情報提供のため
              <br />・本サイト運営に関するご案内や連絡のため
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mt-8 mb-2">
              4. 個人情報の第三者提供
            </h2>
            <p>
              法令に基づく場合を除き、取得した個人情報を第三者に提供することはありません。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mt-8 mb-2">
              5. 個人情報の委託
            </h2>
            <p>
              お問い合わせフォームの運用には Formspree を利用しており、同社のサーバーを通じて送信されます。
              当サイトは、委託先が適切な個人情報保護を実施していることを確認した上で委託を行います。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mt-8 mb-2">
              6. 安全管理措置
            </h2>
            <p>
              当サイトは、個人情報への不正アクセス、漏洩、紛失等を防止するため、
              適切な安全管理措置を講じています。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mt-8 mb-2">
              7. 個人情報の開示・訂正・削除
            </h2>
            <p>
              ご本人からの請求により、当サイトが保有する個人情報の開示・訂正・削除を行います。
              ご希望の場合は、上記の連絡先までご連絡ください。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mt-8 mb-2">
              8. Cookie等の利用
            </h2>
            <p>
              当サイトでは、アクセス解析（Google Analytics 等）に Cookie を使用する場合があります。
              これにより収集される情報は匿名であり、個人を特定するものではありません。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mt-8 mb-2">
              9. 改訂について
            </h2>
            <p>
              本プライバシーポリシーの内容は、法令の改正等に応じて予告なく変更される場合があります。
              変更後の内容は当ページに掲載した時点で効力を生じます。
            </p>
          </section>

          <p className="mt-10 text-sm text-neutral-500">
            （制定日：2025年11月1日）
          </p>
        </div>
      </div>
    </main>
  );
}
