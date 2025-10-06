# == Schema Information
#
# Table name: users
#
#  id                     :integer          not null, primary key
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  remember_created_at    :datetime
#  reset_password_sent_at :datetime
#  reset_password_token   :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#
# Indexes
#
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#
class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :articles, dependent: :destroy
  has_many :likes, dependent: :destroy
  # favorite_articles: この名前のテーブルは存在しない。あくまでarticleのエイリアスと考えていい。
  # through: :likes likesテーブルを介してarticleテーブルにアクセスする
  # source: :article articleテーブルを参照するという意味。すでに:articleが指定されているのに加え、お気に入り記事というのがわかりづらいため
  has_many :favorite_articles, through: :likes, source: :article
  has_one :profile, dependent: :destroy

  # delegateメソッドを使用することによりメソッドの記載を簡略化できる
  # to: :profileとすることにより、profileモデルのbirthdayとgenderメソッドをUserモデルで使用できるようになる
  # allow_nil: trueを指定することにより、profileがnilの場合はnilを返す
  delegate :birthday, :age, :gender, to: :profile, allow_nil: true

  def has_written?(article)
    articles.exists?(id: article.id)
  end

  # いいねを押しているかどうかを判断するメソッド
  def has_liked?(article)
    # likesテーブルに、ユーザーがいいねを押した記事のidに一致する、likesテーブル側のarticle_idが存在するかどうかを判断する
    likes.exists?(article_id: article.id)
  end

  def display_name
    # 以下のコードはネストされた条件演算子。
    # profileがnilでなく、かつprofile.nicknameがnilでない場合はprofile.nicknameを返し、そうでない場合はself.email.split("@")[0]を返す
    # if profile && profile.nickname
    #   profile.nickname
    # else
    #   self.email.split("@")[0]
    # end

    # ボッチ演算子では上記のコードを以下のように書き換えることができる
    profile&.nickname || self.email.split("@")[0]
    # -> ["cohki0305", "gmail.com"]
  end

  def prepare_profile
    profile || build_profile
  end

  # attached?はActive Storageのメソッドで、画像がアップロードされているかどうかを判断する
  # profileとavatarはボッチ演算子で判定する必要がある
  def avatar_image
    if profile&.avatar&.attached?
      profile&.avatar
    else
      "default-avatar.png"
    end
  end
end
