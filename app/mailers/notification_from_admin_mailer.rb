class NotificationFromAdminMailer < ApplicationMailer
  def notify(user, msg)
    @msg = msg
    mail to: user.email, subject: "【お知らせ】管理者からのお知らせ"
  end
end
