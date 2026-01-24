class RelationshipMailer < ApplicationMailer
  def new_follower(user, follower)
    @user = user
    @follower = follower
    mail to: user.email, subject: "【お知らせ】新しいフォロワーができました"
  end
end
