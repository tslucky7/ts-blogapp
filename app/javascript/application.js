// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "./controllers"

import $ from 'jquery';
import axios from 'axios';
import { csrfToken } from "@rails/ujs";

axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken();

const handleHeartDisplay = (hasLiked) => {
  const activeHeart = document.querySelector('.active-heart');
  const inactiveHeart = document.querySelector('.inactive-heart');
  if (hasLiked) {
    activeHeart.classList.remove('hidden');
    inactiveHeart.classList.add('hidden');
  }
  else {
    inactiveHeart.classList.remove('hidden');
    activeHeart.classList.add('hidden');
  }
}

const handleCommentForm = () => {
  $('.show-comment-form').on('click', () => {
    $('.show-comment-form').addClass('hidden');
    $('.comment-text-area').removeClass('hidden');
  });
}

const appendNewComment = (comment) => {
  $('.comments-container').append(
    `<div class="article_comment">
      <p>${comment.content}</p>
    </div>`
  );
}

document.addEventListener('turbo:load', () => {
  const dataset = $('#article-show').data();
  const articleId = dataset.articleId;

  axios.get(`/articles/${articleId}/comments`)
    .then((response) => {
      const comments = response.data;
      comments.forEach((comment) => {
        appendNewComment(comment);
      });
    })
    .catch((error) => {
      console.error(error);
    });

  handleCommentForm();

  $('.add-comment-btn').on('click', () => {
    const content = $('#comment_content').val();
    if (!content) {
      window.alert('コメントを入力してください');
      return;
    } else {
      axios.post(`/articles/${articleId}/comments`, {
        comment: {content: content}
      })
        .then((response) => {
          const comment = response.data;
          appendNewComment(comment);
          $('.comment_content').val('');
        })
    }
  });

  axios.get(`/articles/${articleId}/like`)
    .then((response) => {
      const hasLiked = response.data.hasLiked;
      handleHeartDisplay(hasLiked);
    })

  $('.inactive-heart').on('click', () => {
    axios.post(`/articles/${articleId}/like`)
      .then((response) => {
        if (response.data.status === 'ok') {
          $('.active-heart').removeClass('hidden');
          $('.inactive-heart').addClass('hidden');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });

  $('.active-heart').on('click', () => {
    axios.delete(`/articles/${articleId}/like`)
      .then((response) => {
        if (response.data.status === 'ok') {
          $('.active-heart').addClass('hidden');
          $('.inactive-heart').removeClass('hidden');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });
});