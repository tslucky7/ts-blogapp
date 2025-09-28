class FavoritesController < ApplicationController
  before_action :authenticate_user!

  def index
    # ログインしているユーザーのお気に入りの記事一覧を表示する
    @articles = current_user.favorite_articles
  end
end
