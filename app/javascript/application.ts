// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import '@hotwired/turbo-rails';
import './controllers';
import { fetchComments, handleCommentForm, postCommentForm } from './modules/handle_comment';
import { fetchHeartStatus, listenInactiveHeart, listenActiveHeart } from './modules/handle_heart';

// app/javascript/application.jsのjQueryをTypeScriptに変換したもの。
// jqueryではaxiosを使用しているが、TypeScriptでは純粋なtsのみでの実装を方針とする。
document.addEventListener('turbo:load', () => {
  const articleShow = document.querySelector('#article-show');
  if (!articleShow) return;

  const articleId = articleShow.getAttribute('data-article-id');
  if (!articleId) return;

  // コメント機能のハンドリング
  fetchComments(articleId);
  handleCommentForm();
  postCommentForm(articleId);

  // いいね機能のハンドリング
  fetchHeartStatus(articleId);
  listenInactiveHeart(articleId);
  listenActiveHeart(articleId);
});
