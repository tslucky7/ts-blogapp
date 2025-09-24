# == Schema Information
#
# Table name: profiles
#
#  id           :integer          not null, primary key
#  birthday     :date
#  gender       :integer
#  introduction :text
#  nickname     :string
#  subscribed   :boolean
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  user_id      :integer          not null
#
# Indexes
#
#  index_profiles_on_user_id  (user_id)
#
class Profile < ApplicationRecord
  enum gender: { male: 0, female: 1, other: 2 }
  belongs_to :user

  def age
    # 誕生日が未入力（nilまたは空）の場合は年齢を計算できないため、「不明」という文字列を返す処理です。
    return "不明" unless birthday.present?
    # 現在の年から誕生年を引いて年齢を計算
    years = Time.zone.now.year - birthday.year
    # 現在の日付と誕生日の日付を比較して、誕生日が過ぎているかどうかを判断
    days = Time.zone.now.yday - birthday.yday

    if days < 0
      # 誕生日が過ぎていない場合は年齢を1つ減らして表示
      "#{years - 1}歳"
    else
      # 誕生日が過ぎている場合は年齢をそのまま表示
      "#{years}歳"
    end
  end
end
