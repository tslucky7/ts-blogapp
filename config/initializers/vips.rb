begin
  require "vips"
  Vips.block_untrusted(true)
rescue LoadError
  # libvips isn't installed on this machine (e.g. local dev without `brew install vips`).
  # Production images install libvips via apt, so this only affects local boot.
  Rails.logger.warn("libvips not found; Vips.block_untrusted was not enabled") if defined?(Rails.logger)
end
