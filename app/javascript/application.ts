// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import '@hotwired/turbo-rails';
import './controllers';

/**
 * CSRFトークンを取得するヘルパー関数
 * Railsのcsrf_meta_tagsから取得(app/views/layouts/application.html.hamlにて設置されている)
 *
 * @returns CSRFトークン
 */
const getCsrfToken = (): string | null => {
  const metaTag = document.querySelector<HTMLMetaElement>(
    'meta[name="csrf-token"]'
  );
  return metaTag?.content || null;
};

/**
 * いいねの表示を更新する
 *
 * @param hasLiked いいねがあるかどうか
 */
const handleHeartDisplay = (hasLiked: boolean) => {
  const activeHeart = document.querySelector('.active-heart');
  const inactiveHeart = document.querySelector('.inactive-heart');

  if (hasLiked) {
    activeHeart?.classList.remove('hidden');
    inactiveHeart?.classList.add('hidden');
  } else {
    inactiveHeart?.classList.remove('hidden');
    activeHeart?.classList.add('hidden');
  }
};

/**
 * コメントを追加するフォームを表示する
 */
const handleCommentForm = () => {
  const showCommentForm = document.querySelector('.show-comment-form');
  showCommentForm?.addEventListener('click', () => {
    showCommentForm.classList.add('hidden');
    const commentTextArea = document.querySelector('.comment-text-area');
    commentTextArea?.classList.remove('hidden');
  });
}

/**
 * 新しいコメントを追加する
 *
 * @param comment コメント
 */
const appendNewComment = (comment: { id: number, content: string }) => {
  const commentElement = document.createElement('div');
  commentElement.classList.add('article_comment');
  commentElement.textContent = comment.content;
  document.querySelector('.comments-container')?.appendChild(commentElement);
}

// app/javascript/application.jsのjQueryをTypeScriptに変換したもの。
// jqueryではaxiosを使用しているが、TypeScriptでは純粋なtsのみでの実装を方針とする。
document.addEventListener('turbo:load', () => {
  const articleShow = document.querySelector('#article-show');
  if (!articleShow) return;

  const articleId = articleShow.getAttribute('data-article-id');
  if (!articleId) return;

  // CommentsController#index: GET /articles/:article_id/comments を「取得だけ」する
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
        responseData.forEach((comment: { id: number, content: string }) => {
          appendNewComment(comment);
        });
      })
      .catch((error) => {
        console.error(error);
      });

  handleCommentForm();

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
  })

  // LikesController#show: GET /articles/:article_id/like を「取得だけ」する
  // axios.get()をfetch()に変換（純粋なTypeScript）
  fetch(`/articles/${encodeURIComponent(articleId)}/like`, {
    method: 'GET',
    headers: {
      // Rails側がJSONを返すのでJSONを要求する
      Accept: 'application/json',
      // いわゆるAjaxリクエストとして扱いたい場合（必須ではない）
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
      const hasLiked = responseData.hasLiked;
      handleHeartDisplay(hasLiked);
    })
    .catch((error) => {
      console.error(error);
    });

  // いいねを追加する（inactive-heartクリック時）
  // axios.post()をfetch()に変換（純粋なTypeScript）
  const inactiveHeart = document.querySelector('.inactive-heart');
  inactiveHeart?.addEventListener('click', (event) => {
    event.preventDefault(); // リンクのデフォルト動作を防ぐ

    const csrfToken = getCsrfToken();
    if (!csrfToken) {
      console.error('CSRF token not found');
      return;
    }

    fetch(`/articles/${encodeURIComponent(articleId)}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
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
        console.log(responseData);
        // いいね状態を再取得して表示を更新
        return fetch(`/articles/${encodeURIComponent(articleId)}/like`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
        });
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
        handleHeartDisplay(responseData.hasLiked);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  // いいねを削除する（active-heartクリック時）
  // axios.delete()をfetch()に変換（純粋なTypeScript）
  const activeHeart = document.querySelector('.active-heart');
  activeHeart?.addEventListener('click', (event) => {
    event.preventDefault(); // リンクのデフォルト動作を防ぐ

    const csrfToken = getCsrfToken();
    if (!csrfToken) {
      console.error('CSRF token not found');
      return;
    }

    fetch(`/articles/${encodeURIComponent(articleId)}/like`, {
      method: 'DELETE',
      headers: {
        'X-CSRF-Token': csrfToken,
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
        console.log(responseData);
        // いいね状態を再取得して表示を更新
        return fetch(`/articles/${encodeURIComponent(articleId)}/like`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
        });
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
        handleHeartDisplay(responseData.hasLiked);
      })
      .catch((error) => {
        console.error(error);
      });
  });
});
