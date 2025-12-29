import { getCsrfToken } from './csrf';


/**
 * コメントを追加するフォームを表示する
 */
export const handleCommentForm = () => {
  const showCommentForm = document.querySelector('.show-comment-form');
  showCommentForm?.addEventListener('click', () => {
    showCommentForm.classList.add('hidden');
    const commentTextArea = document.querySelector('.comment-text-area');
    commentTextArea?.classList.remove('hidden');
  });
};

/**
 * 新しいコメントを追加する
 *
 * @param comment コメント
 */
export const appendNewComment = (comment: { id: number; content: string }) => {
  const commentElement = document.createElement('div');
  commentElement.classList.add('article_comment');
  commentElement.textContent = comment.content;
  document.querySelector('.comments-container')?.appendChild(commentElement);
};

/**
 * DBに保存されたコメントを取得する
 *
 * @param articleId 記事ID
 */
export const fetchComments = (articleId: string) => {
  fetch(`/articles/${encodeURIComponent(articleId)}/comments`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText}`
        );
      }
      return response.json();
    })
    .then((responseData) => {
      responseData.forEach((comment: { id: number; content: string }) => {
        appendNewComment(comment);
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

/**
 * コメントを投稿する
 *
 * @param articleId 記事ID
 */
export const postCommentForm = (articleId: string) => {
  // CommentsController#create: POST /articles/:article_id/comments を「作成だけ」する
  const addCommentBtn = document.querySelector('.add-comment-btn');
  addCommentBtn?.addEventListener('click', () => {
    const csrfToken = getCsrfToken();
    if (!csrfToken) {
      console.error('CSRF token not found');
      return;
    }

    const content = (document.querySelector('#comment_content') as HTMLTextAreaElement)?.value || '';
    if (!content) {
      window.alert('コメントを入力してください');
      return;
    } else {
      fetch(`/articles/${encodeURIComponent(articleId)}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ comment: { content: content } }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `HTTP Error: ${response.status} ${response.statusText}`
            );
          }
          return response.json();
        })
        .then((responseData) => {
          appendNewComment(responseData);

          const commentContent = document.querySelector('#comment_content') as HTMLTextAreaElement;
          if (commentContent) {
            commentContent.value = '';
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  });
}