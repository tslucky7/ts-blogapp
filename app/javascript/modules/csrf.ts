/**
 * CSRFトークンを取得するヘルパー関数
 * Railsのcsrf_meta_tagsが出力する <meta name="csrf-token" ...> から取得する
 *
 * @returns CSRFトークン（見つからない場合はnull）
 */
export const getCsrfToken = (): string | null => {
  const metaTag = document.querySelector<HTMLMetaElement>(
    'meta[name="csrf-token"]'
  );
  return metaTag?.content || null;
};
