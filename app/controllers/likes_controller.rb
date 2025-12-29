class LikesController < ApplicationController
  before_action :authenticate_user!

  # GET /articles/1/like
  def show
    article = Article.find(params[:article_id])
    like_status = current_user.has_liked?(article)
    # ここではお気に入りをしているかの情報のみを返すために定義している
    # renderメソッドにjsonを指定して、JSON形式で返す（通常は内部的にHTMLを返すようになっている articles/showみたいになっている）
    # なぜキャメルケースなのか：javascript側で受け取るためにキャメルケースにする必要があるため
    render json: { hasLiked: like_status }
  end

  def create
    # article_idはarticle.rbでhas_many :likesで指定しているため取得可能
    # なぜarticle_idを取得するのか：routesのarticle_like_pathで、/articles/:article_id/like(.:format)と指定しているため
    article = Article.find(params[:article_id])
    # user.article.createと同じ原理、article.rbでhas_many :likesで指定しているため取得可能
    article.likes.create!(user_id: current_user.id)
    render json: { status: 'ok' }
  end

  def destroy
    article = Article.find(params[:article_id])
    # find_byの!の内訳：!で絶対にいいねしている記事を探し出して削除。そもそもいいねしていない記事に対して削除できるわけがない
    like = article.likes.find_by!(user_id: current_user.id)
    like.destroy!
    
    render json: { status: 'ok' }
  end
end
