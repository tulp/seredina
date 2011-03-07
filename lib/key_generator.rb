class KeyGenerator
  def self.generate(length = 10)
    hash = (Digest::SHA1.new << Time.now.to_s).to_s
    hash[0..length - 1]
  end
end