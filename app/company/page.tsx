export const metadata = {
  title: '運営会社 | UNIVERSIS',
  description:
    'UNIVERSIS（ユニヴェルシス）を運営する組織の概要や連絡先情報を掲載しています。',
};

export default function CompanyPage() {
  return (
    <main className="bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* ===== Header ===== */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-neutral-900">
            運営会社
          </h1>
          <p className="mt-3 text-neutral-600">
            UNIVERSIS（ユニヴェルシス）の運営主体およびお問い合わせ先についてご案内します。
          </p>
        </header>

        {/* ===== 会社概要 ===== */}
        <section className="prose prose-neutral max-w-none text-sm sm:text-base leading-relaxed">
          <h2 className="text-lg font-semibold text-neutral-900 mb-2">会社概要</h2>

          <table className="min-w-full border border-neutral-200 text-sm">
            <tbody>
              <tr className="border-b border-neutral-200">
                <th className="bg-neutral-50 px-4 py-2 text-left w-1/3">運営名称</th>
                <td className="px-4 py-2">UNIVERSIS（ユニヴェルシス）</td>
              </tr>
              <tr className="border-b border-neutral-200">
                <th className="bg-neutral-50 px-4 py-2 text-left">法人名／屋号</th>
                <td className="px-4 py-2">UNIVERSIS</td>
              </tr>
              <tr className="border-b border-neutral-200">
                <th className="bg-neutral-50 px-4 py-2 text-left">所在地</th>
                <td className="px-4 py-2">（ご自身で記入）例：東京都◯◯区◯◯町◯丁目◯−◯</td>
              </tr>
              <tr className="border-b border-neutral-200">
                <th className="bg-neutral-50 px-4 py-2 text-left">代表者</th>
                <td className="px-4 py-2">（ご自身で記入）例：代表 山本 陽平</td>
              </tr>
              <tr className="border-b border-neutral-200">
                <th className="bg-neutral-50 px-4 py-2 text-left">設立年月</th>
                <td className="px-4 py-2">（任意）例：2023年4月</td>
              </tr>
              <tr className="border-b border-neutral-200">
                <th className="bg-neutral-50 px-4 py-2 text-left">事業内容</th>
                <td className="px-4 py-2">
                  ・大学ラグビーを中心としたデータ分析・記事制作<br />
                  ・スポーツデータの可視化および分析サービス提供<br />
                  ・チーム・企業向け分析コンサルティング
                </td>
              </tr>
              <tr className="border-b border-neutral-200">
                <th className="bg-neutral-50 px-4 py-2 text-left">連絡先</th>
                <td className="px-4 py-2">
                  メール：universis.contact@gmail.com（例）<br />
                  ※お電話での対応は行っておりません。お問い合わせはフォームよりお願いいたします。
                </td>
              </tr>
              <tr>
                <th className="bg-neutral-50 px-4 py-2 text-left">ウェブサイト</th>
                <td className="px-4 py-2">
                  <a
                    href="https://sportsconnect-lab.github.io/rugby-analyzer-site/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    https://sportsconnect-lab.github.io/rugby-analyzer-site/
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* ===== 代表メッセージ ===== */}
        <section className="mt-12 prose prose-neutral max-w-none text-sm sm:text-base leading-relaxed">
          <h2 className="text-lg font-semibold text-neutral-900 mb-2">代表メッセージ</h2>
          <p>
            UNIVERSISは、大学ラグビーを中心に「データを楽しむ文化をつくる」ことを目的とした分析・メディアプロジェクトです。
            戦術やデータの面白さを多くの方に知っていただくことで、スポーツをより身近で深く楽しめる社会を目指しています。
          </p>
        </section>

        <p className="mt-10 text-sm text-neutral-500 text-right">
          （最終更新日：2025年11月1日）
        </p>
      </div>
    </main>
  );
}
