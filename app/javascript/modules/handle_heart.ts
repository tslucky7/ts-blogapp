import { getCsrfToken } from './csrf';

/**
 * ユーザーの操作に応じて、いいねの表示を更新する
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
 * 初期表示でのいいねの状態を取得する
 *
 * @param articleId 記事ID
 */
export const fetchHeartStatus = (articleId: string) => {
  fetch(`/articles/${encodeURIComponent(articleId)}/like`, {
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
      const hasLiked = responseData.hasLiked;
      handleHeartDisplay(hasLiked);
    })
    .catch((error) => {
      console.error(error);
    });
}

/**
 * いいねを追加する（inactive-heartクリック時）
 *
 * @param articleId 記事ID
 */
export const listenInactiveHeart = (articleId: string): void => {
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
};

/**
 * いいねを削除する（active-heartクリック時）
 *
 * @param articleId 記事ID
 */
export const listenActiveHeart = (articleId: string): void => {
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
};
