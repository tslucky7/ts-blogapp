class HomeController < ApplicationController
  def index
    @title = 'デイトラ'
  end

  def about
    @title = 'デイトラについて'
    @description = 'デイトラは、プログラミングを学ぶためのオンライン学習サービスです。'
    @keywords = 'デイトラ, プログラミング, オンライン学習'
  end
end