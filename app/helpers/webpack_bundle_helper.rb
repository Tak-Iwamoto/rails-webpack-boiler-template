require "open-uri"

module WebpackBundleHelper
  class BundleNotFound < StandardError; end

  def asset_bundle_path(file)
    valid_file?(file)
    return asset_path("#{asset_server}/" + manifest.fetch(file)) if Rails.env.development?
    return "/assets" + manifest.fetch(file) if Rails.env.production?
    return "/assets-test" + manifest.fetch(file) if Rails.env.test?
  end

  private

  def asset_server
    "http://localhost:3035"
  end

  def pro_manifest
    File.read("public/assets/manifest.json")
  end

  def dev_manifest
    OpenURI.open_uri("#{asset_server}/manifest.json").read
  end

  def test_manifest
    File.read("public/assets-test/manifest.json")
  end

  def manifest
    return @manifest ||= JSON.parse(pro_manifest) if Rails.env.production?
    return @manifest ||= JSON.parse(dev_manifest) if Rails.env.development?
    return @manifest ||= JSON.parse(test_manifest)
  end

  def valid_entry?(entry)
    return true if manifest.key?(entry)
    raise BundleNotFound, "Could not find bundle with name #{entry}"
  end

end