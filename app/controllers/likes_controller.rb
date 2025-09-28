class LikesController < ApplicationController
  before_action :authenticate_user!

  def create
    # article_idはarticle.rbでhas_many :likesで指定しているため取得可能
    # なぜarticle_idを取得するのか：routesのarticle_like_pathで、/articles/:article_id/like(.:format)と指定しているため
    article = Article.find(params[:article_id])
    # user.article.createと同じ原理、article.rbでhas_many :likesで指定しているため取得可能
    article.likes.create!(user_id: current_user.id)
    redirect_to article_path(article)
  end
end
