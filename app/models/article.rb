# == Schema Information
#
# Table name: articles
#
#  id         :bigint           not null, primary key
#  title      :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_articles_on_user_id  (user_id)
#
class Article < ApplicationRecord
  has_one_attached :eyecatch
  has_rich_text :content

  validates :title, presence: true, length: { minimum: 2, maximum: 100 }, format: { with: /\A(?!\@).*\z/ }

  validates :content, presence: true, length: { minimum: 10 }, uniqueness: true

  validate :validate_title_and_content_length

  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy

  belongs_to :user

  def display_created_at
    I18n.l(self.created_at, format: :default)
  end

  def author_name
    user.display_name
  end

  def like_count
    # likes自体は、has_many :likesで指定しているため取得可能
    # countは、ActiveRecordのメソッドで、likesテーブル内のレコードの数を取得するメソッド
    likes.count
  end

  private
  def validate_title_and_content_length
    char_count =  self.title.length + self.content.length
    if char_count > 100
      errors.add(:content, "100字以内で入力してください。")
    end
  end
end
