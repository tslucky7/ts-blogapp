class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  def current_user
    ActiveDecorator::Decorator.instance.decorate(super) if super.present?
    super
  end
end
