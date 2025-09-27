class ProfilesController < ApplicationController
  before_action :authenticate_user!

  def show
    @profile = current_user.profile
  end

  def edit
    # if current_user.profile.present?
    #   @profile = current_user.profile
    # else
    #   @profile = current_user.build_profile
    # end
    @profile = current_user.prepare_profile
  end

  def update
    # ユーザーのプロフィールが登録されていれば既存のプロフィールを表示、登録されていなければ新規作成
    @profile = current_user.prepare_profile
    # フォームから送信されたパラメータをプロフィールオブジェクトに代入
    # assign_attributes: ActiveRecordのメソッドで、複数の属性を一度に設定可能
    @profile.assign_attributes(profile_params)
    if @profile.save
      redirect_to profile_path, notice: "プロフィール更新しました"
    else
      flash.now[:error] = "更新できませんでした"
      render :edit
    end
  end

  private
  # セキュリティのために許可されたパラメータのみを抽出
  def profile_params
    params.require(:profile).permit(
      :nickname,
      :introduction,
      :gender,
      :birthday,
      :subscribed,
      :avatar  # ← この行でアバター画像のアップロードを許可
    )
  end
end
